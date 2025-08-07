import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Database, Key } from 'lucide-react'
import { DeploymentGuide } from "./deployment-guide"

export function SetupGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertTriangle className="w-10 h-10 text-yellow-500" />
              <CardTitle className="text-3xl md:text-4xl font-bold text-gray-800">
                Supabase 설정이 필요합니다
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="text-center">
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                데이터베이스 연동을 위해 Supabase 환경변수를 설정해주세요.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-blue-700">
                    <Database className="w-6 h-6" />
                    1. Supabase 프로젝트 생성
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-lg">• database.new 방문</p>
                  <p className="text-lg">• 새 프로젝트 생성</p>
                  <p className="text-lg">• 데이터베이스 비밀번호 설정</p>
                  <p className="text-lg">• 프로젝트 생성 완료 대기</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-green-700">
                    <Key className="w-6 h-6" />
                    2. 환경변수 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-lg">• 프로젝트 Settings → API</p>
                  <p className="text-lg">• Project URL 복사</p>
                  <p className="text-lg">• anon public key 복사</p>
                  <p className="text-lg">• .env.local 파일에 추가</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-xl">환경변수 예시 (.env.local)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="text-xl">3. 데이터베이스 테이블 생성</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">
                  Supabase 대시보드의 SQL Editor에서 다음 스크립트를 실행하세요:
                </p>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`-- 설문조사 응답을 저장할 테이블 생성
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
);`}
                </pre>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-lg text-gray-600">
                설정 완료 후 페이지를 새로고침하면 설문조사가 정상 작동합니다.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                현재는 개발 모드로 실행되어 콘솔에 데이터가 출력됩니다.
              </p>
            </div>
          </CardContent>
        </Card>
        <DeploymentGuide />
      </div>
    </div>
  )
}
