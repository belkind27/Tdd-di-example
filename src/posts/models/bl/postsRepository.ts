import { Post } from "../interfaces/post";

export const POSTS_REPO_Symbol = Symbol("PostsRepository");

export interface PostsRepository {
  getPostsByUserId: (userId: string) => Promise<Post[]>;
}
