// 브라우저 내장 fetch 사용
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_DB_URL, SUPABASE_ANON_KEY } from '../db.config.js';

const SIGUNGU_API_URL = 'https://apis.data.go.kr/B551011/KorService2/ldongCode2?serviceKey=2fb14dd2acb0254316d5192d49e5cfd398a5e5a9d9cf17e54bbbe9a9099d254f&numOfRows=1000&MobileOS=ETC&MobileApp=APP&lDongListYn=Y';

export async function fetchAndInsertTbSigungu() {
	const response = await fetch(SIGUNGU_API_URL);
	const text = await response.text();
	let items = [];
	try {
		const data = JSON.parse(text);
		if (data.response?.body?.items?.item) {
			items = data.response.body.items.item;
			if (!Array.isArray(items)) items = [items];
		}
	} catch {
		const { XMLParser } = await import('fast-xml-parser');
		const parser = new XMLParser();
		const data = parser.parse(text);
		if (data.response?.body?.items?.item) {
			items = data.response.body.items.item;
			if (!Array.isArray(items)) items = [items];
		}
	}

	// 중복체크 없이 모든 item을 insert
	const supabase = createClient(SUPABASE_DB_URL, SUPABASE_ANON_KEY);
	for (const item of items) {
		const code = item.lDongSignguCd;
		const name = item.lDongSignguNm;
		const sidoCode = item.lDongRegnCd;
		if (!code || !name || !sidoCode) continue;
		const sigunguCodeNum = Number(code);
		const sidoCodeNum = Number(sidoCode);
		if (isNaN(sigunguCodeNum) || isNaN(sidoCodeNum)) {
			console.error('숫자 변환 실패:', { code, sidoCode });
			continue;
		}
		console.log('Insert 시도:', { 
            SIGUNGU_CODE: sigunguCodeNum,   //시군구코드
            SIGUNGU_NAME: name,             //시군구명
            SIDO_CODE: sidoCodeNum          //시도코드
        });
		const { data, error } = await supabase.from('TB_SIGUNGU').insert({ SIGUNGU_CODE: sigunguCodeNum, SIGUNGU_NAME: name, SIDO_CODE: sidoCodeNum });
		if (error) {
			console.error('Insert 실패:', error.message);
		} else {
			console.log('Insert 성공:', data);
		}
	}
	console.log('TB_SIGUNGU Insert 완료');
}
