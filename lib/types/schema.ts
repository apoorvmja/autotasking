export type Task = {
  id: string;
  title: string;
  created_at: string | null;
};

export type PostingDestination = {
  id: string;
  platform: Platform;
  name: string;
  url: string | null;
  created_at: string | null;
};

export type Platform = "Reddit" | "Facebook" | "YouTube" | "Other";
