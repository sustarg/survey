"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Lock, LogIn } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !isSupabaseConfigured()) {
      setErrorMsg("설정 오류: 관리자에게 문의하세요.")
      return
    }
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        // 구체적인 오류 내용은 노출하지 않음
        setErrorMsg("로그인에 실패했습니다. 다시 시도해주세요.")
        return
      }
      router.replace("/admin")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Lock className="w-7 h-7 text-neutral-700" />
            <CardTitle className="text-2xl md:text-3xl font-bold">관리자 로그인</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-lg"
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">
                비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-lg"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            {errorMsg && <div className="text-center text-red-600 text-base">{errorMsg}</div>}
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              <LogIn className="w-5 h-5 mr-2" />
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
