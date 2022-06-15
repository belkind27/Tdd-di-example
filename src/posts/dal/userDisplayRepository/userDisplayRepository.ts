import { Logger, LOGGER_Symbol } from "../../../common/logger";
import { inject, injectable } from "tsyringe";
import { UserDisplayRepository as IUserDisplayRepository } from "../../models/bl/userRepository";
import { RestClient, REST_CLIENT_Symbol } from "../../models/bl/restClient";
import { Config } from "../../../common/intrfaces";
import { CONFIG_Symbol } from "../../../diConfig";
import {
  HttpError,
  InternalServerError,
  InvalidDataError,
  UserNotFoundError,
} from "../../models/interfaces/errors/errors";
import { StatusCodes } from "http-status-codes";
import { UserDisplay } from "../../models/interfaces/userDisplay";

@injectable()
export class UserDisplayRepository implements IUserDisplayRepository {
  constructor(
    @inject(LOGGER_Symbol) private readonly logger: Logger,
    @inject(CONFIG_Symbol) private readonly config: Config,
    @inject(REST_CLIENT_Symbol) private readonly restClient: RestClient
  ) {}
  async geUserById(userId: string): Promise<UserDisplay> {
    try {
      this.logger.debug(`Start ${this.geUserById.name}`);
      const url = `${this.config.get<string>("users.basePath")}/${userId}`;
      const { name, username } = (await this.restClient.get(
        url
      )) as UserDisplay;
      this.logger.debug(
        `End ${this.geUserById.name} data: ${{ name, username }}`
      );
      return { name, username };
    } catch (error) {
      switch ((error as HttpError).status) {
        case StatusCodes.NOT_FOUND:
          throw new UserNotFoundError("");
        case StatusCodes.BAD_REQUEST:
          throw new InvalidDataError("");
        default:
          throw new InternalServerError("");
      }
    }
  }
}
