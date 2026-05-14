import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  'https://ozisptgftaagdocvzfln.supabase.co'

const supabaseAnonKey =
  'sb_publishable_rR_kd-dAjyAStwQO8-yu1A_C8deumDG'

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  )
