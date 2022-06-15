import { Post } from "../../../../models/interfaces/post";

export const createFakePost = (): Post => {
  return {
    userId: 1,
    id: 1,
    title: "stam",
    body: "stam",
  };
};
