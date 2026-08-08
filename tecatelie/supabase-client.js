// =====================================================
//  Tecateliê — Supabase Client
//  Shared between index.html and admin.html
// =====================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL  = 'https://lsxfmfijwoourcpwlxjf.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_nWn-gcZ5igGwPkTyjeus-Q_qpNz7-nF';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
