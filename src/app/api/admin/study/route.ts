import {
  AdminAuthError,
  assertAdminAccess,
  getSupabaseServiceClient,
} from "@/lib/admin/server";

type Condition = "C0" | "C1" | "C2";

type Enrollment = {
  participant_code: string;
  child_age_band: string;
  condition: Condition;
};
type SessionRow = {
  session_id: string;
  participant_code: string;
  session_index: number;
  topic_id: string | null;
  dropout_flag: boolean;
  parent_intervened_flag: boolean;
  valid_for_primary: boolean;
};
type EventRow = {
  session_id: string;
  event_type: string;
  policy_action: string | null;
  question_code: string | null;
  state_snapshot: Record<string, unknown> | null;
};
type LearningRow = { session_id: string; phase: string; score: number };

type SessionAgg = {
  session_id: string;
  condition: Condition;
  chainDepth: number;
  oracleLike: boolean;
  exploreCompleted: number;
  exploreAssigned: number;
  verifyCount: number;
  escapeUsed: boolean;
  dropout: boolean;
  valid: boolean;
  deepQuestions: number;
  codeableQuestions: number;
  learningGain: number | null;
  frustrationSignals: number;
  boredomSignal: boolean;
};

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function fetchAll<T>(
  supabase: ReturnType<typeof getSupabaseServiceClient>,
  table: string,
  select: string
): Promise<T[]> {
  const out: T[] = [];
  let page = 0;
  const pageSize = 1000;
  for (;;) {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .range(page * pageSize, page * pageSize + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    out.push(...(data as T[]));
    page += 1;
    if (data.length < pageSize) break;
  }
  return out;
}

export async function GET(request: Request) {
  try {
    await assertAdminAccess(request.headers.get("authorization"));
    const supabase = getSupabaseServiceClient();

    const [enrollments, sessions, events, learningItems] = await Promise.all([
      fetchAll<Enrollment>(
        supabase,
        "study_enrollments",
        "participant_code,child_age_band,condition"
      ),
      fetchAll<SessionRow>(
        supabase,
        "study_sessions",
        "session_id,participant_code,session_index,topic_id,dropout_flag,parent_intervened_flag,valid_for_primary"
      ),
      fetchAll<EventRow>(
        supabase,
        "study_events",
        "session_id,event_type,policy_action,question_code,state_snapshot"
      ),
      fetchAll<LearningRow>(
        supabase,
        "study_learning_items",
        "session_id,phase,score"
      ),
    ]);

    const enrollByCode = new Map(
      enrollments.map((e) => [e.participant_code, e])
    );
    const eventsBySession = new Map<string, EventRow[]>();
    for (const ev of events) {
      const list = eventsBySession.get(ev.session_id) ?? [];
      list.push(ev);
      eventsBySession.set(ev.session_id, list);
    }
    const learningBySession = new Map<
      string,
      { pre: number[]; post: number[] }
    >();
    for (const li of learningItems) {
      const bucket = learningBySession.get(li.session_id) ?? {
        pre: [],
        post: [],
      };
      if (li.phase === "pre") bucket.pre.push(Number(li.score));
      else if (li.phase === "post") bucket.post.push(Number(li.score));
      learningBySession.set(li.session_id, bucket);
    }

    const sessionAggs: SessionAgg[] = [];
    for (const s of sessions) {
      const enroll = enrollByCode.get(s.participant_code);
      if (!enroll) continue;
      const sessEvents = eventsBySession.get(s.session_id) ?? [];
      const childTurns = sessEvents.filter(
        (e) => e.event_type === "child_utterance"
      ).length;
      const exploreAssigned = sessEvents.filter(
        (e) =>
          e.policy_action === "ASSIGN_EXPLORE" ||
          e.event_type === "explore_assigned"
      ).length;
      const exploreCompleted = sessEvents.filter(
        (e) => e.event_type === "explore_completed"
      ).length;
      const exploreFailed = sessEvents.filter(
        (e) => e.event_type === "explore_failed"
      ).length;
      const verifyCount = sessEvents.filter(
        (e) => e.event_type === "verify_submitted"
      ).length;
      const escapeUsed = sessEvents.some((e) => e.event_type === "escape_used");
      const deepQuestions = sessEvents.filter(
        (e) => e.question_code === "D" || e.question_code === "P"
      ).length;
      const codeable = sessEvents.filter(
        (e) => e.question_code != null && e.question_code !== ""
      ).length;

      const chainDepth = Number(
        sessEvents.find(
          (e) => typeof e.state_snapshot?.chain_depth === "number"
        )?.state_snapshot?.chain_depth ?? 0
      );

      // Goldilocks proxy (Kidd & Hayden): frustration = escape/fail signals;
      // boredom = child rushed through with minimal engagement (1 shallow turn then answer).
      const frustrationSignals = (escapeUsed ? 1 : 0) + exploreFailed;
      const boredomSignal =
        childTurns === 1 && verifyCount === 0 && !escapeUsed;

      const learning = learningBySession.get(s.session_id);
      const learningGain =
        learning && learning.pre.length > 0 && learning.post.length > 0
          ? mean(learning.post) - mean(learning.pre)
          : null;

      sessionAggs.push({
        session_id: s.session_id,
        condition: enroll.condition,
        chainDepth,
        oracleLike: childTurns <= 1 && exploreCompleted === 0,
        exploreCompleted,
        exploreAssigned,
        verifyCount,
        escapeUsed,
        dropout: s.dropout_flag,
        valid: s.valid_for_primary,
        deepQuestions,
        codeableQuestions: codeable,
        learningGain,
        frustrationSignals,
        boredomSignal,
      });
    }

    const validSessions = sessionAggs.filter((a) => a.valid && !a.dropout);
    const byCondition = (c: Condition) =>
      validSessions.filter((a) => a.condition === c);

    const buildConditionStats = (c: Condition) => {
      const rows = byCondition(c);
      const chainDepths = rows.map((r) => r.chainDepth);
      const oracleRate = rows.length
        ? rows.filter((r) => r.oracleLike).length / rows.length
        : 0;
      const exploreStartRate = rows.length
        ? rows.reduce(
            (sum, r) =>
              sum +
              (r.exploreAssigned ? r.exploreCompleted / r.exploreAssigned : 0),
            0
          ) / rows.length
        : 0;
      const verifyCounts = rows.map((r) => r.verifyCount);
      const gains = rows
        .map((r) => r.learningGain)
        .filter((g): g is number => g != null);
      const deepRate =
        rows.reduce(
          (sum, r) =>
            sum +
            (r.codeableQuestions ? r.deepQuestions / r.codeableQuestions : 0),
          0
        ) / (rows.length || 1);

      return {
        nSessions: rows.length,
        chainDepthMean: mean(chainDepths),
        chainDepthMedian: median(chainDepths),
        oracleRatio: oracleRate,
        deepQuestionRate: deepRate,
        exploreStartRate,
        verifyCountMean: mean(verifyCounts),
        learningGainMean: gains.length ? mean(gains) : null,
        learningGainSessionCount: gains.length,
        escapeUsed: rows.filter((r) => r.escapeUsed).length,
        frustrationSignalsTotal: rows.reduce(
          (sum, r) => sum + r.frustrationSignals,
          0
        ),
        boredomRate: rows.length
          ? rows.filter((r) => r.boredomSignal).length / rows.length
          : 0,
      };
    };

    const c0 = buildConditionStats("C0");
    const c2 = buildConditionStats("C2");

    // Enrollment summary
    const enrollSummary = {
      total: enrollments.length,
      byCondition: { C0: 0, C1: 0, C2: 0 } as Record<Condition, number>,
      byAgeBand: {} as Record<string, number>,
    };
    for (const e of enrollments) {
      enrollSummary.byCondition[e.condition] += 1;
      enrollSummary.byAgeBand[e.child_age_band] =
        (enrollSummary.byAgeBand[e.child_age_band] ?? 0) + 1;
    }

    // Session detail rows for the table
    const sessionCodeById = new Map(
      sessions.map((s) => [s.session_id, s.participant_code])
    );
    const sessionRows = validSessions
      .map((a) => ({
        participant_code: sessionCodeById.get(a.session_id) ?? "",
        condition: a.condition,
        chainDepth: a.chainDepth,
        exploreCompleted: a.exploreCompleted,
        verifyCount: a.verifyCount,
        learningGain: a.learningGain,
      }))
      .slice(0, 100);

    return Response.json({
      summary: {
        enrollments: enrollSummary,
        totalSessions: validSessions.length,
        totalEvents: events.length,
      },
      metrics: {
        c0,
        c2,
        delta: {
          chainDepthMean: c2.chainDepthMean - c0.chainDepthMean,
          oracleRatio: c2.oracleRatio - c0.oracleRatio,
          deepQuestionRate: c2.deepQuestionRate - c0.deepQuestionRate,
          exploreStartRate: c2.exploreStartRate - c0.exploreStartRate,
          learningGainMean:
            c2.learningGainMean != null && c0.learningGainMean != null
              ? c2.learningGainMean - c0.learningGainMean
              : null,
        },
      },
      sessions: sessionRows,
    });
  } catch (e) {
    if (e instanceof AdminAuthError) {
      return Response.json({ message: e.message }, { status: e.status });
    }
    const raw = e as { message?: string; details?: string; hint?: string };
    const message =
      raw?.message ||
      (e instanceof Error ? e.message : "Failed to load study metrics");
    const detail = raw?.details || raw?.hint || null;
    return Response.json({ message, detail }, { status: 500 });
  }
}
