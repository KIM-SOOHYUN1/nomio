import { useEffect, useRef, useState } from 'react';

// 네이버 지도 API 키를 입력하세요
const NAVER_MAP_CLIENT_ID = '6s5t4ltpe8'; // 실제 발급받은 client id로 교체


function NaverMapWithMarkers({ markers = [] }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstances = useRef([]);
  const infoWindowInstances = useRef([]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    function createMap() {
      if (window.naver && mapRef.current) {
        mapInstance.current = new window.naver.maps.Map(mapRef.current, {
          center: markers[0]
            ? new window.naver.maps.LatLng(markers[0].lat, markers[0].lng)
            : new window.naver.maps.LatLng(37.5665, 126.9780),
          zoom: 12,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.naver.maps.MapTypeControlStyle.BUTTON,
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        });
        updateMarkers();
      }
    }
    if (!window.naver) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`;
      script.async = true;
      script.onload = createMap;
      document.head.appendChild(script);
    } else {
      createMap();
    }
    // eslint-disable-next-line
  }, [mapRef]);

  useEffect(() => {
    if (window.naver && mapInstance.current) {
      updateMarkers();
    }
    // eslint-disable-next-line
  }, [markers]);

  function updateMarkers() {
    markerInstances.current.forEach(m => m.setMap(null));
    markerInstances.current = [];
    infoWindowInstances.current.forEach(iw => iw.close());
    infoWindowInstances.current = [];
    if (!window.naver || !mapInstance.current) return;
    markers.forEach((markerData, idx) => {
      const { lat, lng, label, TITLE, ADDR1, ADDR2, FIRST_IMAGE_URL, SECOND_IMAGE_URL, MODIFIED_DT } = markerData;
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(lat, lng),
        map: mapInstance.current,
        title: label || TITLE || '',
      });
      markerInstances.current.push(marker);

      let MODI_DT = `${MODIFIED_DT.slice(0,4)}.${MODIFIED_DT.slice(4,6)}.${MODIFIED_DT.slice(6,8)} ${MODIFIED_DT.slice(8,10)}:${MODIFIED_DT.slice(10,12)}:${MODIFIED_DT.slice(12,14)}`;

      let imageUrl = '';
      if (SECOND_IMAGE_URL) {
        imageUrl = SECOND_IMAGE_URL;
      } else if (FIRST_IMAGE_URL) {
        imageUrl = FIRST_IMAGE_URL;
      } else {
        imageUrl = 'https://png.pngtree.com/png-clipart/20190925/original/pngtree-no-image-vector-illustration-isolated-png-image_4979075.jpg';
      }

      const infoHtml = `
        <div style="width:250px;max-width:250px;background:#fff;border-radius:18px;box-shadow:0 4px 16px 0 rgba(0,0,0,0.13);overflow:hidden;font-family:'Segoe UI','Apple SD Gothic Neo','Malgun Gothic',sans-serif;">
          <div style='width:100%;height:170px;overflow:hidden;position:relative;background:#f4f5f7;'>
            <img src="${imageUrl}" style="width:100%;object-fit:cover;display:block;" onerror="this.src='${imageUrl}'" />
            <div style="position:absolute;top:10px;right:10px;background:rgba(255,255,255,0.85);padding:3px 10px 3px 10px;border-radius:12px;font-size:0.92em;color:#444;font-weight:500;box-shadow:0 1px 4px 0 rgba(0,0,0,0.06);">최근 수정일: ${MODI_DT}</div>
          </div>
          <div style="padding:16px 16px 12px 16px;">
            <div style="font-weight:700;font-size:1.13em;color:#222;letter-spacing:-0.5px;line-height:1.3;margin-bottom:6px;">${TITLE || label || ''}</div>
            <div style="color:#666;font-size:0.98em;line-height:1.5;word-break:keep-all;">${ADDR1 || ''} ${ADDR2 || ''}</div>
          </div>
        </div>
      `;
      const infoWindow = new window.naver.maps.InfoWindow({
        content: infoHtml,
        maxWidth: 240,
        backgroundColor: '#fff',
        borderColor: '#fbbf24',
        borderWidth: 2,
        anchorSize: new window.naver.maps.Size(20, 20),
        anchorSkew: true,
      });
      marker.addListener('click', () => {
        infoWindowInstances.current.forEach(iw => iw.close());
        infoWindow.open(mapInstance.current, marker);
      });
      infoWindowInstances.current.push(infoWindow);
    });
    window.__naverMapPrevImg = idx => {};
    window.__naverMapNextImg = idx => {};
  }

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}

export default NaverMapWithMarkers;
