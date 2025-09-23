import React from 'react';

function RegionSelector({
  sidoList = [],
  sigunguList = [],
  selectedSido,
  selectedSigungu,
  onSidoClick,
  onSigunguClick
}) {
  return (
    <div style={{ padding: '18px 10px 8px 10px', borderBottom: '1px solid #e5e7eb', marginBottom: 12 }}>
      <div style={{ fontWeight: 700, fontSize: 17, color: '#2563eb', marginBottom: 8 }}>지역 선택</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {sidoList.map(s => (
          <button
            key={s.SIDO_CODE}
            onClick={() => onSidoClick(s.SIDO_CODE)}
            style={{
              padding: '7px 14px',
              borderRadius: 14,
              border: s.SIDO_CODE === selectedSido ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
              background: s.SIDO_CODE === selectedSido ? '#2563eb' : '#f8fafc',
              color: s.SIDO_CODE === selectedSido ? '#fff' : '#2563eb',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              outline: 'none',
              transition: 'background 0.15s, color 0.15s, border 0.15s',
              marginBottom: 2,
            }}
          >
            {s.SIDO_NAME}
          </button>
        ))}
      </div>
      {selectedSido && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {sigunguList.map(sg => (
            <button
              key={sg.SIGUNGU_CODE}
              onClick={() => onSigunguClick(sg.SIGUNGU_CODE)}
              style={{
                padding: '6px 12px',
                borderRadius: 10,
                border: sg.SIGUNGU_CODE === selectedSigungu ? '2px solid #f59e42' : '1.5px solid #fbbf24',
                background: sg.SIGUNGU_CODE === selectedSigungu ? '#fbbf24' : '#fffbe9',
                color: sg.SIGUNGU_CODE === selectedSigungu ? '#fff' : '#b45309',
                fontWeight: 500,
                fontSize: 14,
                cursor: 'pointer',
                outline: 'none',
                transition: 'background 0.15s, color 0.15s, border 0.15s',
                marginBottom: 2,
              }}
            >
              {sg.SIGUNGU_NAME}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default RegionSelector;
