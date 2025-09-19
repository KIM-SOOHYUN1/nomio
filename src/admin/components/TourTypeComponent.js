import React, { useState } from 'react';
import { fetchServiceClassification } from '../../db/selectTourType';


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
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">관광 서비스 분류</h2>
      </div>
      <div className="mb-2 text-sm text-gray-700">
        관광타입: <span className="font-mono">12</span> 관광지, <span className="font-mono">14</span> 문화시설, <span className="font-mono">15</span> 축제공연행사, <span className="font-mono">25</span> 여행코스, <span className="font-mono">28</span> 레포츠, <span className="font-mono">32</span> 숙박, <span className="font-mono">38</span> 쇼핑, <span className="font-mono">39</span> 음식점
      </div>
      <div className="flex gap-2 mb-4 justify-end">
        <input
          type="text"
          className="border px-2 py-1 rounded"
          placeholder="대분류명 검색"
          value={searchL}
          onChange={e => setSearchL(e.target.value)}
          disabled={loading}
        />
        <input
          type="text"
          className="border px-2 py-1 rounded"
          placeholder="중분류명 검색"
          value={searchM}
          onChange={e => setSearchM(e.target.value)}
          disabled={loading}
        />
        <input
          type="text"
          className="border px-2 py-1 rounded"
          placeholder="소분류명 검색"
          value={searchS}
          onChange={e => setSearchS(e.target.value)}
          disabled={loading}
        />
      </div>
      {message && <div className="mb-2 text-blue-700 font-medium">{message}</div>}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-bold text-gray-700">관광타입ID</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">대분류코드</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">대분류명</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">중분류코드</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">중분류명</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">소분류코드</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">소분류명</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-400">데이터가 없습니다.</td>
              </tr>
            ) : (
              filtered.slice(0, visibleCount).map((item, idx) => (
                <tr key={idx} className="border-b last:border-b-0">
                  <td className="px-4 py-2">{item.TOUR_TYPE_ID}</td>
                  <td className="px-4 py-2">{item.CATEGORY_L_CODE}</td>
                  <td className="px-4 py-2">{item.CATEGORY_L_NAME}</td>
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
    </div>
  );
}

export default TourTypeComponent;
