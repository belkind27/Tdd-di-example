import { Logger } from "../../../../../common/logger";
import { InvalidDataError } from "../../../../models/interfaces/errors/errors";
import { Post } from "../../../../models/interfaces/post";
import { PostsManager } from "../../postsManager";
import { createFakePost, createFakeUserDisplay } from "../helpers/helpers";

describe("PostsManager", () => {
  let getPostsByUserId: jest.Mock;
  let geUserById: jest.Mock;
  let postsManager: PostsManager;
  beforeEach(() => {
    getPostsByUserId = jest.fn();
    geUserById = jest.fn();
    const logger = new Logger({ isActive: false });
    postsManager = new PostsManager(
      logger,
      { geUserById },
      { getPostsByUserId }
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("getData", () => {
    describe("happy flow", () => {
      it("should return data", async () => {
        //Input
        const userId = "1";
        //mocks
        const posts = [createFakePost()];
        const user = createFakeUserDisplay();
        getPostsByUserId.mockResolvedValue(posts);
        geUserById.mockResolvedValue(user);

        const data = await postsManager.getData(userId);
        expect(data).toEqual({ posts, user });
      });
    });
    describe("sad flow", () => {
      it("should throw InvalidDataError because of failed validation", async () => {
        //Input
        const userId = "1";
        //mocks
        const posts = [] as Post[];
        const user = createFakeUserDisplay();
        getPostsByUserId.mockResolvedValue(posts);
        geUserById.mockResolvedValue(user);

        await expect(async () => postsManager.getData(userId)).rejects.toThrow(
          InvalidDataError
        );
      });
    });
  });
});
