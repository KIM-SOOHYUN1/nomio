import React, { useState } from 'react';
import { fetchServiceClassification } from '../../db/admin/selectTourType';


function TourTypeComponent() {
  const [tourTypes, setTourTypes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchL, setSearchL] = useState("");
  const [searchM, setSearchM] = useState("");
  const [searchS, setSearchS] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMessage("");
      try {
        const result = await fetchServiceClassification();
        setTourTypes(result);
      } catch (e) {
        setMessage('에러: ' + e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 검색 필터링
  React.useEffect(() => {
    let filtered = tourTypes;
    if (searchL) {
      filtered = filtered.filter(row => (row.CATEGORY_L_NAME || '').includes(searchL));
    }
    if (searchM) {
      filtered = filtered.filter(row => (row.CATEGORY_M_NAME || '').includes(searchM));
    }
    if (searchS) {
      filtered = filtered.filter(row => (row.CATEGORY_S_NAME || '').includes(searchS));
    }
    setFiltered(filtered);
    setVisibleCount(10);
  }, [tourTypes, searchL, searchM, searchS]);

  return (
    <section className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-extrabold text-blue-900 tracking-tight flex items-center gap-2">
          <span className="inline-block w-2 h-6 bg-blue-500 rounded-full mr-2"></span>
          관광 서비스 분류
        </h2>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            className="border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded-lg shadow-sm text-sm transition w-32"
            placeholder="대분류명 검색"
            value={searchL}
            onChange={e => setSearchL(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            className="border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded-lg shadow-sm text-sm transition w-32"
            placeholder="중분류명 검색"
            value={searchM}
            onChange={e => setSearchM(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            className="border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded-lg shadow-sm text-sm transition w-32"
            placeholder="소분류명 검색"
            value={searchS}
            onChange={e => setSearchS(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
      <div className="mb-3 text-xs text-gray-500 bg-blue-50 rounded px-4 py-2 shadow-sm">
        관광타입: <span className="font-mono">12</span> 관광지, <span className="font-mono">14</span> 문화시설, <span className="font-mono">15</span> 축제공연행사, <span className="font-mono">25</span> 여행코스, <span className="font-mono">28</span> 레포츠, <span className="font-mono">32</span> 숙박, <span className="font-mono">38</span> 쇼핑, <span className="font-mono">39</span> 음식점
      </div>
      {message && <div className="mb-3 text-blue-700 font-semibold px-4 py-2 bg-blue-100 rounded shadow-sm">{message}</div>}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-blue-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-blue-900">관광타입ID</th>
              <th className="px-4 py-3 text-left font-bold text-blue-900">대분류코드</th>
              <th className="px-4 py-3 text-left font-bold text-blue-900">대분류명</th>
              <th className="px-4 py-3 text-left font-bold text-blue-900">중분류코드</th>
              <th className="px-4 py-3 text-left font-bold text-blue-900">중분류명</th>
              <th className="px-4 py-3 text-left font-bold text-blue-900">소분류코드</th>
              <th className="px-4 py-3 text-left font-bold text-blue-900">소분류명</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400 font-semibold">데이터가 없습니다.</td>
              </tr>
            ) : (
              filtered.slice(0, visibleCount).map((item, idx) => (
                <tr key={idx} className="border-b last:border-b-0 hover:bg-blue-50 transition">
                  <td className="px-4 py-2 font-mono text-blue-800">{item.TOUR_TYPE_ID}</td>
                  <td className="px-4 py-2">{item.CATEGORY_L_CODE}</td>
                  <td className="px-4 py-2 font-semibold text-blue-700">{item.CATEGORY_L_NAME}</td>
                  <td className="px-4 py-2">{item.CATEGORY_M_CODE}</td>
                  <td className="px-4 py-2">{item.CATEGORY_M_NAME}</td>
                  <td className="px-4 py-2">{item.CATEGORY_S_CODE}</td>
                  <td className="px-4 py-2">{item.CATEGORY_S_NAME}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {visibleCount < filtered.length && (
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

export default TourTypeComponent;
