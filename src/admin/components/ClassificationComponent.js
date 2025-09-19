import React, { useState } from 'react';
import { fetchAndInsertClassification } from '../../api/insertClassification';
import { fetchClassification } from '../../db/selectClassification';

function CategoryComponent() {
  // 카테고리코드 DB insert
  const handleFetchCategory = async () => {
    setLoading(true);
    setMessage("");
    try {
      await fetchAndInsertClassification();
      setMessage("카테고리 DB insert 완료");
      const result = await fetchClassification();
      setCategories(result);
    } catch (e) {
      setMessage("에러: " + e.message);
    } finally {
      setLoading(false);
    }
  };
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

  // 필터링 useEffect
  React.useEffect(() => {
    let data = categories;
    if (searchClass1) {
      data = data.filter(item => item.LCLS1_NAME && item.LCLS1_NAME.includes(searchClass1));
    }
    if (searchClass2) {
      data = data.filter(item => item.LCLS2_NAME && item.LCLS2_NAME.includes(searchClass2));
    }
    if (searchClass3) {
      data = data.filter(item => item.LCLS3_NAME && item.LCLS3_NAME.includes(searchClass3));
    }
    setFiltered(data);
  }, [categories, searchClass1, searchClass2, searchClass3]);

  // ...기존 필터링, 핸들러 등 유지...

  return (
    <section className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-extrabold text-blue-900 tracking-tight flex items-center gap-2">
          <span className="inline-block w-2 h-6 bg-blue-500 rounded-full mr-2"></span>
          카테고리 관리
        </h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow disabled:opacity-50 transition"
          onClick={handleFetchCategory}
          disabled={loading}
        >
          {loading ? '처리 중...' : '카테고리코드 DB insert'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4 justify-end">
        <input
          type="text"
          className="border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded-lg shadow-sm text-sm transition w-32"
          placeholder="대분류명 검색"
          value={searchClass1}
          onChange={e => setSearchClass1(e.target.value)}
          disabled={loading}
        />
        <input
          type="text"
          className="border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded-lg shadow-sm text-sm transition w-32"
          placeholder="중분류명 검색"
          value={searchClass2}
          onChange={e => setSearchClass2(e.target.value)}
          disabled={loading}
        />
        <input
          type="text"
          className="border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded-lg shadow-sm text-sm transition w-32"
          placeholder="소분류명 검색"
          value={searchClass3}
          onChange={e => setSearchClass3(e.target.value)}
          disabled={loading}
        />
      </div>
      {message && <div className="mb-3 text-blue-700 font-semibold px-4 py-2 bg-blue-100 rounded shadow-sm">{message}</div>}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-blue-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
            <tr>
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
                <td colSpan={6} className="text-center py-8 text-gray-400 font-semibold">카테고리 데이터가 없습니다.</td>
              </tr>
            ) : (
              <>
                {filtered.slice(0, visibleCount).map((item, idx) => (
                  <tr key={idx} className="border-b last:border-b-0 hover:bg-blue-50 transition">
                    <td className="px-4 py-2">{item.LCLS1_CODE}</td>
                    <td className="px-4 py-2 font-semibold text-blue-700">{item.LCLS1_NAME}</td>
                    <td className="px-4 py-2">{item.LCLS2_CODE}</td>
                    <td className="px-4 py-2">{item.LCLS2_NAME}</td>
                    <td className="px-4 py-2">{item.LCLS3_CODE}</td>
                    <td className="px-4 py-2">{item.LCLS3_NAME}</td>
                  </tr>
                ))}
              </>
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

export default CategoryComponent;
