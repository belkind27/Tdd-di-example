import config from "config";
import { StatusCodes } from "http-status-codes";
import { Logger } from "../../../../../common/logger";
import {
  InternalServerError,
  InvalidDataError,
  PostsNotFoundError,
  UserNotFoundError,
} from "../../../../models/interfaces/errors/errors";
import { UserDisplayRepository } from "../../userDisplayRepository";
import { createFakeUserDisplay } from "../helpers/helpers";

describe("UserDisplayRepository", () => {
  let get: jest.Mock;
  let userDisplayRepository: UserDisplayRepository;
  beforeEach(() => {
    get = jest.fn();
    const logger = new Logger({ isActive: false });
    userDisplayRepository = new UserDisplayRepository(logger, config, { get });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("geUserById", () => {
    describe("happy flow", () => {
      it("should return data", async () => {
        //Input
        const userId = "1";
        //mocks
        const user = createFakeUserDisplay();
        get.mockResolvedValue(user);
        const data = await userDisplayRepository.geUserById(userId);
        expect(data).toEqual(user);
      });
    });
    describe("sad flow", () => {
      it("should throw InternalServerError because error without status", async () => {
        //Input
        const userId = "1";
        //mocks
        get.mockRejectedValue(new Error());
        await expect(async () =>
          userDisplayRepository.geUserById(userId)
        ).rejects.toThrow(InternalServerError);
      });
      it("should throw PostsNotFoundError because error with status 404", async () => {
        //Input
        const userId = "1";
        //mocks
        get.mockRejectedValue(new Error() && { status: StatusCodes.NOT_FOUND });
        await expect(async () =>
          userDisplayRepository.geUserById(userId)
        ).rejects.toThrow(UserNotFoundError);
      });
      it("should throw InvalidDataError because error with status 400", async () => {
        //Input
        const userId = "1";
        //mocks
        get.mockRejectedValue(
          new Error() && { status: StatusCodes.BAD_REQUEST }
        );
        await expect(async () =>
          userDisplayRepository.geUserById(userId)
        ).rejects.toThrow(InvalidDataError);
      });
    });
  });
});
