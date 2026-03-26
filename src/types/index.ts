export interface User {
  id: string
  email: string
  display_name: string
  subscription_status: 'active' | 'inactive' | 'lapsed'
  plan: 'monthly' | 'yearly'
  charity_id?: string
  charity_percentage: number // 10-100
  total_winnings: number
}

export interface Score {
  id: string
  user_id: string
  score: number // 1-45 Stableford
  date: string
  created_at: string
}

export interface Charity {
  id: string
  name: string
  description: string
  image_url: string
  is_featured: boolean
  website_url?: string
}

export interface Draw {
  id: string
  month: string
  year: number
  status: 'simulated' | 'published'
  logic: 'random' | 'algorithmic'
  jackpot_pool: number
  payout_4_match: number
  payout_3_match: number
}

export interface Winner {
  id: string
  draw_id: string
  user_id: string
  match_type: 3 | 4 | 5
  prize_amount: number
  verification_status: 'pending' | 'approved' | 'rejected' | 'paid'
  proof_url?: string
}
