
import React, { useState, useEffect, useCallback } from 'react';
import { fetchSidoWithSigungu } from '../../db/selectSidoWithSigungu';
import { fetchAndInsertSido } from '../../api/insertSido';
import { fetchAndInsertTbSigungu } from '../../api/insertTbSigungu';


function LegalDongComponent() {
  // [상태 관리]
  const [sigunguRows, setSigunguRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchSido, setSearchSido] = useState('');
  const [searchSigungu, setSearchSigungu] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  // [업무 흐름2] 검색어 입력 시 실시간 필터링
  useEffect(() => {
    let filtered = sigunguRows;
    if (searchSido) {
      filtered = filtered.filter(row => (row.SIDO_NAME || '').includes(searchSido));
    }
    if (searchSigungu) {
      filtered = filtered.filter(row => (row.SIGUNGU_NAME || '').includes(searchSigungu));
    }
    setFilteredRows(filtered);
    setVisibleCount(10);
  }, [sigunguRows, searchSido, searchSigungu]);

  // [업무 흐름3] 시도/시군구 코드 DB insert (수동)
  const handleFetchSido = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
  await fetchAndInsertSido();
      setMessage('시도 코드 DB insert 완료');
    } catch (e) {
      setMessage('에러: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFetchSigungu = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
  await fetchAndInsertTbSigungu();
      setMessage('시군구 코드 DB insert 완료');
    } catch (e) {
      setMessage('에러: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <div className="mb-8 flex items-center gap-4 justify-between">
        <h1 className="text-xl font-bold text-gray-800">법정동 관리</h1>
        <div className="flex gap-2">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow disabled:opacity-50"
            onClick={handleFetchSido}
            disabled={loading}
          >
            {loading ? '가져오는 중...' : '시도 코드 DB insert'}
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow disabled:opacity-50"
            onClick={handleFetchSigungu}
            disabled={loading}
          >
            {loading ? '가져오는 중...' : '시군구 코드 DB insert'}
          </button>
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
    </>
  );
}

export default LegalDongComponent;
