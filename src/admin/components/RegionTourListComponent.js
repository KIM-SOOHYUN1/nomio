import React, { useState } from 'react';
import { fetchTourListByRegion } from '../../api/fetchTourListByRegion';
import { insertTourPlace } from '../../api/insertTourPlace';

function RegionTourListComponent() {
  const [region, setRegion] = useState('');
  const [tourList, setTourList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [insertLoading, setInsertLoading] = useState(false);
  const [insertMsg, setInsertMsg] = useState('');

  // 여행지 조회 프로세스
  const handleFetchTourList = async () => {
    setLoading(true);
    setMessage('');
    setTourList([]);
    try {
      const data = await fetchTourListByRegion(region);
      setTourList(data || []);
      setMessage(data && data.length > 0 ? `총 ${data.length}건 조회됨` : '데이터가 없습니다.');
    } catch (e) {
      setMessage('에러: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // 여행지 전체 insert 프로세스 (insertTourPlace.js 호출)
  const handleInsertAll = async () => {
    setInsertLoading(true);
    setInsertMsg('');
    try {
      await insertTourPlace();
      setInsertMsg('insertTourPlace API 호출 완료');
    } catch (e) {
      setInsertMsg('insertTourPlace 에러: ' + e.message);
    }
    setInsertLoading(false);
  };

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          className="border border-blue-200 px-3 py-2 rounded-lg shadow-sm text-sm w-48"
          placeholder="지역명(예: 서울) 입력"
          value={region}
          onChange={e => setRegion(e.target.value)}
          disabled={loading || insertLoading}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow disabled:opacity-50 transition"
          onClick={handleFetchTourList}
          disabled={loading || !region}
        >
          {loading ? '조회 중...' : '여행지 조회'}
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
          onClick={handleInsertAll}
        >
          {insertLoading ? '저장 중...' : 'insert 여행지'}
        </button>
      </div>
      {message && <div className="mb-3 text-blue-700 font-semibold">{message}</div>}
      {insertMsg && <div className="mb-2 text-green-700 font-semibold">{insertMsg}</div>}
      <div className="bg-white rounded-xl shadow border border-blue-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-blue-900">여행지명</th>
              <th className="px-4 py-3 text-left font-bold text-blue-900">주소</th>
              <th className="px-4 py-3 text-left font-bold text-blue-900">카테고리</th>
            </tr>
          </thead>
          <tbody>
            {tourList.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-400 font-semibold">데이터가 없습니다.</td>
              </tr>
            ) : (
              tourList.map((item, idx) => (
                <tr key={item.id || idx} className="border-b last:border-b-0 hover:bg-blue-50 transition">
                  <td className="px-4 py-2 font-semibold text-blue-700">{item.name}</td>
                  <td className="px-4 py-2">{item.address}</td>
                  <td className="px-4 py-2">{item.category}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RegionTourListComponent;
