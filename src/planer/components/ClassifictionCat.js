

import React, { useState, useEffect } from 'react';

import { selectTourSpot } from '../../db/planer/selectTourSpot.js';

// 카테고리 클릭 시 좌표를 상위로 전달
function ClassifictionCat({ onCategorySelect }) {


    const [allData, setAllData] = useState([]); // 카테고리 코드/이름 등
    const [tourSpots, setTourSpots] = useState([]); // 여행지 목록
    const [selectedLcls1, setSelectedLcls1] = useState(null);
    const [selectedLcls2, setSelectedLcls2] = useState(null);
    const [selectedLcls3, setSelectedLcls3] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 카테고리 코드/이름 등
                const result = await import('../../db/planer/selectClassifictionCode.js').then(m => m.selectClassifictionCode());
                setAllData(result);
                // 여행지 목록
                const spots = await selectTourSpot();
                setTourSpots(spots);
            } catch (e) {
                console.log('에러:', e.message);
            }
        };
        fetchData();
    }, []);

    // 1뎁스(대분류) 목록
    const lcls1List = Array.from(new Set(allData.map(item => item.LCLS1_NAME)));
    // 2뎁스(중분류) 목록 (선택된 1뎁스 기준)
    const lcls2List = selectedLcls1
        ? Array.from(new Set(allData.filter(item => item.LCLS1_NAME === selectedLcls1).map(item => item.LCLS2_NAME)))
        : [];
    // 3뎁스(소분류) 목록 (선택된 2뎁스 기준)
    const lcls3List = selectedLcls2
        ? Array.from(new Set(allData.filter(item => item.LCLS1_NAME === selectedLcls1 && item.LCLS2_NAME === selectedLcls2).map(item => item.LCLS3_NAME)))
        : [];

    // 카테고리별 좌표 예시 (실제 데이터에 맞게 수정 필요)
    // 실제로는 allData에서 좌표 필드(LAT, LNG 등)를 사용해야 함
    // 카테고리별 여행지 좌표 추출 (1,2,3뎁스 모두 지원)
    function getCategoryLatLng({ lcls1, lcls2, lcls3 }) {
        let cat;
        if (lcls3) {
            cat = allData.find(item => item.LCLS1_NAME === lcls1 && item.LCLS2_NAME === lcls2 && item.LCLS3_NAME === lcls3);
        } else if (lcls2) {
            cat = allData.find(item => item.LCLS1_NAME === lcls1 && item.LCLS2_NAME === lcls2);
        } else {
            cat = allData.find(item => item.LCLS1_NAME === lcls1);
        }
        if (!cat) return [{ lat: 37.5665, lng: 126.9780, label: lcls1 }];
        let spots = [];
        if (lcls3) {
            spots = tourSpots.filter(s => s.LCLS1_CODE === cat.LCLS1_CODE && s.LCLS2_CODE === cat.LCLS2_CODE && s.LCLS3_CODE === cat.LCLS3_CODE);
        } else if (lcls2) {
            spots = tourSpots.filter(s => s.LCLS1_CODE === cat.LCLS1_CODE && s.LCLS2_CODE === cat.LCLS2_CODE);
        } else {
            spots = tourSpots.filter(s => s.LCLS1_CODE === cat.LCLS1_CODE);
        }
        if (spots.length > 0) {
            return spots.map(s => ({
                lat: Number(s.MAP_Y),
                lng: Number(s.MAP_X),
                label: s.SPOT_NAME || lcls1,
                TITLE: s.TITLE,
                ADDR1: s.ADDR1,
                ADDR2: s.ADDR2,
                FIRST_IMAGE_URL: s.FIRST_IMAGE_URL,
                SECOND_IMAGE_URL: s.SECOND_IMAGE_URL,
                MODIFIED_DT: s.MODIFIED_DT
            }));
        }
        return [{ lat: 37.5665, lng: 126.9780, label: lcls1 }];
    }
    return (
        <div style={{
            padding: '32px 10px',
            background: '#f7f8fa',
            minHeight: 400,
            borderRadius: 18,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
            maxWidth: 820,
            margin: '32px auto',
            fontFamily: 'Pretendard, Noto Sans KR, Arial, sans-serif',
            border: '1px solid #e5e7eb',
        }}>
            {/* 1뎁스 태그 */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#3b3b3b', marginBottom: 8, letterSpacing: 0.2, textAlign: 'center' }}>여행 카테고리</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
                    {lcls1List.map((l1, idx) => (
                        <button
                            key={l1}
                            onClick={() => {
                                setSelectedLcls1(l1);
                                setSelectedLcls2(null);
                                if (onCategorySelect) {
                                    const posArr = getCategoryLatLng({ lcls1: l1 });
                                    onCategorySelect(posArr);
                                }
                            }}
                            style={{
                                padding: '12px 0',
                                borderRadius: 14,
                                border: selectedLcls1 === l1 ? '2px solid #6366f1' : '1.5px solid #e0e7ef',
                                background: selectedLcls1 === l1 ? '#6366f1' : '#fff',
                                color: selectedLcls1 === l1 ? '#fff' : '#6366f1',
                                fontWeight: 600,
                                fontSize: 15,
                                boxShadow: 'none',
                                cursor: 'pointer',
                                outline: 'none',
                                transition: 'background 0.15s, color 0.15s, border 0.15s',
                                letterSpacing: 0.1,
                                marginBottom: 2,
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = '#e0e7ff'; e.currentTarget.style.color = '#6366f1'; }}
                            onMouseOut={e => { e.currentTarget.style.background = selectedLcls1 === l1 ? '#6366f1' : '#fff'; e.currentTarget.style.color = selectedLcls1 === l1 ? '#fff' : '#6366f1'; }}
                        >
                            {l1}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2뎁스 태그 */}
            {selectedLcls1 && (
                <div style={{ marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#2563eb', marginBottom: 6, letterSpacing: 0.1, textAlign: 'center' }}>세부 카테고리</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 6 }}>
                        {lcls2List.map((l2, idx) => (
                            <button
                                key={l2}
                                onClick={() => {
                                    setSelectedLcls2(l2);
                                    if (onCategorySelect) {
                                        const posArr = getCategoryLatLng({ lcls1: selectedLcls1, lcls2: l2 });
                                        onCategorySelect(posArr);
                                    }
                                }}
                                style={{
                                    padding: '9px 0',
                                    borderRadius: 10,
                                    border: selectedLcls2 === l2 ? '2px solid #2563eb' : '1.5px solid #e0e7ef',
                                    background: selectedLcls2 === l2 ? '#2563eb' : '#fff',
                                    color: selectedLcls2 === l2 ? '#fff' : '#2563eb',
                                    fontWeight: 500,
                                    fontSize: 14,
                                    boxShadow: 'none',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    transition: 'background 0.15s, color 0.15s, border 0.15s',
                                    letterSpacing: 0.05,
                                    marginBottom: 2,
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = '#e0e7ff'; e.currentTarget.style.color = '#2563eb'; }}
                                onMouseOut={e => { e.currentTarget.style.background = selectedLcls2 === l2 ? '#2563eb' : '#fff'; e.currentTarget.style.color = selectedLcls2 === l2 ? '#fff' : '#2563eb'; }}
                            >
                                {l2}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 3뎁스 태그 */}
            {selectedLcls2 && (
                <div style={{ marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#f59e42', marginBottom: 4, letterSpacing: 0.05, textAlign: 'center' }}>세부 항목</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 4 }}>
                        {lcls3List.map((l3, idx) => (
                            <span
                                key={l3}
                                onClick={() => {
                                    setSelectedLcls3(l3);
                                    if (onCategorySelect) {
                                        const posArr = getCategoryLatLng({ lcls1: selectedLcls1, lcls2: selectedLcls2, lcls3: l3 });
                                        onCategorySelect(posArr);
                                    }
                                }}
                                style={{
                                    display: 'inline-block',
                                    padding: '7px 0',
                                    borderRadius: 8,
                                    border: selectedLcls3 === l3 ? '2px solid #fbbf24' : '1.5px solid #fbbf24',
                                    background: selectedLcls3 === l3 ? '#fbbf24' : '#fffbe9',
                                    color: selectedLcls3 === l3 ? '#fff' : '#b45309',
                                    fontWeight: 500,
                                    fontSize: 13,
                                    textAlign: 'center',
                                    letterSpacing: 0.03,
                                    opacity: 0.97,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {l3}
                            </span>
                        ))}
                    </div>
                </div>
            )}
    </div>
    );
}

export default ClassifictionCat;
