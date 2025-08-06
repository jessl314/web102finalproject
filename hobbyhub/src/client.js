import { createClient } from '@supabase/supabase-js'

const URL = 'https://gdiqufjbyubciacgnhok.supabase.co'
const API_KEY = import.meta.env.VITE_API_KEY

export const supabase = createClient(URL, API_KEY)