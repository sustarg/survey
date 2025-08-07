import { createClient } from '@supabase/supabase-js'

// 환경변수 검증
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Using mock client.')
}

// Supabase 클라이언트 생성 (환경변수가 없으면 null)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// 환경변수 상태 확인 함수
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

export type SurveyResponse = {
  id?: string
  patient_name: string
  patient_phone: string
  department: string
  visit_date: string
  doctor_kindness: number
  waiting_time: number
  facility_clean: number
  treatment_satisfaction: number
  overall_satisfaction: number
  recommendation: number
  comments?: string
  created_at?: string
}

// Mock 데이터 저장 함수 (개발용)
export const mockSaveToDatabase = async (data: Omit<SurveyResponse, 'id' | 'created_at'>) => {
  console.log('Mock saving survey data:', data)
  // 실제 환경에서는 이 부분이 실행되지 않습니다
  await new Promise(resolve => setTimeout(resolve, 1000)) // 네트워크 지연 시뮬레이션
  return { success: true }
}
