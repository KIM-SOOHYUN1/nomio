// AdminPage.js: 법정동 관리 메뉴 및 CRUD UI의 시작점

import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

// AdminPage: 법정동(시도/시군구) 관리 메인 페이지
// - 시도/시군구 코드 DB insert, 조인 리스트 조회, 검색, 더보기 등 실무형 관리자 기능 구현
// - 업무 흐름: 화면 진입 시 자동 조회 → 검색 → 더보기(점진적 노출) → DB insert(수동)
// - 실무에서 참고할 만한 상세 주석 포함
function AdminPage() {
  // [상태 관리]
  // 시군구 전체 데이터(조인 결과, 원본)
  const [sigunguRows, setSigunguRows] = useState([]); // Supabase에서 받아온 전체 시군구 데이터
  // 검색/필터링된 데이터(실제 화면에 노출되는 데이터)
  const [filteredRows, setFilteredRows] = useState([]); // 검색어 반영된 결과
  // 더보기: 현재 화면에 보여줄 행 개수(초기 10개, 더보기 클릭 시 10개씩 증가)
  const [visibleCount, setVisibleCount] = useState(10); // ← 기본 노출 개수는 여기서 조정
  // 검색어(시도명, 시군구명)
  const [searchSido, setSearchSido] = useState(''); // 시도명 검색어
  const [searchSigungu, setSearchSigungu] = useState(''); // 시군구명 검색어

  // [업무 흐름1] 화면 진입 시 시도+시군구 조인 리스트 자동 조회
  // - Supabase에서 TB_SIDO, TB_SIGUNGU 조인 결과를 가져와서 setSigunguRows에 저장
  // - insertTbSigungu.js의 fetchSidoWithSigungu 함수 사용
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMessage("");
      try {
        const mod = await import('./insertTbSigungu.js');
        if (mod.fetchSidoWithSigungu) {
          const result = await mod.fetchSidoWithSigungu();
          setSigunguRows(result || []); // 원본 데이터 저장
        } else {
          setMessage('함수 실행 실패: fetchSidoWithSigungu 없음');
        }
      } catch (e) {
        setMessage('에러: ' + e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // [업무 흐름2] 검색어 입력 시 실시간 필터링
  // - 시도명/시군구명 입력값이 바뀔 때마다 원본 데이터(sigunguRows)에서 필터링
  // - setFilteredRows에 결과 저장, setVisibleCount(10)로 더보기 초기화
  useEffect(() => {
    let filtered = sigunguRows;
    if (searchSido) {
      filtered = filtered.filter(row => (row.SIDO_NAME || '').includes(searchSido));
    }
    if (searchSigungu) {
      filtered = filtered.filter(row => (row.SIGUNGU_NAME || '').includes(searchSigungu));
    }
    setFilteredRows(filtered);
    setVisibleCount(10); // 검색 시 더보기 초기화
  }, [sigunguRows, searchSido, searchSigungu]);
  // [기타 상태]
  const [loading, setLoading] = useState(false); // 로딩 스피너/버튼 비활성화용
  const [message, setMessage] = useState("");   // 상단 메시지(성공/에러)
  // 좌측 메뉴(확장 가능)
  const menu = [
    { key: 'legal-dong', label: '법정동 관리' },
    // 추후 메뉴 확장 가능
  ];
  const [activeMenu, setActiveMenu] = useState('legal-dong');


  // [업무 흐름3] 시도/시군구 코드 DB insert (수동)
  // - Supabase에 시도/시군구 코드 insert (공공데이터 API → DB)
  // - 버튼 클릭 시 각각 실행, 성공/실패 메시지 표시
  const handleFetchSido = async () => {
    setLoading(true);
    setMessage("");
    try {
      const mod = await import('./insertSido.js');
      if (mod.fetchAndInsertSido) {
        await mod.fetchAndInsertSido();
        setMessage('시도 코드 DB insert 완료');
      } else {
        setMessage('함수 실행 실패: fetchAndInsertSido 없음');
      }
    } catch (e) {
      setMessage('에러: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSigungu = async () => {
    setLoading(true);
    setMessage("");
    try {
      const mod = await import('./insertTbSigungu.js');
      if (mod.fetchAndInsertTbSigungu) {
        await mod.fetchAndInsertTbSigungu();
        setMessage('시군구 코드 DB insert 완료');
      } else {
        setMessage('함수 실행 실패: fetchAndInsertTbSigungu 없음');
      }
    } catch (e) {
      setMessage('에러: ' + e.message);
    } finally {
      setLoading(false);
    }
  };



  // [UI] 상단: 업무 흐름별 버튼/검색창
  return (
    <AdminLayout menu={menu} onMenuClick={setActiveMenu} activeMenu={activeMenu}>
      <div className="mb-8 flex items-center gap-4 justify-between">
        <h1 className="text-xl font-bold text-gray-800">법정동 관리</h1>
        <div className="flex gap-2">
          {/* [업무 흐름3] 시도/시군구 코드 DB insert 버튼 */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow disabled:opacity-50"
            onClick={handleFetchSido}
            disabled={loading}
          >
            {loading ? '가져오는 중...' : '시도 가져오기'}
          </button>
          <button
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded shadow disabled:opacity-50"
            onClick={handleFetchSigungu}
            disabled={loading}
          >
            {loading ? '가져오는 중...' : '시군구 가져오기'}
          </button>
          {/* [업무 흐름2] 검색창 */}
          <input
            type="text"
            className="border px-2 py-1 rounded"
            placeholder="시도명 입력"
            value={searchSido}
            onChange={e => setSearchSido(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            className="border px-2 py-1 rounded"
            placeholder="시군구명 입력"
            value={searchSigungu}
            onChange={e => setSearchSigungu(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
      {/* [업무 흐름1/2] 시도+시군구 리스트, 검색, 더보기 */}
      {message && <div className="mb-4 text-blue-700 font-medium">{message}</div>}
      <div className="overflow-x-auto bg-white rounded shadow mt-6">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-bold text-gray-700">시도 코드</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">시도명</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">시군구 코드</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">시군구명</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.slice(0, visibleCount).map((row, idx) => (
              <tr key={row.SIGUNGU_CODE + '-' + idx} className="border-b last:border-b-0">
                <td className="px-4 py-2">{row.SIDO_CODE}</td>
                <td className="px-4 py-2">{row.SIDO_NAME}</td>
                <td className="px-4 py-2">{row.SIGUNGU_CODE}</td>
                <td className="px-4 py-2">{row.SIGUNGU_NAME}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* [업무 흐름2] 더보기 버튼: 10개씩 추가 노출 */}
        {visibleCount < filteredRows.length && (
          <div className="flex justify-center my-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setVisibleCount(c => c + 10)}
            >
              더보기
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminPage;
