// 브라우저 내장 fetch 사용
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_DB_URL, SUPABASE_ANON_KEY } from './db.config.js';

// TB_SIDO와 TB_SIGUNGU를 조인하여 조회하는 함수 (select 전용)
export async function fetchSidoWithSigungu() {
	const supabase = createClient(SUPABASE_DB_URL, SUPABASE_ANON_KEY);
	// 두 테이블을 select 후 JS에서 조인
	const { data: sidoList, error: sidoError } = await supabase.from('TB_SIDO').select('*');
	const { data: sigunguList, error: sigunguError } = await supabase.from('TB_SIGUNGU').select('*');
	if (sidoError) {
		console.error('TB_SIDO 조회 실패:', sidoError.message);
		return;
	}
	if (sigunguError) {
		console.error('TB_SIGUNGU 조회 실패:', sigunguError.message);
		return;
	}
	// JS에서 조인
	const joined = sigunguList.map(sigungu => {
		const sido = sidoList.find(s => s.SIDO_CODE === sigungu.SIDO_CODE);
		return { ...sigungu, SIDO_NAME: sido ? sido.SIDO_NAME : null };
	});
	console.log('조인 결과:', joined);
	return joined;
}

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
		console.log('Insert 시도:', { SIGUNGU_CODE: sigunguCodeNum, SIGUNGU_NAME: name, SIDO_CODE: sidoCodeNum });
		const { data, error } = await supabase.from('TB_SIGUNGU').insert({ SIGUNGU_CODE: sigunguCodeNum, SIGUNGU_NAME: name, SIDO_CODE: sidoCodeNum });
		if (error) {
			console.error('Insert 실패:', error.message);
		} else {
			console.log('Insert 성공:', data);
		}
	}
	console.log('TB_SIGUNGU Insert 완료');
}

