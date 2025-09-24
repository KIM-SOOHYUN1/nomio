import React, { useState, useEffect } from 'react';
import ClassifictionCat from '../planer/components/ClassifictionCat.js';
import NaverMapWithMarkers from '../planer/components/NaverMapWithMarkers.js';
import NaverDirectionsTest from '../planer/components/NaverDirectionsTest.js';
import { selectSido } from '../db/planer/selectSido.js';
import { selectSigungu } from '../db/planer/selectSigungu.js';
import { selectTourSpot } from '../db/planer/selectTourSpot.js';
import RegionSelector from '../planer/components/RegionSelector.js';


function PlanerPage() {
  const [markers, setMarkers] = useState([]);
  const [allTourSpots, setAllTourSpots] = useState([]);
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [selectedSido, setSelectedSido] = useState(null);
  const [selectedSigungu, setSelectedSigungu] = useState(null);
  const [categoryMarkers, setCategoryMarkers] = useState(null); // 카테고리 선택시 마커 후보
  const [mapInstance, setMapInstance] = useState(null); // 네이버 지도 인스턴스

  useEffect(() => {
    selectSido().then(setSidoList);
    selectTourSpot().then(setAllTourSpots);
  }, []);


  // 지역 버튼 클릭 시 마커 표시 (카테고리처럼 명확하게)



  // 클릭 시 상태만 변경, 마커 갱신은 useEffect에서 처리
  const handleSidoClick = (sidoCode) => {
    setSelectedSido(sidoCode === selectedSido ? null : sidoCode);
    setSelectedSigungu(null);
  };

  const handleSigunguClick = (sigunguCode) => {
    setSelectedSigungu(sigunguCode === selectedSigungu ? null : sigunguCode);
  };

  // 카테고리 선택시 마커 후보 저장 (지역코드 필드 보장)
  const handleCategorySelect = (markerArr) => {
    // 각 마커에 LDONG_REGN_CODE, LDONG_SIGUNGU_CODE가 없으면 allTourSpots에서 찾아서 추가
    const withRegion = markerArr.map(m => {
      if (m.LDONG_REGN_CODE && m.LDONG_SIGUNGU_CODE) return m;
      // spotName, TITLE 등으로 매칭
      const found = allTourSpots.find(s =>
        (s.SPOT_NAME && m.label && s.SPOT_NAME === m.label) ||
        (s.TITLE && m.TITLE && s.TITLE === m.TITLE)
      );
      return found
        ? { ...m, LDONG_REGN_CODE: found.LDONG_REGN_CODE, LDONG_SIGUNGU_CODE: found.LDONG_SIGUNGU_CODE }
        : m;
    });
    setCategoryMarkers(withRegion);
  };

  // 지역 선택 상태가 바뀔 때마다 마커 자동 갱신

  useEffect(() => {
    // 카테고리와 지역 모두 선택된 경우: 값이 있는 조건만 적용해서 동적 필터
    if (categoryMarkers) {
      let filtered = categoryMarkers;
      if (selectedSido != null) {
        filtered = filtered.filter(m => Number(m.LDONG_REGN_CODE) === Number(selectedSido));
      }
      if (selectedSigungu != null) {
        filtered = filtered.filter(m => Number(m.LDONG_SIGUNGU_CODE) === Number(selectedSigungu));
      }
      setMarkers(filtered.map(m => ({ ...m, lat: Number(m.lat), lng: Number(m.lng) })));
    } else if (selectedSido != null || selectedSigungu != null) {
      // 지역만 선택된 경우: 값이 있는 조건만 적용
      let filtered = allTourSpots;
      if (selectedSido != null) {
        filtered = filtered.filter(s => Number(s.LDONG_REGN_CODE) === Number(selectedSido));
      }
      if (selectedSigungu != null) {
        filtered = filtered.filter(s => Number(s.LDONG_SIGUNGU_CODE) === Number(selectedSigungu));
      }
      setMarkers(filtered.map(s => ({
        lat: Number(s.MAP_Y),
        lng: Number(s.MAP_X),
        label: s.SPOT_NAME,
        TITLE: s.TITLE,
        ADDR1: s.ADDR1,
        ADDR2: s.ADDR2,
        FIRST_IMAGE_URL: s.FIRST_IMAGE_URL,
        SECOND_IMAGE_URL: s.SECOND_IMAGE_URL,
        MODIFIED_DT: s.MODIFIED_DT,
        LDONG_REGN_CODE: s.LDONG_REGN_CODE,
        LDONG_SIGUNGU_CODE: s.LDONG_SIGUNGU_CODE
      })));
    } else {
      setMarkers([]);
    }
  }, [selectedSido, selectedSigungu, allTourSpots, categoryMarkers]);

  useEffect(() => {
    if (selectedSido) {
      selectSigungu().then(list => {
        setSigunguList(list.filter(s => s.SIDO_CODE === selectedSido));
      });
    } else {
      setSigunguList([]);
    }
  }, [selectedSido]);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#f8fafc',
      borderRadius: '16px',
      boxShadow: '0 2px 8px #e0e7ef',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '20%',
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        overflowY: 'auto'
      }}>
        {/* 지역(시도/시군구) 리스트 UI - 컴포넌트 분리 */}
        <RegionSelector
          sidoList={sidoList}
          sigunguList={sigunguList}
          selectedSido={selectedSido}
          selectedSigungu={selectedSigungu}
          onSidoClick={handleSidoClick}
          onSigunguClick={handleSigunguClick}
        />
        {/* 카테고리 리스트 자리 */}
  <ClassifictionCat onCategorySelect={handleCategorySelect} />
      </div>
      <div style={{
        width: '80%',
        background: '#f1f5f9',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* 지도 영역 자리 */}
        <div style={{
          width: '100%',
          height: '100%',
          background: '#e0e7ef',
          borderRadius: '12px',
          border: '1px solid #cbd5e1'
        }}>
          <NaverMapWithMarkers markers={markers} onMapInstance={setMapInstance} />
          {/* 지도에 표시된 마커만 경로 연결 (시도만 선택시 길찾기 제외) */}
          {markers.length > 1 && mapInstance && (selectedSigungu || categoryMarkers) && (
            <NaverDirectionsTest
              tourSpots={markers}
              mapInstance={mapInstance}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PlanerPage;
