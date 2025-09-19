// 분류체계 등록 기능
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_DB_URL, SUPABASE_ANON_KEY } from '../db.config.js';

const CLASSIFICATION_API_URL = 'https://apis.data.go.kr/B551011/KorService2/lclsSystmCode2?serviceKey=2fb14dd2acb0254316d5192d49e5cfd398a5e5a9d9cf17e54bbbe9a9099d254f&numOfRows=10000&pageNo=1&MobileOS=ETC&MobileApp=APP&_type=json&lclsSystmListYn=Y';

// 분류코드 insert 함수
export async function fetchAndInsertClassification() {
    const response = await fetch(CLASSIFICATION_API_URL);
    const text = await response.text();
    try {
        const data = JSON.parse(text);
        const items = data.response.body.items?.item || [];
        const supabase = createClient(SUPABASE_DB_URL, SUPABASE_ANON_KEY);
        let seqNo = 1;
        for (const item of items) {
            const { lclsSystm1Cd, lclsSystm1Nm, lclsSystm2Cd , lclsSystm2Nm , lclsSystm3Cd, lclsSystm3Nm  } = item;
            const { data: insertData, error } = await supabase.from('TB_CLASSIFICATION_CODE').insert({
                SEQ_NO: seqNo++,            //순번
                CLASS1_CODE: lclsSystm1Cd,  //대분류코드
                CLASS1_NAME: lclsSystm1Nm,  //대분류명
                CLASS2_CODE: lclsSystm2Cd,  //중분류코드
                CLASS2_NAME: lclsSystm2Nm,  //중분류명
                CLASS3_CODE: lclsSystm3Cd,  //소분류코드
                CLASS3_NAME: lclsSystm3Nm   //소분류명
            });
            if (error) {
                console.error('Insert 실패:', error.message);
            } else {
                console.log('Insert 성공:', insertData);
            }
        }
        console.log('분류코드 데이터:', data);
    } catch (e) {
        console.error('분류코드 파싱 에러:', e);
    }
}
