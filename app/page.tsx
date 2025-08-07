"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Star, CheckCircle, AlertCircle, User, Phone, Calendar, Building } from 'lucide-react'
import { useUrlParams } from "@/hooks/useUrlParams"
import { supabase, type SurveyResponse, isSupabaseConfigured, mockSaveToDatabase } from "@/lib/supabase"
import { Suspense } from 'react'
import { SetupGuide } from "@/components/setup-guide"

function SurveyContent() {
  const { patientInfo, isValidParams } = useUrlParams()

  // Supabase 설정 확인 - 설정되지 않았으면 설정 가이드 표시
  if (!isSupabaseConfigured()) {
    return <SetupGuide />
  }

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    doctorKindness: "",
    waitingTime: "",
    facilityClean: "",
    treatmentSatisfaction: "",
    overallSatisfaction: "",
    recommendation: "",
    comments: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const questions = [
    {
      id: "doctorKindness",
      title: "의료진의 친절도는 어떠셨나요?",
      type: "radio",
      options: [
        { value: "5", label: "매우 만족" },
        { value: "4", label: "만족" },
        { value: "3", label: "보통" },
        { value: "2", label: "불만족" },
        { value: "1", label: "매우 불만족" }
      ]
    },
    {
      id: "waitingTime",
      title: "진료 대기시간은 적절했나요?",
      type: "radio",
      options: [
        { value: "5", label: "매우 만족" },
        { value: "4", label: "만족" },
        { value: "3", label: "보통" },
        { value: "2", label: "불만족" },
        { value: "1", label: "매우 불만족" }
      ]
    },
    {
      id: "facilityClean",
      title: "병원 시설의 청결도는 어떠셨나요?",
      type: "radio",
      options: [
        { value: "5", label: "매우 만족" },
        { value: "4", label: "만족" },
        { value: "3", label: "보통" },
        { value: "2", label: "불만족" },
        { value: "1", label: "매우 불만족" }
      ]
    },
    {
      id: "treatmentSatisfaction",
      title: "받으신 진료에 대해 만족하시나요?",
      type: "radio",
      options: [
        { value: "5", label: "매우 만족" },
        { value: "4", label: "만족" },
        { value: "3", label: "보통" },
        { value: "2", label: "불만족" },
        { value: "1", label: "매우 불만족" }
      ]
    },
    {
      id: "overallSatisfaction",
      title: "전반적으로 만족하시나요?",
      type: "radio",
      options: [
        { value: "5", label: "매우 만족" },
        { value: "4", label: "만족" },
        { value: "3", label: "보통" },
        { value: "2", label: "불만족" },
        { value: "1", label: "매우 불만족" }
      ]
    },
    {
      id: "recommendation",
      title: "다른 분들께 추천하시겠나요?",
      type: "radio",
      options: [
        { value: "5", label: "적극 추천" },
        { value: "4", label: "추천" },
        { value: "3", label: "보통" },
        { value: "2", label: "추천하지 않음" },
        { value: "1", label: "절대 추천하지 않음" }
      ]
    },
    {
      id: "comments",
      title: "추가로 하고 싶은 말씀이 있으시면 적어주세요",
      type: "textarea"
    }
  ]

  const handleInputChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!patientInfo) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const surveyData: Omit<SurveyResponse, 'id' | 'created_at'> = {
        patient_name: patientInfo.name,
        patient_phone: patientInfo.phone,
        department: patientInfo.department,
        visit_date: patientInfo.visitDate,
        doctor_kindness: parseInt(formData.doctorKindness),
        waiting_time: parseInt(formData.waitingTime),
        facility_clean: parseInt(formData.facilityClean),
        treatment_satisfaction: parseInt(formData.treatmentSatisfaction),
        overall_satisfaction: parseInt(formData.overallSatisfaction),
        recommendation: parseInt(formData.recommendation),
        comments: formData.comments || null
      }

      // Supabase가 설정되어 있는지 확인
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('survey_responses')
          .insert([surveyData])

        if (error) {
          throw error
        }
      } else {
        // 개발 환경에서는 mock 함수 사용
        console.warn('Supabase not configured. Using mock save function.')
        await mockSaveToDatabase(surveyData)
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting survey:', error)
      setSubmitError('설문 제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // URL 파라미터가 유효하지 않은 경우
  if (!isValidParams) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center p-8">
            <CardContent className="space-y-6">
              <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                잘못된 접근입니다
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                올바른 링크를 통해 접속해주세요.
                <br />
                문의사항이 있으시면 병원 접수처로 연락해주세요.
              </p>
              <div className="text-lg text-gray-500 mt-4">
                <p>필요한 정보: 환자명, 전화번호, 진료과, 진료일자</p>
                <p className="text-sm mt-2">
                  예시: ?name=홍길동&phone=010-1234-5678&dept=내과&date=2024-01-15
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center p-8">
            <CardContent className="space-y-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                설문 완료!
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                <strong>{patientInfo?.name}</strong>님,
                <br />
                소중한 의견을 주셔서 감사합니다.
                <br />
                더 나은 의료 서비스를 위해 활용하겠습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-red-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              의료 고객만족도 조사
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            더 나은 의료 서비스를 위해 여러분의 소중한 의견을 들려주세요
          </p>
        </div>

        {/* 환자 정보 표시 */}
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

        {/* 진행률 표시 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium text-gray-700">
              진행률: {Math.round(progress)}%
            </span>
            <span className="text-lg font-medium text-gray-700">
              {currentStep + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 카드 */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
              {currentQuestion.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentQuestion.type === "radio" && (
              <RadioGroup
                value={formData[currentQuestion.id as keyof typeof formData]}
                onValueChange={(value) => handleInputChange(currentQuestion.id, value)}
                className="space-y-4"
              >
                {currentQuestion.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value}
                      className="w-6 h-6"
                    />
                    <Label 
                      htmlFor={option.value} 
                      className="text-xl md:text-2xl font-medium cursor-pointer flex-1 leading-relaxed"
                    >
                      {option.label}
                    </Label>
                    {option.value === "5" && <Star className="w-6 h-6 text-yellow-500" />}
                    {option.value === "4" && <Star className="w-6 h-6 text-yellow-400" />}
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === "textarea" && (
              <Textarea
                value={formData[currentQuestion.id as keyof typeof formData]}
                onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                placeholder="자유롭게 의견을 작성해주세요..."
                className="min-h-32 text-xl p-4 leading-relaxed"
              />
            )}
          </CardContent>
        </Card>

        {/* 에러 메시지 */}
        {submitError && (
          <Card className="mb-4 bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p className="text-lg">{submitError}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="text-xl px-8 py-4 h-auto flex-1 max-w-40"
          >
            이전
          </Button>
          
          {currentStep === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="text-xl px-8 py-4 h-auto flex-1 bg-green-600 hover:bg-green-700"
              disabled={!formData[currentQuestion.id as keyof typeof formData] || isSubmitting}
            >
              {isSubmitting ? "제출 중..." : "설문 완료"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="text-xl px-8 py-4 h-auto flex-1"
              disabled={!formData[currentQuestion.id as keyof typeof formData]}
            >
              다음
            </Button>
          )}
        </div>

        {/* 도움말 */}
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-500">
            문의사항이 있으시면 병원 접수처로 연락해주세요
          </p>
        </div>
      </div>
    </div>
  )
}

export default function MedicalSurvey() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <SurveyContent />
    </Suspense>
  )
}
