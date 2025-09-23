import React, { useState } from 'react';
import ClassifictionCat from '../planer/components/ClassifictionCat.js';
import NaverMapWithMarkers from '../planer/components/NaverMapWithMarkers.js';
function PlanerPage() {
  const [markers, setMarkers] = useState([]);
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
        padding: '24px 12px',
        overflowY: 'auto'
      }}>
        {/* 카테고리 리스트 자리 */}
        <div style={{
          fontWeight: 700,
          fontSize: '1.1rem',
          marginBottom: 16,
          color: '#2563eb'
        }}>카테고리</div>
        <ClassifictionCat onCategorySelect={setMarkers} />
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
          <NaverMapWithMarkers markers={markers} />
        </div>
      </div>
    </div>
  );
}

export default PlanerPage;
