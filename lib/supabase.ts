import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are not set. Using mock client.")
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

export type SurveyResponse = {
  id?: string
  patient_name: string
  patient_phone: string
  department: string
  visit_date: string
  // 9 문항 (1~5 Likert)
  q1: number | null
  q2: number | null
  q3: number | null
  q4: number | null
  q5: number | null
  q6: number | null
  q7: number | null
  q8: number | null
  q9: number | null
  comments?: string | null
  created_at?: string
}

// 개발용 Mock
export const mockSaveToDatabase = async (data: Omit<SurveyResponse, "id" | "created_at">) => {
  console.log("Mock saving survey data:", data)
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { success: true }
}
