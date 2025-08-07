-- 설문조사 응답을 저장할 테이블 생성
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name VARCHAR(100) NOT NULL,
  patient_phone VARCHAR(20) NOT NULL,
  department VARCHAR(50) NOT NULL,
  visit_date DATE NOT NULL,
  doctor_kindness INTEGER CHECK (doctor_kindness >= 1 AND doctor_kindness <= 5),
  waiting_time INTEGER CHECK (waiting_time >= 1 AND waiting_time <= 5),
  facility_clean INTEGER CHECK (facility_clean >= 1 AND facility_clean <= 5),
  treatment_satisfaction INTEGER CHECK (treatment_satisfaction >= 1 AND treatment_satisfaction <= 5),
  overall_satisfaction INTEGER CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 5),
  recommendation INTEGER CHECK (recommendation >= 1 AND recommendation <= 5),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_survey_responses_patient_phone ON survey_responses(patient_phone);
CREATE INDEX IF NOT EXISTS idx_survey_responses_department ON survey_responses(department);
CREATE INDEX IF NOT EXISTS idx_survey_responses_visit_date ON survey_responses(visit_date);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at);
