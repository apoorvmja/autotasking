export type Task = {
  id: string;
  title: string;
  created_at: string | null;
};

export type DailyQuestion = {
  id: number;
  category: string;
  question_title: string;
  question_body: string;
  difficulty: string | null;
  tags: string[] | null;
  country_focus: string | null;
  is_active: boolean | null;
  created_at: string | null;
};

export type University = {
  id: number;
  name: string;
  city: string | null;
  website: string | null;
  known_for: string | null;
  approx_tuition_aed: number | null;
  notes: string | null;
  is_active: boolean | null;
  created_at: string | null;
};

export type Program = {
  id: number;
  university_id: number | null;
  program_name: string;
  level: string | null;
  duration_months: number | null;
  intake_months: string[] | null;
  approx_fee_aed: number | null;
  requirements: string | null;
  is_active: boolean | null;
  created_at: string | null;
};

export type CostItem = {
  id: number;
  item: string;
  min_aed: number | null;
  max_aed: number | null;
  notes: string | null;
  source_hint: string | null;
  is_active: boolean | null;
  created_at: string | null;
};

export type PostQueueStatus = "pending" | "posted" | "skipped";
export type PostQueueContentType = "question" | "university" | "cost";

export type PostQueueItem = {
  id: number;
  post_date: string;
  content_type: PostQueueContentType;
  content_id: number;
  status: PostQueueStatus | null;
  assigned_to: string | null;
  posted_url: string | null;
  posted_at: string | null;
  created_at: string | null;
};

export type PostingDestination = {
  id: string;
  platform: Platform;
  content_type: PostQueueContentType;
  name: string;
  url: string | null;
  created_at: string | null;
};

export type Platform = "Reddit" | "Facebook" | "YouTube" | "Other";
