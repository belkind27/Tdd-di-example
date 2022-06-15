import { StatusCodes } from "http-status-codes";
import {
  UserNotFoundError,
  PostsNotFoundError,
  errorStatusHandler,
  HttpError,
  InternalServerError,
  InvalidDataError,
} from "../../errors";

describe("#errorStatusHandler", () => {
  it("Resolve NULL as an error with status 500", () => {
    const error = errorStatusHandler(null);

    expect(error).toBeInstanceOf(Error);
    expect((error as HttpError).status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("Resolve Empty Object as an error with status 500", () => {
    const error = errorStatusHandler({});

    expect(error).toBeInstanceOf(Error);
    expect((error as HttpError).status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("Resolve undefined Object as an error with status 500", () => {
    const error = errorStatusHandler(undefined);

    expect(error).toBeInstanceOf(Error);
    expect((error as HttpError).status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("Resolve Error Object as an error with status 500", () => {
    const error = errorStatusHandler(new Error());

    expect(error).toBeInstanceOf(Error);
    expect((error as HttpError).status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("Resolve InternalServerError Object as an error with status 500", () => {
    const error = errorStatusHandler(new InternalServerError(""));

    expect(error).toBeInstanceOf(Error);
    expect((error as HttpError).status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("Resolve DataNotFoundError Object as an error with status 404", () => {
    const error = errorStatusHandler(new UserNotFoundError(""));

    expect(error).toBeInstanceOf(Error);
    expect((error as HttpError).status).toBe(StatusCodes.NOT_FOUND);
  });
  it("Resolve DataNotFoundError Object as an error with status 404", () => {
    const error = errorStatusHandler(new PostsNotFoundError(""));

    expect(error).toBeInstanceOf(Error);
    expect((error as HttpError).status).toBe(StatusCodes.NOT_FOUND);
  });
  it("Resolve InvalidDataError Object as an error with status 400", () => {
    const error = errorStatusHandler(new InvalidDataError(""));

    expect(error).toBeInstanceOf(Error);
    expect((error as HttpError).status).toBe(StatusCodes.BAD_REQUEST);
  });
});
