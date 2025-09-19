// 실제 API 연동 전용 더미 함수
export async function fetchTourListByRegion(region) {
  if (!region) return [];
  // 예시 데이터
  return [
    { id: 1, name: '경복궁', address: `${region} 종로구`, category: '역사' },
    { id: 2, name: 'N서울타워', address: `${region} 용산구`, category: '전망대' },
  ];
}
