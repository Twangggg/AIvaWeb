import {
  AdminAuthError,
  assertAdminAccess,
  getSupabaseServiceClient,
} from "@/lib/admin/server";
import {
  createSessionState,
  isSafetyBlocked,
  policyStep,
  type Condition,
  type PolicyIntent,
  type SessionState,
} from "@/features/study/curiosityPolicy";
import { generateStudyReply } from "@/features/study/study-ai";

type ChatBody = {
  participant_code?: string;
  condition?: Condition;
  session_id?: string | null;
  text?: string;
  intent?: PolicyIntent | "end";
};

type SessionRow = {
  session_id: string;
  participant_code: string;
  session_index: number;
};

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    await assertAdminAccess(request.headers.get("authorization"));
    const body = (await request.json().catch(() => ({}))) as ChatBody;

    const supabase = getSupabaseServiceClient();
    const text = (body.text ?? "").trim();
    let intent: PolicyIntent | "end" =
      body.intent ?? (text ? "question" : "dont_know");
    const condition: Condition =
      body.condition === "C1" ? "C1" : body.condition === "C2" ? "C2" : "C0";

    // Enroll participant (sandbox creates demo enrollment if missing).
    const participantCode = body.participant_code?.trim() || "P900";
    const { data: enroll, error: enrollError } = await supabase
      .from("study_enrollments")
      .select("participant_code,condition")
      .eq("participant_code", participantCode)
      .maybeSingle();
    if (enrollError) throw enrollError;
    if (!enroll) {
      const { error: insertError } = await supabase
        .from("study_enrollments")
        .insert({
          participant_code: participantCode,
          child_age_band: "7-8",
          condition,
          policy_version_pin: "v1.0",
        });
      if (insertError) throw insertError;
    } else if (enroll.condition !== condition) {
      const { error: updateError } = await supabase
        .from("study_enrollments")
        .update({ condition })
        .eq("participant_code", participantCode);
      if (updateError) throw updateError;
    }

    // Resolve or create session.
    let sessionId = body.session_id ?? null;
    if (!sessionId) {
      const { data: countRows } = await supabase
        .from("study_sessions")
        .select("session_index")
        .eq("participant_code", participantCode)
        .order("session_index", { ascending: false });
      const nextIndex = (countRows?.[0]?.session_index ?? 0) + 1;
      const { data: created, error: createError } = await supabase
        .from("study_sessions")
        .insert({
          participant_code: participantCode,
          session_index: nextIndex,
        })
        .select("session_id,participant_code,session_index")
        .single();
      if (createError) throw createError;
      sessionId = created.session_id;
      const { error: sessionStartError } = await supabase
        .from("study_events")
        .insert({
          session_id: sessionId,
          actor: "system",
          event_type: "session_start",
          policy_version: "v1.0",
        });
      if (sessionStartError) throw sessionStartError;
    }

    const { data: session } = await supabase
      .from("study_sessions")
      .select("session_id,participant_code,session_index")
      .eq("session_id", sessionId)
      .maybeSingle<SessionRow>();

    let sessionEnded: string | null = null;
    if (intent === "end") {
      const { error: endError } = await supabase
        .from("study_sessions")
        .update({ ended_at: new Date().toISOString(), valid_for_primary: true })
        .eq("session_id", sessionId);
      if (endError) throw endError;
      const { error: sessionEndError } = await supabase
        .from("study_events")
        .insert({
          session_id: sessionId,
          actor: "system",
          event_type: "session_end",
          policy_version: "v1.0",
        });
      if (sessionEndError) throw sessionEndError;
      sessionEnded = sessionId;
    }

    let policyState: SessionState = createSessionState(condition);
    let reply: string | null = null;
    let actions: string[] = [];
    let reason: string | null = null;
    let consolidationDone = false;
    let seedIOffered = false;

    const chatIntents: PolicyIntent[] = [
      "question",
      "dont_know",
      "request_answer_now",
      "explore_done",
      "explore_failed",
    ];
    const isChatTurn = chatIntents.includes(intent as PolicyIntent);

    if (isChatTurn) {
      // Load latest state snapshot, then step the policy.
      const { data: lastEvent } = await supabase
        .from("study_events")
        .select("state_snapshot")
        .eq("session_id", sessionId)
        .eq("event_type", "policy_decision")
        .order("ts", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastEvent?.state_snapshot) {
        const snap = lastEvent.state_snapshot as Record<string, unknown>;
        policyState = {
          ...createSessionState(condition),
          ...(snap as Partial<SessionState>),
          condition,
          chainDepth: Number(snap.chain_depth ?? snap.chainDepth ?? 0),
        };
      }

      const worldGroundable =
        !isSafetyBlocked(text) && !/ai|robot|máy tính|intelligence/i.test(text);
      const response = policyStep(policyState, {
        text,
        intent: intent as PolicyIntent,
        worldGroundable,
      });
      policyState = response.state;
      actions = response.actions;
      reason = response.reason;
      consolidationDone = response.consolidationDone;
      seedIOffered = response.seedIOffered;

      const aiResult = await generateStudyReply(
        text,
        response.actions,
        condition
      );
      reply = aiResult.ok ? aiResult.text : aiResult.fallback;

      const events = response.log
        .filter((ev) => ev.event_type !== "policy_decision")
        .map((ev) => ({
          session_id: sessionId,
          actor: ev.actor ?? "child",
          event_type: ev.event_type,
          utterance_text: text || ev.utterance_text || null,
          question_code: null,
          policy_version: "v1.0",
          explore_task_id: ev.explore_task_id ?? null,
          verify_method: ev.verify_method ?? null,
          state_snapshot: null,
          meta: ev.meta ?? null,
        }));

      const { error: eventError } = await supabase.from("study_events").insert([
        ...events,
        {
          session_id: sessionId,
          actor: "child",
          event_type: "policy_decision",
          utterance_text: text || null,
          question_code: null,
          policy_action: actions[0] ?? null,
          policy_reason: reason,
          policy_version: "v1.0",
          state_snapshot: {
            ...policyState,
            chain_depth: policyState.chainDepth,
            oracle_risk: policyState.oracleRisk,
          },
          meta: null,
          explore_task_id: null,
          verify_method: null,
        },
      ]);
      if (eventError) throw eventError;
    }

    return Response.json({
      session_id: sessionId,
      participant_code: participantCode,
      state: policyState,
      actions,
      reason,
      reply,
      consolidation_done: consolidationDone,
      seed_i_type_offered: seedIOffered,
      session_ended: sessionEnded,
    });
  } catch (e) {
    if (e instanceof AdminAuthError) {
      return Response.json({ message: e.message }, { status: e.status });
    }
    const message = e instanceof Error ? e.message : "Failed to run study chat";
    return Response.json({ message }, { status: 500 });
  }
}
