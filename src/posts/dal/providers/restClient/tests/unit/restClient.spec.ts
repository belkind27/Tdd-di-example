import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { Logger } from "../../../../../../common/logger";
import { HttpError } from "../../../../../models/interfaces/errors/errors";
import { RestClient } from "../../restClient";
import { createAxiosError, getHttpError } from "../helpers/helpers";

let restAPI: RestClient;
jest.mock("axios");

describe("RestClient", () => {
  beforeEach(() => {
    restAPI = new RestClient(new Logger({ isActive: false }));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("#get", () => {
    describe("happy flow", () => {
      it("Resolve without errors", async () => {
        const api = "localhost:8080";
        const id = "1";
        const result = { data: "result", status: StatusCodes.OK };
        (axios.get as jest.Mock).mockResolvedValue(result);
        let res = await restAPI.get(api);
        expect(axios.get).toHaveBeenCalledWith(api);
        expect(res).toEqual(result.data);
      });
    });

    describe("sad flow", () => {
      const api = "localhost:8080";
      const errorMsg = "error";
      it("Throw http error when axios error", async () => {
        const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        (axios.get as jest.Mock).mockRejectedValue(createAxiosError(errorMsg));
        const error = await getHttpError<HttpError>(async () =>
          restAPI.get(api)
        );
        expect(error).toBeInstanceOf(HttpError);
        expect(error.status).toEqual(statusCode);
      });
      it("Throw http error when error", async () => {
        const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        (axios.get as jest.Mock).mockRejectedValue(new Error());
        const error = await getHttpError<HttpError>(async () =>
          restAPI.get(api)
        );
        expect(error).toBeInstanceOf(HttpError);
        expect(error.status).toEqual(statusCode);
      });
      it("Throw http error when response status is not in 2xx range", async () => {
        const status = StatusCodes.PERMANENT_REDIRECT;
        (axios.get as jest.Mock).mockResolvedValue({ status });
        const error = await getHttpError<HttpError>(async () =>
          restAPI.get(api)
        );
        expect(error).toBeInstanceOf(HttpError);
        expect(error.status).toEqual(status);
      });
    });
  });
});
