
// AdminPage.js: 법정동 관리 메뉴 및 CRUD UI의 시작점
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import LegalDongComponent from './components/LegalDongComponent'; // 법정동 관리 컴포넌트
import ClassificationComponent from './components/ClassificationComponent'; // 분류체계 관리 컴포넌트
import TourTypeComponent from './components/TourTypeComponent'; // 관광서비스분류 관리 컴포넌트
import PlaceListComponent from './components/RegionTourListComponent'; // 지역별 여행지 목록 관리 컴포넌트
// AdminPage: 법정동(시도/시군구) 관리 메인 페이지
// - 시도/시군구 코드 DB insert, 조인 리스트 조회, 검색, 더보기 등 실무형 관리자 기능 구현
// - 업무 흐름: 화면 진입 시 자동 조회 → 검색 → 더보기(점진적 노출) → DB insert(수동)
// - 실무에서 참고할 만한 상세 주석 포함
function AdminPage() {
  // 메뉴 분기만 담당
  const menu = [
    // 공통
    { key: 'legal-dong', label: '법정동 관리', group: 'common' },
    { key: 'classification', label: '분류체계 관리', group: 'common' },
    { key: 'tour-type', label: '관광서비스분류 관리', group: 'common' },
    // 여행지 관리
    { key: 'place-list', label: '지역별 여행지 목록', group: 'place' },
  ];
  const [activeMenu, setActiveMenu] = useState('legal-dong');

  return (
    <AdminLayout menu={menu} onMenuClick={setActiveMenu} activeMenu={activeMenu}>
      {activeMenu === 'legal-dong' && <LegalDongComponent />} 
      {activeMenu === 'classification' && <ClassificationComponent />}
      {activeMenu === 'tour-type' && <TourTypeComponent />}
      {activeMenu === 'place-list' && <PlaceListComponent />}
    </AdminLayout>
  );
}

export default AdminPage;
