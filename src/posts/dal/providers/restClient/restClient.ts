import { Logger, LOGGER_Symbol } from "../../../../common/logger";
import { inject, injectable } from "tsyringe";
import { RestClient as IRestClient } from "../../../models/bl/restClient";
import axios, { AxiosError, AxiosResponse } from "axios";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../../models/interfaces/errors/errors";

@injectable()
export class RestClient implements IRestClient {
  constructor(@inject(LOGGER_Symbol) private readonly logger: Logger) {}
  async get<T>(url: string): Promise<T> {
    try {
      this.logger.debug(`Start ${this.get.name}`);
      let res: AxiosResponse;
      res = await axios.get(url);

      this.logger.debug(
        `name: ${this.get.name}  result: ${JSON.stringify(res)}`
      );
      this.logger.debug(`End ${this.get.name}`);
      return this.validateResponse<T>(res);
    } catch (err) {
      const error = err as AxiosError;
      this.handleHttpError(error, this.get.name);
    }
  }

  private validateResponse<T>(res: AxiosResponse): T {
    const minStatusRange = 200;
    const maxStatusRange = 300;
    if (res.status >= minStatusRange && res.status < maxStatusRange) {
      return res.data as T;
    } else {
      const error = new Error(
        `status code received: ${
          res.status
        } is not in the expected status code range 2xx\n data received: ${JSON.stringify(
          res.data
        )}`
      );
      (error as AxiosError).code = res.status.toString();
      throw error;
    }
  }

  private handleHttpError(error: AxiosError, name: string): never {
    let statusCode: number;
    if (error.code !== undefined) {
      statusCode = parseInt(error.code);
    } else {
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
    this.logger.error(`${name} response data ${error.message}`);
    throw new HttpError(
      `Something happened in setting up the request that trigger an Error ${error.message}`,
      statusCode,
      error.stack
    );
  }
}
