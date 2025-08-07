# 의료 고객만족도 조사 시스템

60대 이상 고령자를 위한 의료 고객만족도 조사 웹사이트입니다.

## 🚀 빠른 시작

### 1. 의존성 설치
\`\`\`bash
npm install
\`\`\`

### 2. 환경변수 설정
\`\`\`bash
cp .env.example .env.local
\`\`\`
`.env.local` 파일에 실제 Supabase 값을 입력하세요.

### 3. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

### 4. 브라우저에서 확인
\`\`\`
http://localhost:3000?name=홍길동&phone=010-1234-5678&dept=내과&date=2024-01-15
\`\`\`

## 🌐 Netlify 배포

### 1. GitHub 저장소 생성
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/medical-survey-korean.git
git push -u origin main
\`\`\`

### 2. Netlify 배포
1. [Netlify](https://netlify.com)에서 "New site from Git" 선택
2. GitHub 저장소 연결
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `out`
4. 환경변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📊 Supabase 설정

### 1. 프로젝트 생성
[database.new](https://database.new)에서 새 프로젝트 생성

### 2. 테이블 생성
SQL Editor에서 `scripts/create-survey-table.sql` 실행

### 3. API 키 확인
Settings → API에서 URL과 anon key 복사

## 📱 사용 방법

### URL 파라미터
- `name`: 환자명
- `phone`: 전화번호  
- `dept`: 진료과
- `date`: 진료일자 (YYYY-MM-DD)

### 예시
\`\`\`
https://your-site.netlify.app?name=김철수&phone=010-9876-5432&dept=정형외과&date=2024-01-20
\`\`\`

## 🎯 특징

- 60대 이상 고령자 친화적 UI/UX
- 큰 글씨와 높은 대비
- 모바일 반응형 디자인
- URL 파라미터로 환자 정보 자동 입력
- Supabase 데이터베이스 연동
- 실시간 진행률 표시

## 🛠️ 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- Netlify

## 📞 지원

문의사항이 있으시면 병원 접수처로 연락해주세요.
