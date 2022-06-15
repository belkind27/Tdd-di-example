import { Post } from "../../../models/interfaces/post";
import { UserDisplay } from "../../../models/interfaces/userDisplay";

export const createFakeUserDisplay = (): UserDisplay => {
  return { name: "stam", username: "stam" };
};

export const createFakePost = (): Post => {
  return {
    userId: 1,
    id: 1,
    title: "stam",
    body: "stam",
  };
};
