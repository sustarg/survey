"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Heart, AlertCircle, User, Phone, Calendar, Building } from "lucide-react"
import { supabase, type SurveyResponse, isSupabaseConfigured, mockSaveToDatabase } from "@/lib/supabase"
import { SuccessMessage } from "@/components/success-message"

type InitialParams = { [key: string]: string | string[] | undefined }

type PatientInfo = {
  name: string
  phone: string
  department: string
  visitDate: string
}

const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}
const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false
  const parsed = new Date(date)
  return parsed instanceof Date && !isNaN(parsed.getTime())
}
const validateName = (name: string): boolean => {
  const nameRegex = /^[가-힣a-zA-Z\s]{2,10}$/
  return nameRegex.test(name.trim())
}
const validateDepartment = (dept: string): boolean => {
  const validDepartments = [
    "내과",
    "외과",
    "정형외과",
    "신경외과",
    "산부인과",
    "소아과",
    "안과",
    "이비인후과",
    "피부과",
    "정신건강의학과",
    "재활의학과",
    "영상의학과",
    "병리과",
    "마취통증의학과",
    "응급의학과",
    "가정의학과",
    "치과",
    "한방과",
    "비뇨의학과",
    "성형외과",
    "흉부외과",
    "신경과",
  ]
  return validDepartments.includes(dept.trim())
}

function parsePatientFromParams(initialParams: InitialParams) {
  const get = (k: string) => {
    const v = initialParams[k]
    return Array.isArray(v) ? (v[0] ?? "") : (v ?? "")
  }
  const name = (get("name") || "").trim()
  const phone = (get("phone") || "").trim()
  const department = (get("dept") || "").trim()
  const visitDate = (get("date") || "").trim()

  const errors: string[] = []
  if (!name) errors.push("required:name")
  if (!phone) errors.push("required:phone")
  if (!department) errors.push("required:dept")
  if (!visitDate) errors.push("required:date")

  if (name && !validateName(name)) errors.push("invalid:name")
  if (phone && !validatePhoneNumber(phone)) errors.push("invalid:phone")
  if (department && !validateDepartment(department)) errors.push("invalid:dept")
  if (visitDate && !validateDate(visitDate)) errors.push("invalid:date")

  const isValid = errors.length === 0
  const patientInfo: PatientInfo | null = isValid ? { name, phone, department, visitDate } : null
  return { patientInfo, isValidParams: isValid }
}

const LIKERT_OPTIONS = [
  { value: "5", label: "매우 그렇다" },
  { value: "4", label: "그렇다" },
  { value: "3", label: "보통이다" },
  { value: "2", label: "그렇지 않다" },
  { value: "1", label: "매우 그렇지 않다" },
] as const

const QUESTIONS = [
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
] as const

type SurveyForm = Record<(typeof QUESTIONS)[number]["id"], string>

export default function SurveyClient({ initialParams }: { initialParams: InitialParams }) {
  const { patientInfo, isValidParams } = useMemo(() => parsePatientFromParams(initialParams), [initialParams])

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<SurveyForm>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionTime, setSubmissionTime] = useState<string>("")

  const handleInputChange = (id: keyof SurveyForm, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }
  const handleNext = () => currentStep < QUESTIONS.length - 1 && setCurrentStep((s) => s + 1)
  const handlePrevious = () => currentStep > 0 && setCurrentStep((s) => s - 1)

  const handleSubmit = async () => {
    if (!patientInfo) return
    setIsSubmitting(true)
    try {
      const payload: Omit<SurveyResponse, "id" | "created_at"> = {
        patient_name: patientInfo.name,
        patient_phone: patientInfo.phone,
        department: patientInfo.department,
        visit_date: patientInfo.visitDate,
        q1: Number.parseInt(formData.q1) || null,
        q2: Number.parseInt(formData.q2) || null,
        q3: Number.parseInt(formData.q3) || null,
        q4: Number.parseInt(formData.q4) || null,
        q5: Number.parseInt(formData.q5) || null,
        q6: Number.parseInt(formData.q6) || null,
        q7: Number.parseInt(formData.q7) || null,
        q8: Number.parseInt(formData.q8) || null,
        q9: Number.parseInt(formData.q9) || null,
      }

      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.from("survey_responses").insert([payload])
        if (error) throw error
      } else {
        await mockSaveToDatabase(payload)
      }

      const nowKST = new Date().toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      setSubmissionTime(nowKST)
      setIsSubmitted(true)
    } catch {
      setIsSubmitted(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isValidParams) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center p-8">
            <CardContent className="space-y-6">
              <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">잘못된 접근입니다</h1>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQuestion = QUESTIONS[currentStep]
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100

  if (isSubmitted) {
    return <SuccessMessage patientName={patientInfo?.name || ""} submissionTime={submissionTime} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-red-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">의료 고객만족도 조사</h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">아래 문항에 해당하는 답변을 선택해 주세요.</p>
        </div>

        {/* 환자 정보 */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl md:text-2xl font-bold text-blue-800 flex items-center gap-2">
              <User className="w-6 h-6" />
              환자 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">환자명</p>
                <p className="text-lg font-semibold">{patientInfo?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">전화번호</p>
                <p className="text-lg font-semibold">{patientInfo?.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">진료과</p>
                <p className="text-lg font-semibold">{patientInfo?.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">진료일자</p>
                <p className="text-lg font-semibold">{patientInfo?.visitDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 진행률 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium text-gray-700">진행률: {Math.round(progress)}%</span>
            <span className="text-lg font-medium text-gray-700">
              {currentStep + 1} / {QUESTIONS.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
              {currentQuestion.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={formData[currentQuestion.id]}
              onValueChange={(v) => handleInputChange(currentQuestion.id, v)}
              className="space-y-4"
            >
              {LIKERT_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`${currentQuestion.id}-${option.value}`}
                    className="w-6 h-6"
                  />
                  <Label
                    htmlFor={`${currentQuestion.id}-${option.value}`}
                    className="text-xl md:text-2xl font-medium cursor-pointer flex-1 leading-relaxed"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* 네비게이션 */}
        <div className="flex justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="text-xl px-8 py-4 h-auto flex-1 max-w-40 bg-transparent"
          >
            이전
          </Button>
          {currentStep === QUESTIONS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="text-xl px-8 py-4 h-auto flex-1 bg-green-600 hover:bg-green-700"
              disabled={!formData[currentQuestion.id] || isSubmitting}
            >
              {isSubmitting ? "제출 중..." : "설문 완료"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="text-xl px-8 py-4 h-auto flex-1"
              disabled={!formData[currentQuestion.id]}
            >
              다음
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
