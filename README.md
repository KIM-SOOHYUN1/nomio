
# Nomio: 맞춤형 여행 일정 생성 서비스

Nomio는 사용자가 입력한 여행 스타일·관심사·여행 기간을 기반으로 Python 백엔드 추천 알고리즘이 맞춤형 여행 일정과 코스를 생성하고, React 프론트엔드에서 지도·일정 카드·사진·날씨 정보 등을 인터랙티브하게 시각화하는 맞춤형 여행 일정 생성 서비스입니다.

사용자는 몇 번의 클릭만으로 자신만의 여행 일정을 확인하고, 저장하거나 재추천 받을 수 있으며, 매번 다른 일정으로 새로운 여행 경험을 설계할 수 있습니다.

---


## 🛠 기술 스택 (2025.09 기준)

- **Frontend**:  
       - React (SPA 프레임워크, Hooks 기반)  
       - JavaScript (ES6+)  
       - Tailwind CSS (유틸리티 스타일링)  
       - Naver Maps JavaScript API (지도/마커/InfoWindow)  
       - Supabase JS SDK (DB/API 연동)  

- **Backend/Data**:  
       - Python (추천 알고리즘, FastAPI 기반)  
       - Supabase (PostgreSQL DB, 인증, RESTful API, Storage)  
       - 공공데이터포털 OpenAPI (여행지/날씨 등 외부 데이터)  
       - fast-xml-parser (공공데이터 XML → JSON 파싱)  

- **ETC/Infra**:  
       - GitHub (버전 관리)  
       - Supabase Hosting (DB/API/Storage)  

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

## 📈 프로젝트 진행상태 (2025.09 기준)

- [x] Supabase 기반 여행지 DB 구축 및 연동
- [x] 카테고리별(1/2/3뎁스) UI 및 여행지 마커 지도 연동
- [x] 네이버 지도 API 연동, 마커/InfoWindow/지도 타입 옵션 구현
- [x] 여행지 정보(이름, 주소, 이미지, 수정일) InfoWindow로 표시
- [x] 여행지 이미지/수정일 등 데이터 포맷 JS 처리
- [x] 사용자용 여행지 선택 UI
- [ ] (진행중) 추천 알고리즘 고도화 및 사용자 맞춤 일정 자동 생성
- [ ] (예정) 일정 저장/즐겨찾기/재추천 기능, 사용자 인증/마이페이지

---

## 아키텍처 (2025.09 최신)
   [사용자 브라우저]
         │
         ▼
  React (JS, Tailwind)
    ├─ 카테고리/여행지 UI
    ├─ NaverMapWithMarkers (네이버 지도/마커/InfoWindow)
    └─ Supabase JS SDK
         │
         ▼
  Supabase (DB, 인증, API)
    ├─ TB_REGION_TOURISM_SPOT (여행지)
    ├─ TB_CLASSIFICATION_CODE (카테고리)
    └─ 인증/CRUD/SQL
         │
         ▼
  (Python) 추천 알고리즘 서버
    ├─ 여행 일정 추천/생성
    └─ 공공데이터포털 OpenAPI 연동
         │
         ▼
  외부 공공데이터(OpenAPI, 날씨 등)



