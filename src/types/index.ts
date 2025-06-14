export type Post = {
  _id: string;
  title: string;
  content: string;
  image?: string;
  tags?: string[];
  likes?: number;
};