// TB_SERVICE_CLASSIFICATION 전체 select 함수
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_DB_URL, SUPABASE_ANON_KEY } from '../../db.config.js';

export async function fetchServiceClassification() {
  const supabase = createClient(SUPABASE_DB_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.from('TB_SERVICE_CLASSIFICATION').select('*');
  if (error) {
    console.error('TB_SERVICE_CLASSIFICATION 조회 실패:', error.message);
    return [];
  }
  return data || [];
}
