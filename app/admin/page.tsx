"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Loader2, LogOut, Shield, RefreshCcw } from "lucide-react"

type Row = {
  id: string
  patient_name: string
  patient_phone: string
  department: string
  visit_date: string
  q1: number | null
  q2: number | null
  q3: number | null
  q4: number | null
  q5: number | null
  q6: number | null
  q7: number | null
  q8: number | null
  q9: number | null
  created_at: string
}

const likertLabel = (v: number | null) => {
  if (v == null) return "-"
  switch (v) {
    case 5:
      return "매우 그렇다"
    case 4:
      return "그렇다"
    case 3:
      return "보통이다"
    case 2:
      return "그렇지 않다"
    case 1:
      return "매우 그렇지 않다"
    default:
      return "-"
  }
}

const COL_LABELS: Record<keyof Pick<Row, "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8" | "q9">, string> = {
  q1: "Q1 시간 적정",
  q2: "Q2 설명 이해",
  q3: "Q3 부작용 안내",
  q4: "Q4 친절 응대",
  q5: "Q5 안내 적절",
  q6: "Q6 복장 적정",
  q7: "Q7 신뢰도",
  q8: "Q8 공공 기여",
  q9: "Q9 종합 만족",
}

export default function AdminDashboard() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const ensureAuth = async () => {
      if (!supabase || !isSupabaseConfigured()) {
        router.replace("/admin/login")
        return
      }
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace("/admin/login")
        return
      }
      setChecking(false)
    }
    ensureAuth()

    const { data: sub } = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/admin/login")
    }) ?? { data: { subscription: { unsubscribe() {} } } }

    return () => {
      sub.subscription?.unsubscribe?.()
    }
  }, [router])

  const fetchRows = async () => {
    if (!supabase) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("survey_responses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500)
      if (error) throw error
      setRows((data as Row[]) ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!checking) fetchRows()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking])

  const filtered = useMemo(() => {
    const q = search.trim()
    if (!q) return rows
    return rows.filter((r) => [r.patient_name, r.patient_phone, r.department].some((v) => (v || "").includes(q)))
  }, [rows, search])

  const logout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    router.replace("/admin/login")
  }

  const kst = (iso: string) =>
    new Date(iso).toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

  if (checking) {
    return (
      <main className="min-h-screen grid place-items-center bg-neutral-50 p-6">
        <div className="flex items-center gap-3 text-neutral-700">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">인증 상태 확인 중...</span>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-neutral-700" />
            <h1 className="text-2xl md:text-3xl font-bold">관리자 대시보드</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchRows} className="h-10 bg-transparent">
              <RefreshCcw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
            <Button onClick={logout} className="h-10">
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl md:text-2xl">설문 응답 목록</CardTitle>
            <div className="w-full md:max-w-sm">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="이름/전화번호/진료과 검색"
                className="h-11 text-base"
              />
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제출시간(KST)</TableHead>
                  <TableHead>환자명</TableHead>
                  <TableHead>전화번호</TableHead>
                  <TableHead>진료과</TableHead>
                  <TableHead>진료일자</TableHead>
                  {Object.entries(COL_LABELS).map(([key, label]) => (
                    <TableHead key={key}>{label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={14}>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>불러오는 중...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-neutral-500">
                      데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap">{kst(r.created_at)}</TableCell>
                      <TableCell>{r.patient_name}</TableCell>
                      <TableCell>{r.patient_phone}</TableCell>
                      <TableCell>{r.department}</TableCell>
                      <TableCell className="whitespace-nowrap">{r.visit_date}</TableCell>
                      {(["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9"] as const).map((k) => (
                        <TableCell key={k} className="whitespace-nowrap">
                          {likertLabel(r[k])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
