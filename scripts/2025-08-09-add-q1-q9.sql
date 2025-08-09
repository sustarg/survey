-- 기존 survey_responses 테이블에 9개 문항 칼럼을 추가합니다.
-- (이미 존재하면 건너뜁니다)
alter table survey_responses
  add column if not exists q1 integer check (q1 between 1 and 5),
  add column if not exists q2 integer check (q2 between 1 and 5),
  add column if not exists q3 integer check (q3 between 1 and 5),
  add column if not exists q4 integer check (q4 between 1 and 5),
  add column if not exists q5 integer check (q5 between 1 and 5),
  add column if not exists q6 integer check (q6 between 1 and 5),
  add column if not exists q7 integer check (q7 between 1 and 5),
  add column if not exists q8 integer check (q8 between 1 and 5),
  add column if not exists q9 integer check (q9 between 1 and 5);
