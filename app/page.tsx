"use client"
import { Suspense } from "react"
import SurveyClient from "@/components/survey-client"

// Ensure static export for Netlify (no server-side usage of searchParams)
export const dynamic = "force-static"

const LIKERT_OPTIONS = [
  { value: "5", label: "매우 그렇다" },
  { value: "4", label: "그렇다" },
  { value: "3", label: "보통이다" },
  { value: "2", label: "그렇지 않다" },
  { value: "1", label: "매우 그렇지 않다" },
] as const

const QUESTIONS: { id: keyof SurveyForm; title: string }[] = [
  {
    id: "q1",
    title:
      "1. 유공자님은 해당병원을 이용하고 계시는데 해당 병원의 진료 시간(대기시간, 치료 받는 시간 등)은 적정하다고 생각하십니까?",
  },
  {
    id: "q2",
    title: "2. 해당병원 의료진은 환우의 상태/치료방법에 대해 이해하기 쉽게 설명해줍니까?",
  },
  {
    id: "q3",
    title:
      "3. 해당병원 의료진은 환우의 투약이나 검사, 처치 후에 생길 수 있는 부작용에 대해 이해하기 쉽게 친절하게 설명해주었습니까?",
  },
  {
    id: "q4",
    title: "4. 해당병원 직원(의료진 포함)의 응대 태도가 친절하다고 생각하십니까?",
  },
  {
    id: "q5",
    title: "5. 병원 이용을 위한 진료시간, 예약방법, 진료절차 등에 대해 안내가 잘 되어 있다고 생각하시나요?",
  },
  {
    id: "q6",
    title: "6. 해당병원 직원(의료진 포함)은 복장이 적정하다고 생각하십니까?",
  },
  {
    id: "q7",
    title: "7. 해당병원 의료진 및 직원을 신뢰할 수 있다고 생각하십니까?",
  },
  {
    id: "q8",
    title: "8. 해당병원은 국가유공자의 의료 및 재활에 기여한다고 생각하십니까?",
  },
  {
    id: "q9",
    title:
      "9. 유공자님께서는 앞서 평가해 주신 의료서비스 내용 및 질, 직원의 응대, 이용절차, 공공적 측면 등을 모두 고려할 때, 해당병원 의료서비스에 대해 종합적으로 얼마나 만족하셨습니까?",
  },
]

type SurveyForm = {
  q1: string
  q2: string
  q3: string
  q4: string
  q5: string
  q6: string
  q7: string
  q8: string
  q9: string
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-xl text-gray-600">로딩 중..</p>
          </div>
        </div>
      }
    >
      <SurveyClient />
    </Suspense>
  )
}
