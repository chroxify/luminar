export interface Changelog {
  id: string;
  author_id: string;
  workspace_id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  image: string | null;
  publish_date: string | null;
  published: boolean;
}

export type ChangelogsResponse =
  | {
      data: {
        changelogs: Changelog[];
      };
      error: null;
    }
  | {
      data: {
        changelogs: null;
      };
      error: Error;
    };
