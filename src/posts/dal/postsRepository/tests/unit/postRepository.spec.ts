import config from "config";
import { StatusCodes } from "http-status-codes";
import { Logger } from "../../../../../common/logger";
import {
  InternalServerError,
  InvalidDataError,
  PostsNotFoundError,
} from "../../../../models/interfaces/errors/errors";
import { PostsRepository } from "../../postRepository";
import { createFakePost } from "../helpers/helpers";

describe("PostsRepository", () => {
  let get: jest.Mock;
  let postsRepository: PostsRepository;
  beforeEach(() => {
    get = jest.fn();
    const logger = new Logger({ isActive: false });
    postsRepository = new PostsRepository(logger, config, { get });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("getPostsByUserId", () => {
    describe("happy flow", () => {
      it("should return data", async () => {
        //Input
        const userId = "1";
        //mocks
        const posts = [createFakePost()];
        get.mockResolvedValue(posts);
        const data = await postsRepository.getPostsByUserId(userId);
        expect(data).toEqual(posts);
      });
    });
    describe("sad flow", () => {
      it("should throw InternalServerError because error without status", async () => {
        //Input
        const userId = "1";
        //mocks
        get.mockRejectedValue(new Error());
        await expect(async () =>
          postsRepository.getPostsByUserId(userId)
        ).rejects.toThrow(InternalServerError);
      });
      it("should throw PostsNotFoundError because error with status 404", async () => {
        //Input
        const userId = "1";
        //mocks
        get.mockRejectedValue(new Error() && { status: StatusCodes.NOT_FOUND });
        await expect(async () =>
          postsRepository.getPostsByUserId(userId)
        ).rejects.toThrow(PostsNotFoundError);
      });
      it("should throw InvalidDataError because error with status 400", async () => {
        //Input
        const userId = "1";
        //mocks
        get.mockRejectedValue(
          new Error() && { status: StatusCodes.BAD_REQUEST }
        );
        await expect(async () =>
          postsRepository.getPostsByUserId(userId)
        ).rejects.toThrow(InvalidDataError);
      });
    });
  });
});
