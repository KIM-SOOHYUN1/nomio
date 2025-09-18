
# Nomio: 맞춤형 여행 일정 생성 서비스

Nomio는 사용자가 입력한 여행 스타일·관심사·여행 기간을 기반으로 Python 백엔드 추천 알고리즘이 맞춤형 여행 일정과 코스를 생성하고, React 프론트엔드에서 지도·일정 카드·사진·날씨 정보 등을 인터랙티브하게 시각화하는 맞춤형 여행 일정 생성 서비스입니다.

사용자는 몇 번의 클릭만으로 자신만의 여행 일정을 확인하고, 저장하거나 재추천 받을 수 있으며, 매번 다른 일정으로 새로운 여행 경험을 설계할 수 있습니다.

---

## 🛠 기술 스택

- **Frontend**: React (프론트엔드 라이브러리), JavaScript (ES6+)
- **Backend/Data**: Python (추천 알고리즘), fast-xml-parser (XML 파싱), 공공데이터포털 OpenAPI (외부 데이터 연동), Supabase (DB·인증·API 제공 BaaS)

---

## 🚀 핵심 기능

- 사용자 입력 기반 맞춤 추천 (스타일·관심사·기간)
- 추천 알고리즘 기반 일정 생성 (거리/소요시간 고려)
- 지도·일정 카드·이미지·날씨 모달 등 인터랙티브 UI
- 일정 저장·즐겨찾기 및 재추천 기능

---

## 🎯 프로젝트 목적

- 여행 계획의 복잡성과 시간 소모 문제를 해결
- 사용자 맞춤형 여행 일정 생성 경험 제공
- 포트폴리오용으로 추천 알고리즘·데이터 처리·React UI/UX 구현 능력을 강조

---

## 주요 소스 파일 안내

- `src/App.js` : 라우팅 및 앱 진입점, AdminPage 연결
- `src/index.js` : 앱 렌더링, 전역 스타일(tailwind.css) 및 reportWebVitals 포함
- `src/AdminPage.js` : 법정동/시군구 코드 관리, 실무형 관리자 UI/CRUD/검색/더보기 등 핵심 기능
- `src/insertSido.js` : 시도 코드 공공데이터 fetch 및 Supabase insert
- `src/insertTbSigungu.js` : 시군구 코드 공공데이터 fetch 및 Supabase insert, 시도-시군구 조인 조회
- `src/db.config.js` : Supabase DB 접속 정보

---
## 아키텍처

        [사용자 브라우저]
                │
                ▼
        React (JavaScript ES6+) ──────► Nomio Frontend
                │ (REST API 호출)
                ▼
        ────────────────────────────────────────────────────────
                │
                ▼
        Python Backend (FastAPI/Flask)
        ├─ 추천 알고리즘 (Python)
        ├─ 공공데이터포털 OpenAPI 연동
        │     └─ fast-xml-parser로 XML → JSON 파싱
        ├─ Supabase 연동 (DB / 인증 / API)
        ────────────────────────────────────────────────────────
                │
                ▼
        Supabase (DB, 인증, API)
        공공데이터포털 OpenAPI (외부 데이터 제공)
---


