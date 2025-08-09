"use client"

import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

export interface PatientInfo {
  name: string
  phone: string
  department: string
  visitDate: string
}

// 유효성 검증 유틸
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

/**
 * useUrlParams
 * - useEffect / setState를 사용하지 않고 파라미터를 파생 값으로 계산
 * - searchParams.toString()을 키로 사용하여 불필요한 재계산 방지
 */
export function useUrlParams(): {
  patientInfo: PatientInfo | null
  isValidParams: boolean
  validationErrors: string[]
} {
  const searchParams = useSearchParams()

  // 문자열 키로 변경하면 값이 동일할 때 메모가 유지됨
  const paramsKey = searchParams.toString()

  return useMemo(() => {
    const name = (searchParams.get("name") || "").trim()
    const phone = (searchParams.get("phone") || "").trim()
    const department = (searchParams.get("dept") || "").trim()
    const visitDate = (searchParams.get("date") || "").trim()

    const errors: string[] = []

    // 필수값 체크
    if (!name) errors.push("환자명이 누락되었습니다")
    if (!phone) errors.push("전화번호가 누락되었습니다")
    if (!department) errors.push("진료과가 누락되었습니다")
    if (!visitDate) errors.push("진료일자가 누락되었습니다")

    // 형식 검증
    if (name && !validateName(name)) {
      errors.push("환자명 형식이 올바르지 않습니다 (2-10자의 한글/영문)")
    }
    if (phone && !validatePhoneNumber(phone)) {
      errors.push("전화번호 형식이 올바르지 않습니다 (예: 010-1234-5678)")
    }
    if (department && !validateDepartment(department)) {
      errors.push("올바르지 않은 진료과입니다")
    }
    if (visitDate && !validateDate(visitDate)) {
      errors.push("진료일자 형식이 올바르지 않습니다 (YYYY-MM-DD)")
    }

    const isValidParams = errors.length === 0

    const patientInfo: PatientInfo | null = isValidParams ? { name, phone, department, visitDate } : null

    return { patientInfo, isValidParams, validationErrors: errors }
    // paramsKey가 동일하면 메모된 결과를 재사용하므로 재렌더 루프가 발생하지 않음
  }, [paramsKey, searchParams])
}
