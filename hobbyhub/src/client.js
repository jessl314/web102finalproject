import { createClient } from '@supabase/supabase-js'

const URL = 'https://gdiqufjbyubciacgnhok.supabase.co'

export const supabase = createClient(URL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkaXF1ZmpieXViY2lhY2duaG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzczNTcsImV4cCI6MjA3MDAxMzM1N30.BhVE92NKjKOlKVo6wZMWU5J2S21nEN9zboIwEZRuiN8')