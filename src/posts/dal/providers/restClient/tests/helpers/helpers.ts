import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export const createAxiosError = (
  errMsg?: string,
  code?: string
): AxiosError => {
  if (errMsg === undefined) {
    errMsg = "";
  }
  if (code === undefined) {
    code = StatusCodes.INTERNAL_SERVER_ERROR.toString();
  }
  const err: Partial<AxiosError> = {
    message: errMsg,
    code,
  };
  return err as AxiosError;
};

export const getHttpError = async <TError>(
  call: () => unknown
): Promise<TError> => {
  try {
    await call();
    throw new Error();
  } catch (error) {
    return error as TError;
  }
};