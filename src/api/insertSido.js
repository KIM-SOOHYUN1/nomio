// 시도 등록 기능 
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_DB_URL, SUPABASE_ANON_KEY } from '../db.config.js';

const SIDO_API_URL = 'https://apis.data.go.kr/B551011/KorService2/ldongCode2?serviceKey=2fb14dd2acb0254316d5192d49e5cfd398a5e5a9d9cf17e54bbbe9a9099d254f&numOfRows=1000&MobileOS=ETC&MobileApp=APP&lDongListYn=Y';

export async function fetchAndInsertSido() {
  const response = await fetch(SIDO_API_URL);
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

  // 시도만 추출 (법정동코드 앞 2자리, 중복제거)
  const sidoSet = new Map();
  for (const item of items) {
    const code = item.code;
    const name = item.name;
    if (!code || !name) continue;
    const sidoCode = code.substring(0, 2);
    if (!sidoSet.has(sidoCode)) {
      sidoSet.set(sidoCode, name.split(' ')[0]); // ex: '서울특별시', '경기도' 등
    }
  }

  const supabase = createClient(SUPABASE_DB_URL, SUPABASE_ANON_KEY);
  for (const [sidoCode, sidoName] of sidoSet.entries()) {
    const { data, error } = await supabase.from('SIDO_CODE').insert({ 
        sido_code: sidoCode,    //시도코드
        sido_name: sidoName     //시도명
    });
    if (error) {
      console.error('Insert 실패:', error.message);
    } else {
      console.log('Insert 성공:', data);
    }
  }
  console.log('시도 Insert 완료');
}
