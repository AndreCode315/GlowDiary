import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://zbuvhosvgrxngdhkqfts.supabase.co'
const supabaseKey = 'sb_publishable_MW34HmHO-K-aUrpCqNiblw_qg9LysSF'

export const supabase = createClient(supabaseUrl, supabaseKey);