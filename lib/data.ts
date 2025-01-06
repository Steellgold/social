import { PostProps, UserProps } from "./types";

export const users: UserProps[] = [];
export const posts: PostProps[] = [];

export const findPost = (id: string, posts: PostProps[]): PostProps | undefined => {
  for (const post of posts) {
    if (post.id === id) return post;
    const foundInReplies = findPost(id, post.replies);
    if (foundInReplies) return foundInReplies;
  }
  return undefined;
};