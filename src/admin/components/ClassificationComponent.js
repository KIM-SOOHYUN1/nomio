import React, { useState } from 'react';
import { fetchAndInsertClassification } from '../../api/insertClassification';
import { fetchClassification } from '../../db/selectClassification';

function CategoryComponent() {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchClass1, setSearchClass1] = useState("");
  const [searchClass2, setSearchClass2] = useState("");
  const [searchClass3, setSearchClass3] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMessage("");
      try {
  const result = await fetchClassification();
        setCategories(result);
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
    let filtered = categories;
    if (searchClass1) {
      filtered = filtered.filter(row => (row.CLASS1_NAME || '').includes(searchClass1));
    }
    if (searchClass2) {
      filtered = filtered.filter(row => (row.CLASS2_NAME || '').includes(searchClass2));
    }
    if (searchClass3) {
      filtered = filtered.filter(row => (row.CLASS3_NAME || '').includes(searchClass3));
    }
    setFiltered(filtered);
    setVisibleCount(10);
  }, [categories, searchClass1, searchClass2, searchClass3]);

  const handleFetchCategory = async () => {
    setLoading(true);
    setMessage("");
    try {
  const result = await fetchAndInsertClassification();
      if (Array.isArray(result)) {
        setMessage('카테고리 코드 DB insert 및 조회 완료');
      } else {
        setMessage('카테고리 코드 DB insert 완료 (조회 데이터 없음)');
      }
    } catch (e) {
      setMessage('에러: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">카테고리 관리</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow disabled:opacity-50"
          onClick={handleFetchCategory}
          disabled={loading}
        >
          {loading ? '처리 중...' : '카테고리코드 DB insert'}
        </button>
      </div>
  <div className="flex gap-2 mb-4 justify-end">
        <input
          type="text"
          className="border px-2 py-1 rounded"
          placeholder="대분류명 검색"
          value={searchClass1}
          onChange={e => setSearchClass1(e.target.value)}
          disabled={loading}
        />
        <input
          type="text"
          className="border px-2 py-1 rounded"
          placeholder="중분류명 검색"
          value={searchClass2}
          onChange={e => setSearchClass2(e.target.value)}
          disabled={loading}
        />
        <input
          type="text"
          className="border px-2 py-1 rounded"
          placeholder="소분류명 검색"
          value={searchClass3}
          onChange={e => setSearchClass3(e.target.value)}
          disabled={loading}
        />
      </div>
      {message && <div className="mb-2 text-blue-700 font-medium">{message}</div>}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
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
                <td colSpan={6} className="text-center py-4 text-gray-400">카테고리 데이터가 없습니다.</td>
              </tr>
            ) : (
              filtered.slice(0, visibleCount).map((item, idx) => (
                <tr key={idx} className="border-b last:border-b-0">
                  <td className="px-4 py-2">{item.SEQ_NO}</td>
                  <td className="px-4 py-2">{item.LCLS1_CODE}</td>
                  <td className="px-4 py-2">{item.LCLS1_NAME}</td>
                  <td className="px-4 py-2">{item.LCLS2_CODE}</td>
                  <td className="px-4 py-2">{item.LCLS2_NAME}</td>
                  <td className="px-4 py-2">{item.LCLS3_CODE}</td>
                  <td className="px-4 py-2">{item.LCLS3_NAME}</td>
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

export default CategoryComponent;
