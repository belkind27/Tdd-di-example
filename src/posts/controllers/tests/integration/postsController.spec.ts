import config from "config";
import { NextFunction, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { Logger } from "../../../../common/logger";
import { PostsManager } from "../../../bl/postsManager/postsManager";
import { PostsRepository } from "../../../dal/postsRepository/postRepository";
import { UserDisplayRepository } from "../../../dal/userDisplayRepository/userDisplayRepository";
import { Post } from "../../../models/interfaces/post";
import { UserDisplay } from "../../../models/interfaces/userDisplay";
import { PostsController } from "../../postsController";
import { createFakePost, createFakeUserDisplay } from "../helpers/helpers";

describe("PostsController", () => {
  let postsController: PostsController;
  let get: jest.Mock;
  //http
  let req: Partial<Request<unknown, unknown>>;
  let resStatus: Partial<Response>;
  let resJson: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    get = jest.fn();
    req = {};
    next = jest.fn() as jest.Mock<NextFunction>;
    resJson = {
      json: jest.fn(),
    };
    resStatus = {
      status: jest.fn(() => {
        return resJson as Response;
      }) as any,
      json: jest.fn(),
    };
    const logger = new Logger({ isActive: false });
    const userRepo = new UserDisplayRepository(logger, config, { get });
    const postRepo = new PostsRepository(logger, config, { get });
    const postManager = new PostsManager(logger, userRepo, postRepo);
    const postsController = new PostsController(postManager);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("#getPostsByUserId", () => {
    describe("Happy flow path", () => {
      it("Should return data", async () => {
        //Input
        const userId = "1";
        //mocks
        const posts = [createFakePost()];
        const user = createFakeUserDisplay();
        const data = { posts, user };
        let index = 1;
        get.mockImplementation();
        req.params = { userId };

        await postsController.getPostsByUserId(
          req as Request<
            { userId: string },
            { user: UserDisplay; posts: Post[] }
          >,
          resStatus as unknown as Response,
          next
        );
        expect(resStatus.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(resJson.json).toHaveBeenCalledWith(data);
      });
    });
    describe("Sad flow path", () => {
      it("Should throw RunMetadataNotFound with 404 because res return undefined", async () => {
        //Inputs
        const status = createFakeStatus();
        req.params = { runMetaDataId: status.runId };

        //Mocks
        const statuesCode = StatusCodes.NOT_FOUND;
        query.mockResolvedValue(undefined);

        await statusController.getRunMetadataStateById(
          req as Request<{ runMetaDataId: string }, IStatus>,
          resStatus as Response,
          next
        );
        expect(resStatus.status).not.toHaveBeenCalled();
        expect(resJson.json).not.toHaveBeenCalled();
        const resultedError = (next.mock.calls[0] as unknown[])[0];
        expect(resultedError).toBeInstanceOf(RunMetadataNotFound);
        expect((resultedError as HttpError).status).toEqual(statuesCode);
      });
      it("Should throw RunMetadataNotFound with 404 because res return null", async () => {
        //Inputs
        const status = createFakeStatus();
        req.params = { runMetaDataId: status.runId };

        //Mocks
        const statuesCode = StatusCodes.NOT_FOUND;
        query.mockResolvedValue(null);

        await statusController.getRunMetadataStateById(
          req as Request<{ runMetaDataId: string }, IStatus>,
          resStatus as Response,
          next
        );
        expect(resStatus.status).not.toHaveBeenCalled();
        expect(resJson.json).not.toHaveBeenCalled();
        const resultedError = (next.mock.calls[0] as unknown[])[0];
        expect(resultedError).toBeInstanceOf(RunMetadataNotFound);
        expect((resultedError as HttpError).status).toEqual(statuesCode);
      });
    });
  });
});
