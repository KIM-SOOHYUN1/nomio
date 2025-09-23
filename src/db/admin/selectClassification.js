// TB_CLASSIFICATION_CODE 전체 select 함수
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_DB_URL, SUPABASE_ANON_KEY } from '../../db.config.js';

export async function fetchClassification() {
  const supabase = createClient(SUPABASE_DB_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.from('TB_CLASSIFICATION_CODE').select('*');
  if (error) {
    console.error('TB_CLASSIFICATION_CODE 조회 실패:', error.message);
    return [];
  }
  return data || [];
}
