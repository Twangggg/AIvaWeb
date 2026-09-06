/**
 * Seed demo study data for the measurement dashboard.
 * Populates study_enrollments, study_sessions, study_events, study_learning_items
 * with synthetic rows whose effects follow the expected directions (C2 > C0 on
 * curiosity/exploration/learning) so the dashboard renders meaningful visuals.
 *
 *   node --env-file=.env.local scripts/seed-study-data.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.round(rand(min, max));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const TOPICS = ["trees", "weather", "animals", "sound", "shadows", "water"];
const POLICY_ACTIONS = [
  "ASK_BACK",
  "HINT",
  "ASSIGN_EXPLORE",
  "REQUEST_VERIFY",
  "ANSWER_BRIEF",
  "ANSWER_FULL",
  "CONSOLIDATE",
  "SEED_NEXT",
];

async function resetTables() {
  for (const table of [
    "study_learning_items",
    "study_events",
    "study_sessions",
    "study_enrollments",
  ]) {
    const col = table === "study_learning_items" ? "id" : "created_at";
    // crude: delete via filter requires a column; use `.op`. Use raw sql through supabase is not
    // supported for arbitrary DML, so we list-then-delete in chunks.
    let done = false;
    let page = 0;
    while (!done) {
      const { data, error } = await supabase
        .from(table)
        .select(col)
        .range(page * 500, page * 500 + 499);
      if (error) throw error;
      const rows = data ?? [];
      if (rows.length === 0) {
        done = true;
        break;
      }
      const ids = rows.map((r) => r[col]);
      const { error: delErr } = await supabase
        .from(table)
        .delete()
        .in(col, ids);
      if (delErr) throw delErr;
      page += 1;
    }
    console.log("reset", table);
  }
}

function buildSession(participant, condition, index, topic) {
  const isC2 = condition === "C2";
  const baseDepth = isC2 ? randInt(3, 6) : randInt(1, 2);
  const events = [];
  const start = Date.now() - index * 86400000;
  let t = start;

  events.push({ actor: "system", event_type: "session_start", ts: t });

  // pre-test
  for (let i = 1; i <= 3; i++) {
    t += randInt(1500, 4000);
    events.push({
      actor: "child",
      event_type: "pretest_submitted",
      ts: t,
      meta: { item: `pre${i}` },
    });
  }

  // main exchange
  let childTurns = 0;
  const depth = baseDepth;
  while (childTurns < depth) {
    childTurns += 1;
    t += randInt(2000, 6000);
    const deep = Math.random() < (isC2 ? 0.6 : 0.25);
    events.push({
      actor: "child",
      event_type: "child_utterance",
      ts: t,
      question_code: deep ? "D" : "S",
      meta: { topical_continuity: true },
    });

    if (isC2 && childTurns < depth - 1) {
      // C2: scaffold first, maybe explore
      if (Math.random() < 0.5) {
        t += randInt(2000, 5000);
        events.push({
          actor: "ai",
          event_type: "policy_decision",
          policy_action: "ASSIGN_EXPLORE",
          ts: t,
          meta: { condition },
        });
        t += randInt(8000, 20000);
        events.push({ actor: "child", event_type: "explore_started", ts: t });
        t += randInt(10000, 25000);
        events.push({ actor: "child", event_type: "explore_completed", ts: t });
        t += randInt(3000, 8000);
        events.push({
          actor: "child",
          event_type: "verify_submitted",
          ts: t,
          verify_method: "photo",
        });
      } else {
        t += randInt(2000, 5000);
        events.push({
          actor: "ai",
          event_type: "policy_decision",
          policy_action: pick(
            isC2 ? ["ASK_BACK", "HINT", "REQUEST_VERIFY"] : ["ASK_BACK"]
          ),
          ts: t,
          meta: { condition },
        });
      }
    } else {
      // final: answer
      t += randInt(3000, 7000);
      events.push({
        actor: "ai",
        event_type: "ai_utterance",
        policy_action: "ANSWER_FULL",
        ts: t,
        meta: { condition },
      });
      // consolidation + seed (C2 always, C0 optional-light)
      if (isC2 || Math.random() < 0.3) {
        t += randInt(2000, 5000);
        events.push({
          actor: "ai",
          event_type: "ai_utterance",
          policy_action: isC2 ? "CONSOLIDATE" : "SEED_NEXT",
          ts: t,
          meta: { condition },
        });
      }
      break;
    }
  }

  // post-test
  let postScore = 0;
  for (let i = 1; i <= 3; i++) {
    t += randInt(1500, 4000);
    const correct = Math.random() < (isC2 ? 0.75 : 0.5);
    postScore += correct ? 1 : 0;
    events.push({
      actor: "child",
      event_type: "posttest_submitted",
      ts: t,
      meta: { item: `post${i}`, correct },
    });
  }

  t += randInt(500, 1500);
  events.push({ actor: "system", event_type: "session_end", ts: t });

  const preScore = randInt(0, 1);
  return {
    isC2,
    startedAt: new Date(start).toISOString(),
    endedAt: new Date(t).toISOString(),
    events,
    preScore,
    postScore,
    depth: baseDepth,
    exploration: events.filter((e) => e.event_type === "explore_completed")
      .length,
    timeToAnswerSec: Math.round((t - start) / index / 1000),
  };
}

async function main() {
  await resetTables();

  const participants = [];
  for (let i = 1; i <= 20; i++) {
    const code = `P${String(i).padStart(3, "0")}`;
    const condition = i % 2 === 0 ? "C2" : "C0";
    participants.push({ code, condition, age: i % 2 === 0 ? "9-10" : "7-8" });
  }

  for (const p of participants) {
    const enrollAgeDays = p.condition === "C2" ? 1 : 2;
    const { error: enrollErr } = await supabase
      .from("study_enrollments")
      .upsert({
        participant_code: p.code,
        child_age_band: p.age,
        condition: p.condition,
        consent_audio: true,
        consent_image: true,
        policy_version_pin: "v1.0",
        created_at: new Date(
          Date.now() - enrollAgeDays * 86400000
        ).toISOString(),
      });
    if (enrollErr) {
      console.error("enroll fail", p.code, enrollErr.message);
      continue;
    }

    const numSessions = p.condition === "C2" ? 4 : 3;
    for (let sIdx = 1; sIdx <= numSessions; sIdx++) {
      const topic = pick(TOPICS);
      const built = buildSession(p, p.condition, sIdx, topic);
      const { data: session, error: sessErr } = await supabase
        .from("study_sessions")
        .insert({
          participant_code: p.code,
          session_index: sIdx,
          topic_id: topic,
          started_at: built.startedAt,
          ended_at: built.endedAt,
          valid_for_primary: true,
          dropout_flag: Math.random() < 0.05,
          parent_intervened_flag: false,
        })
        .select()
        .single();
      if (sessErr) {
        console.error("session fail", p.code, sessErr.message);
        continue;
      }
      const sessionId = session.session_id;

      // events
      const insertRows = built.events.map((ev) => ({
        session_id: sessionId,
        ts: ev.ts
          ? new Date(
              Math.max(new Date(built.startedAt).getTime(), ev.ts)
            ).toISOString()
          : built.startedAt,
        actor: ev.actor,
        event_type: ev.event_type,
        question_code: ev.question_code ?? null,
        policy_action: ev.policy_action ?? null,
        policy_version: "v1.0",
        verify_method: ev.verify_method ?? null,
        meta: ev.meta ?? {},
        state_snapshot: { chain_depth: built.depth },
      }));
      if (insertRows.length) {
        const { error: evErr } = await supabase
          .from("study_events")
          .insert(insertRows);
        if (evErr) {
          console.error("events fail", p.code, evErr.message);
        }
      }

      // learning items
      const learningRows = [];
      for (let i = 1; i <= 3; i++) {
        learningRows.push({
          session_id: sessionId,
          phase: "pre",
          item_id: `${topic}-q${i}`,
          score: built.preScore,
        });
        learningRows.push({
          session_id: sessionId,
          phase: "post",
          item_id: `${topic}-q${i}`,
          score: built.postScore,
        });
      }
      const { error: liErr } = await supabase
        .from("study_learning_items")
        .insert(learningRows);
      if (liErr) {
        console.error("learning fail", p.code, liErr.message);
      }
    }
    console.log("seeded", p.code, p.condition);
  }

  console.log("Done seeding demo study data.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
