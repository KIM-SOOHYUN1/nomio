import React, { useEffect, useState } from 'react';
// 네이버 Directions API 호출 및 지도에 폴리라인 표시 테스트용
// props: tourSpots (여행지 배열), mapInstance (네이버 지도 인스턴스)

function NaverDirectionsTest({ tourSpots, mapInstance }) {
  const [polyline, setPolyline] = useState(null);
  const [loading, setLoading] = useState(false);
    console.log('tourSpots:', tourSpots);
  useEffect(() => {
    if (!tourSpots || tourSpots.length < 2 || !mapInstance) return;
    // 출발지, 경유지, 도착지 좌표: MAP_X/MAP_Y 또는 lng/lat 지원
    function getCoord(spot) {
      if (spot.MAP_X !== undefined && spot.MAP_Y !== undefined) {
        return `${spot.MAP_X},${spot.MAP_Y}`;
      } else if (spot.lng !== undefined && spot.lat !== undefined) {
        return `${spot.lng},${spot.lat}`;
      }
      return '';
    }
    const start = getCoord(tourSpots[0]);
    const goal = getCoord(tourSpots[tourSpots.length - 1]);
    let waypoints = '';
    if (tourSpots.length > 2) {
      waypoints = tourSpots.slice(1, tourSpots.length - 1)
        .map(getCoord)
        .join('|');
    }
    // 디버깅: 좌표 및 spot 정보 출력
    console.log('[DirectionsTest] 출발지:', start);
    console.log('[DirectionsTest] 경유지:', waypoints);
    console.log('[DirectionsTest] 도0착지:', goal);
    console.log('[DirectionsTest] 전체 spot:', tourSpots);

    async function fetchDirections() {
      setLoading(true);
      try {
        const url = `http://localhost:4000/directions?start=${start}&goal=${goal}${waypoints ? `&waypoints=${waypoints}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data.route || !data.route.traoptimal || !data.route.traoptimal[0]?.path) {
          console.error('Directions API 오류:', data);
          alert('길찾기 경로를 가져올 수 없습니다. (API 응답 오류)');
          setLoading(false);
          return;
        }
        const coords = data.route.traoptimal[0].path; // [[경도,위도], ...]
        // 지도에 폴리라인 표시
        if (polyline) polyline.setMap(null);
        const pathCoords = coords.map(([lng, lat]) => new window.naver.maps.LatLng(lat, lng));
        const newPolyline = new window.naver.maps.Polyline({
          map: mapInstance,
          path: pathCoords,
          strokeColor: '#2563eb',
          strokeWeight: 5,
          strokeOpacity: 0.8,
          strokeStyle: 'solid'
        });
        setPolyline(newPolyline);
      } catch (err) {
        console.error('Directions API fetch 오류:', err);
        alert('길찾기 경로를 가져올 수 없습니다. (네트워크 오류)');
      }
      setLoading(false);
    }
    fetchDirections();
    // eslint-disable-next-line
  }, [tourSpots, mapInstance]);

  return loading ? (
    <div style={{position:'absolute',top:10,left:10,zIndex:1000,background:'#fff',padding:'8px 16px',borderRadius:8,boxShadow:'0 2px 8px #0002',fontWeight:'bold',color:'#2563eb'}}>
      경로 생성중...
    </div>
  ) : null; // 지도에만 폴리라인 표시
}

export default NaverDirectionsTest;
