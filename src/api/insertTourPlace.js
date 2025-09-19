import { createClient } from '@supabase/supabase-js';
import { SUPABASE_DB_URL, SUPABASE_ANON_KEY } from '../db.config.js';

const SIGUNGU_API_URL = 'http://apis.data.go.kr/B551011/KorService2/areaBasedList2?numOfRows=50322&pageNo=1&MobileOS=ETC&MobileApp=AppTest&ServiceKey=2fb14dd2acb0254316d5192d49e5cfd398a5e5a9d9cf17e54bbbe9a9099d254f&arrange=A&contentTypeId=&areaCode=&sigunguCode=&cat1=&cat2=&cat3=';

export async function insertTourPlace() {
    const supabase = createClient(SUPABASE_DB_URL, SUPABASE_ANON_KEY);      

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
    console.log('총 아이템 수:', items.length);
    for (const item of items) {
        // 컬럼 매핑은 직접 작성
        const insertData = {
            ADDR1: item.addr1,
            ADDR2: item.addr2,
            AREA_CODE: item.areacode,
            CATEGORY_L_CODE: item.cat1,
            CATEGORY_M_CODE: item.cat2,
            CATEGORY_S_CODE: item.cat3,
            CONTENT_ID: item.contentid,
            CONTENT_TYPE_ID: item.contenttypeid,
            CREATED_DT: item.createdtime,
            FIRST_IMAGE_URL: item.firstimage,
            SECOND_IMAGE_URL: item.firstimage2,
            CPYRHT_DIV_CODE: item.cpyrhtDivCd,
            MAP_X: item.mapx,
            MAP_Y: item.mapy,
            MAP_LEVEL: item.mlevel,
            MODIFIED_DT: item.modifiedtime,
            SIGUNGU_CODE: item.sigungucode,
            TEL_NO: item.tel,
            TITLE: item.title,
            ZIP_CODE: item.zipcode,
            LDONG_REGN_CODE: item.lDongRegnCd,
            LDONG_SIGUNGU_CODE: item.lDongSignguCd,
            LCLS1_CODE: item.lclsSystm1,
            LCLS2_CODE: item.lclsSystm2,
            LCLS3_CODE: item.lclsSystm3
        };
        const { data, error } = await supabase.from('TB_REGION_TOURISM_SPOT').insert([insertData]);
        if (error) {
            console.error('Insert error:', error);
        } else {
            console.log('Insert result:', data);
        }
    }
}