// TB_SIDO와 TB_SIGUNGU를 조인하여 조회하는 함수 (select 전용)
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_DB_URL, SUPABASE_ANON_KEY } from '../db.config.js';

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
