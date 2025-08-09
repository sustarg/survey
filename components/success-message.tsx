import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Heart, Phone, Clock } from 'lucide-react'

interface SuccessMessageProps {
  patientName: string
  submissionTime: string
}

export function SuccessMessage({ patientName, submissionTime }: SuccessMessageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center p-8 bg-white shadow-lg">
          <CardContent className="space-y-8">
            <div className="flex justify-center">
              <div className="relative">
                <CheckCircle className="w-24 h-24 text-green-500" />
                <Heart className="w-8 h-8 text-red-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                설문 완료!
              </h1>
              <div className="text-2xl md:text-3xl text-gray-700 leading-relaxed">
                <strong className="text-blue-600">{patientName}</strong>님,
                <br />
                소중한 의견을 주셔서 감사합니다.
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <p className="text-xl md:text-2xl text-blue-800 font-medium leading-relaxed">
                더 나은 의료 서비스를 위해
                <br />
                여러분의 의견을 소중히 활용하겠습니다.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Clock className="w-5 h-5" />
              <span className="text-lg">제출 시간: {submissionTime}</span>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Phone className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-800">문의처</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                추가 문의사항이 있으시면
                <br />
                병원 접수처로 연락해주세요
              </p>
            </div>

            <div className="text-sm text-gray-400 mt-8">
              이 창은 자동으로 닫아도 됩니다.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
