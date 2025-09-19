// AdminPage.js: 법정동 관리 메뉴 및 CRUD UI의 시작점

import React, { useState, useEffect } from 'react';


// 샘플 카테고리/장소 데이터 (실제 데이터 연결 전용)
const sampleCategories = [
  {
    name: '관광지',
    color: 'bg-blue-500',
    items: [
      { id: 1, name: '경복궁', lat: 37.5796, lng: 126.9770 },
      { id: 2, name: '남산타워', lat: 37.5512, lng: 126.9882 },
    ],
  },
  {
    name: '맛집',
    color: 'bg-pink-500',
    items: [
      { id: 3, name: '을지로골뱅이', lat: 37.5663, lng: 126.9910 },
      { id: 4, name: '광장시장빈대떡', lat: 37.5704, lng: 126.9997 },
    ],
  },
  {
    name: '카페',
    color: 'bg-yellow-400',
    items: [
      { id: 5, name: '익선동카페', lat: 37.5744, lng: 126.9910 },
    ],
  },
];

function PlanerPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* 카테고리별 리스트 */}
      <div className="w-full md:w-1/3">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">여행 카테고리</h2>
        <div className="space-y-6">
          {sampleCategories.map(cat => (
            <div key={cat.name}>
              <div className={`text-lg font-semibold mb-2 ${cat.color} text-white px-3 py-1 rounded`}>{cat.name}</div>
              <ul className="space-y-1">
                {cat.items.map(item => (
                  <li key={item.id}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded transition shadow-sm border border-gray-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 ${selected && selected.id === item.id ? 'bg-blue-200 font-bold' : 'bg-white'}`}
                      onClick={() => setSelected(item)}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 지도 미리보기 (실제 지도 대신 마커 UI) */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">여행 지도 미리보기</h2>
        <div className="relative w-full max-w-lg h-96 bg-blue-100 rounded-2xl shadow-inner flex items-center justify-center">
          {/* 지도 배경 (샘플) */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-white rounded-2xl" />
          {/* 마커들 */}
          {sampleCategories.flatMap(cat => cat.items).map(item => (
            <div
              key={item.id}
              className={`absolute transition-all duration-200 ${selected && selected.id === item.id ? 'scale-125 z-20' : 'scale-100 z-10'}`}
              style={{
                left: `${30 + (item.lng - 126.97) * 1000}px`,
                top: `${150 - (item.lat - 37.55) * 2000}px`,
              }}
            >
              <div
                className={`rounded-full border-4 ${selected && selected.id === item.id ? 'border-blue-600' : 'border-white'} shadow-lg bg-white`}
                style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title={item.name}
              >
                <span className="text-xs font-bold text-blue-700">{item.name[0]}</span>
              </div>
              {selected && selected.id === item.id && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-white border rounded shadow text-sm text-gray-800 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 text-gray-500 text-sm">※ 실제 지도 및 데이터 연동은 추후 제공됩니다.</div>
      </div>
    </div>
  );
}

export default PlanerPage;
