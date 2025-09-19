import { createClient } from '@supabase/supabase-js';
import { SUPABASE_DB_URL, SUPABASE_ANON_KEY } from '../db.config.js';

const CATEGORY_API_URL = 'https://apis.data.go.kr/B551011/KorService2/lclsSystmCode2?serviceKey=2fb14dd2acb0254316d5192d49e5cfd398a5e5a9d9cf17e54bbbe9a9099d254f&numOfRows=10000&pageNo=1&MobileOS=ETC&MobileApp=APP&_type=json&lclsSystmListYn=Y';

// 카테고리 insert 함수
export async function fetchAndInsertCategory() {
    const response = await fetch(CATEGORY_API_URL);
    const text = await response.text();
    try {
        const data = JSON.parse(text);

        const items = data.response.body.items?.item || [];
        
        const supabase = createClient(SUPABASE_DB_URL, SUPABASE_ANON_KEY);
        let seqNo = 1;
        for (const item of items) {
            const { lclsSystm1Cd, lclsSystm1Nm, lclsSystm2Cd , lclsSystm2Nm , lclsSystm3Cd, lclsSystm3Nm  } = item;    
            const { data: insertData, error } = await supabase.from('TB_CATEGORY_CODE').insert({ SEQ_NO: seqNo++, LCLS1_CODE: lclsSystm1Cd, LCLS1_NAME : lclsSystm1Nm, LCLS2_CODE: lclsSystm2Cd, LCLS2_NAME: lclsSystm2Nm, LCLS3_CODE: lclsSystm3Cd, LCLS3_NAME: lclsSystm3Nm });
            if (error) {
                console.error('Insert 실패:', error.message);
            } else {
                console.log('Insert 성공:', insertData);
            }
        }
        console.log('카테고리 데이터:', data);
        // 예시: supabase 연동 등
    } catch (e) {
        console.error('카테고리 파싱 에러:', e);
    }
}