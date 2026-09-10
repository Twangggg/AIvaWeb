-- cleanup_test_data.sql — xoá TOÀN BỘ dữ liệu của participant test (dry-run).
-- Chạy trong Supabase SQL Editor, READ-ONLY KHÔNG (sẽ delete). Chạy riêng khi:
--   - Vừa chạy "Auto dry-run (C0+C2)" trong /console/admin/study/chat, hoặc
--   - Muốn dọn các phiên cũ (P900, PDRY…) không dùng nữa.
-- An toàn vì chỉ đụng participant đã khai trong danh sách test dưới đây.
-- NGHIÊM CẤM chạy khi đã có data real (IRB xong, phiên pilot thật) trừ khi bạn biết mình làm gì.

with test_parts as (
  select participant_code
  from study_enrollments
  where participant_code ilike '%-c0'
     or participant_code ilike '%-c2'
     or participant_code in ('P900', 'P901', 'PDRY', 'PDRY1', 'PDRY2')
)
delete from study_surveys
where session_id in (
        select session_id from study_sessions
        where participant_code in (select participant_code from test_parts)
      )
   or (survey_type = 'parent_final'
       and participant_code in (select participant_code from test_parts));

with test_parts as (
  select participant_code
  from study_enrollments
  where participant_code ilike '%-c0'
     or participant_code ilike '%-c2'
     or participant_code in ('P900', 'P901', 'PDRY', 'PDRY1', 'PDRY2')
)
delete from study_events
where session_id in (
  select session_id from study_sessions
  where participant_code in (select participant_code from test_parts)
);

with test_parts as (
  select participant_code
  from study_enrollments
  where participant_code ilike '%-c0'
     or participant_code ilike '%-c2'
     or participant_code in ('P900', 'P901', 'PDRY', 'PDRY1', 'PDRY2')
)
delete from study_learning_items
where session_id in (
  select session_id from study_sessions
  where participant_code in (select participant_code from test_parts)
);

with test_parts as (
  select participant_code
  from study_enrollments
  where participant_code ilike '%-c0'
     or participant_code ilike '%-c2'
     or participant_code in ('P900', 'P901', 'PDRY', 'PDRY1', 'PDRY2')
)
delete from study_sessions
where participant_code in (select participant_code from test_parts);

with test_parts as (
  select participant_code
  from study_enrollments
  where participant_code ilike '%-c0'
     or participant_code ilike '%-c2'
     or participant_code in ('P900', 'P901', 'PDRY', 'PDRY1', 'PDRY2')
)
delete from study_enrollments
where participant_code in (select participant_code from test_parts);