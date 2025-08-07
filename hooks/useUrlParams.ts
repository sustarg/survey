"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export interface PatientInfo {
  name: string
  phone: string
  department: string
  visitDate: string
}

export function useUrlParams() {
  const searchParams = useSearchParams()
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null)
  const [isValidParams, setIsValidParams] = useState(false)

  useEffect(() => {
    const name = searchParams.get('name')
    const phone = searchParams.get('phone')
    const department = searchParams.get('dept')
    const visitDate = searchParams.get('date')

    if (name && phone && department && visitDate) {
      setPatientInfo({
        name: decodeURIComponent(name),
        phone: decodeURIComponent(phone),
        department: decodeURIComponent(department),
        visitDate: decodeURIComponent(visitDate)
      })
      setIsValidParams(true)
    } else {
      setIsValidParams(false)
    }
  }, [searchParams])

  return { patientInfo, isValidParams }
}
