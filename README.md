# 의료 고객만족도 조사 시스템

60대 이상 고령자를 위한 의료 고객만족도 조사 웹사이트입니다.

## 🛠️ 시스템 요구사항

- **Node.js**: 20.x 이상
- **npm**: 10.x 이상

## 🚀 빠른 시작

### 1. Node.js 버전 확인
\`\`\`bash
node --version  # v20.x.x 확인
npm --version   # 10.x.x 확인
\`\`\`

### 2. 의존성 설치
\`\`\`bash
npm install
\`\`\`

### 3. 환경변수 설정
\`\`\`bash
cp .env.example .env.local
\`\`\`
`.env.local` 파일에 실제 Supabase 값을 입력하세요.

### 4. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

### 5. 브라우저에서 확인
\`\`\`
http://localhost:3000?name=홍길동&phone=010-1234-5678&dept=내과&date=2024-01-15
\`\`\`

## 🌐 Netlify 배포

### 빌드 설정
- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: `20`

### 환경변수 설정 (Netlify 대시보드)
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

### GitHub 연동
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/medical-survey-korean.git
git push -u origin main
\`\`\`

## 📊 Supabase 설정

### 테이블 생성
SQL Editor에서 `scripts/create-survey-table.sql` 실행

## 📱 사용 방법

### URL 파라미터
- `name`: 환자명
- `phone`: 전화번호  
- `dept`: 진료과
- `date`: 진료일자 (YYYY-MM-DD)

### 예시 URL
\`\`\`
https://your-site.netlify.app?name=김철수&phone=010-9876-5432&dept=정형외과&date=2024-01-20
\`\`\`

## 🎯 특징

- **고령자 친화적 UI/UX**: 큰 글씨, 높은 대비, 간단한 인터페이스
- **반응형 디자인**: 데스크탑과 모바일 모두 최적화
- **URL 파라미터 지원**: 문자메시지로 개인화된 링크 전송 가능
- **실시간 진행률**: 설문 진행 상황을 시각적으로 표시
- **데이터베이스 연동**: Supabase를 통한 안전한 데이터 저장

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Database**: Supabase
- **Deployment**: Netlify
- **Runtime**: Node.js 20

## 🔧 개발 환경

### 로컬 개발
\`\`\`bash
# 개발 서버 실행
npm run dev

# 빌드 테스트
npm run build

# 프로덕션 모드 실행
npm run start
\`\`\`

### 코드 품질
\`\`\`bash
# ESLint 실행
npm run lint

# TypeScript 타입 체크
npx tsc --noEmit
\`\`\`

## 📞 지원

문의사항이 있으시면 병원 접수처로 연락해주세요.

---

**배포 상태**: ✅ Netlify에서 Node.js 20 환경으로 실행 중
