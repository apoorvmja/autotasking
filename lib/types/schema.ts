export type Task = {
  id: string;
  title: string;
  created_at: string | null;
  intern_id?: string | null;
};

export type PostingDestination = {
  id: string;
  platform: Platform;
  name: string;
  url: string | null;
  prompt: string | null;
  created_at: string | null;
};

export type Platform = "Reddit" | "Facebook" | "YouTube" | "Other";

export type Intern = {
  id: string;
  username: string;
  created_at: string | null;
};

export type RedditTaskStatus = {
  destination_id: string;
  completed: boolean;
};

export type YoutubeVideo = {
  id: string;
  destination_id: string;
  title: string;
  description: string;
  file_path: string;
  created_at: string | null;
  download_url?: string | null;
};

export type YoutubeTaskStatus = {
  video_id: string;
  completed: boolean;
};
