import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Upload, Settings, CheckCircle } from 'lucide-react'

export function DeploymentGuide() {
  return (
    <Card className="mb-8 bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-green-700">
          <Globe className="w-6 h-6" />
          Netlify 배포 가이드
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Upload className="w-5 h-5" />
              1. 코드 업로드
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• GitHub에 코드 푸시</li>
              <li>• Netlify에서 "New site from Git" 선택</li>
              <li>• GitHub 저장소 연결</li>
              <li>• 빌드 설정 확인</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              2. 환경변수 설정
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• Site settings → Environment variables</li>
              <li>• NEXT_PUBLIC_SUPABASE_URL 추가</li>
              <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY 추가</li>
              <li>• Deploy 버튼 클릭</li>
            </ul>
          </div>
        </div>

        <Card className="bg-white">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">빌드 설정</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm">
{`Build command: npm run build
Publish directory: out
Node version: 18`}
            </pre>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">배포 완료 후 사용자 정의 도메인 설정 가능</span>
        </div>
      </CardContent>
    </Card>
  )
}
