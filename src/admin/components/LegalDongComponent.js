
import React, { useState, useEffect } from 'react';
import { fetchSidoWithSigungu } from '../../db/admin/selectSidoWithSigungu';
import { fetchAndInsertSido } from '../../api/insertSido';
import { fetchAndInsertTbSigungu } from '../../api/insertTbSigungu';


function LegalDongComponent() {

  // [상태 관리] (최상단에 위치)
  const [sigunguRows, setSigunguRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchSido, setSearchSido] = useState('');
  const [searchSigungu, setSearchSigungu] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 시도 코드 DB insert
  const handleFetchSido = async () => {
    setLoading(true);
    setMessage("");
    try {
      await fetchAndInsertSido();
      setMessage("시도 코드 DB insert 완료");
      const result = await fetchSidoWithSigungu();
      setSigunguRows(result || []);
    } catch (e) {
      setMessage("에러: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // 필터링 useEffect (최상위에만 위치)
  useEffect(() => {
    let rows = sigunguRows;
    if (searchSido) {
      rows = rows.filter(row => row.SIDO_NAME && row.SIDO_NAME.includes(searchSido));
    }
    if (searchSigungu) {
      rows = rows.filter(row => row.SIGUNGU_NAME && row.SIGUNGU_NAME.includes(searchSigungu));
    }
    setFilteredRows(rows);
  }, [sigunguRows, searchSido, searchSigungu]);

  // 시군구 코드 DB insert
  const handleFetchSigungu = async () => {
    setLoading(true);
    setMessage("");
    try {
      await fetchAndInsertTbSigungu();
      setMessage("시군구 코드 DB insert 완료");
      const result = await fetchSidoWithSigungu();
      setSigunguRows(result || []);
    } catch (e) {
      setMessage("에러: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // [업무 흐름1] 화면 진입 시 시도+시군구 조인 리스트 자동 조회
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMessage("");
      try {
        const result = await fetchSidoWithSigungu();
        setSigunguRows(result || []);
      } catch (e) {
        setMessage('에러: ' + e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // ...기존 필터링, 핸들러 등 유지...

  return (
    <section className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-extrabold text-blue-900 tracking-tight flex items-center gap-2">
          <span className="inline-block w-2 h-6 bg-blue-500 rounded-full mr-2"></span>
          법정동 관리
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow disabled:opacity-50 transition"
            onClick={handleFetchSido}
            disabled={loading}
          >
            {loading ? '가져오는 중...' : '시도 코드 DB insert'}
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow disabled:opacity-50 transition"
            onClick={handleFetchSigungu}
            disabled={loading}
          >
            {loading ? '가져오는 중...' : '시군구 코드 DB insert'}
          </button>
          <input
            type="text"
            className="border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded-lg shadow-sm text-sm transition w-32"
            placeholder="시도명 입력"
            value={searchSido}
            onChange={e => setSearchSido(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            className="border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded-lg shadow-sm text-sm transition w-32"
            placeholder="시군구명 입력"
            value={searchSigungu}
            onChange={e => setSearchSigungu(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
      {message && <div className="mb-3 text-blue-700 font-semibold px-4 py-2 bg-blue-100 rounded shadow-sm">{message}</div>}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-blue-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-blue-900">시도 코드</th>
              <th className="px-4 py-3 text-left font-bold text-blue-900">시도명</th>
              <th className="px-4 py-3 text-left font-bold text-blue-900">시군구 코드</th>
              <th className="px-4 py-3 text-left font-bold text-blue-900">시군구명</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400 font-semibold">데이터가 없습니다.</td>
              </tr>
            ) : (
              filteredRows.slice(0, visibleCount).map((row, idx) => (
                <tr key={row.SIGUNGU_CODE + '-' + idx} className="border-b last:border-b-0 hover:bg-blue-50 transition">
                  <td className="px-4 py-2 font-mono text-blue-800">{row.SIDO_CODE}</td>
                  <td className="px-4 py-2 font-semibold text-blue-700">{row.SIDO_NAME}</td>
                  <td className="px-4 py-2">{row.SIGUNGU_CODE}</td>
                  <td className="px-4 py-2">{row.SIGUNGU_NAME}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {visibleCount < filteredRows.length && (
          <div className="flex justify-center my-6">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold transition"
              onClick={() => setVisibleCount(c => c + 10)}
            >
              더보기
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default LegalDongComponent;
