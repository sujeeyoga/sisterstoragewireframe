export interface LaunchCard {
  id: string;
  collection_name: string;
  tagline?: string;
  description: string;
  launch_date?: string;
  status: 'upcoming' | 'live' | 'archived';
  waitlist_link: string;
  preview_link?: string;
  cta_label: string;
  gradient_c1: string;
  gradient_c2: string;
  gradient_c3: string;
  shimmer_speed: number;
  blur_level: number;
  priority: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}
