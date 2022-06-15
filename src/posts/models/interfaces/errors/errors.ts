import { StatusCodes } from "http-status-codes";

export class InternalServerError extends Error {
  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class InvalidDataError extends Error {
  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidDataError.prototype);
  }
}

export class PostsNotFoundError extends Error {
  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, PostsNotFoundError.prototype);
  }
}

export class UserNotFoundError extends Error {
  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

export class HttpError extends Error {
  public status: number;
  /* istanbul ignore next */
  public constructor(message: string, code: number, stack?: string) {
    super(message);
    this.status = code;
    this.stack = stack;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export const errorStatusHandler = (error: unknown): Error | unknown => {
  if (!(error instanceof Error)) {
    error = new InternalServerError(
      "Something went wrong please contact your admin"
    );
    (error as HttpError).status = StatusCodes.INTERNAL_SERVER_ERROR;
  } else {
    switch (error.constructor) {
      case PostsNotFoundError:
        (error as HttpError).status = StatusCodes.NOT_FOUND;
        break;
      case UserNotFoundError:
        (error as HttpError).status = StatusCodes.NOT_FOUND;
        break;
      case InvalidDataError:
        (error as HttpError).status = StatusCodes.BAD_REQUEST;
        break;
      case InternalServerError:
      default:
        (error as HttpError).status = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
  }

  return error;
};
