import { Logger, LOGGER_Symbol } from "../../../common/logger";
import { inject, injectable } from "tsyringe";
import { PostsRepository as IPostsRepository } from "../../models/bl/postsRepository";
import { Post } from "../../models/interfaces/post";
import { RestClient, REST_CLIENT_Symbol } from "../../models/bl/restClient";
import { Config } from "../../../common/intrfaces";
import { CONFIG_Symbol } from "../../../diConfig";
import {
  HttpError,
  InternalServerError,
  InvalidDataError,
  PostsNotFoundError,
} from "../../models/interfaces/errors/errors";
import { StatusCodes } from "http-status-codes";

@injectable()
export class PostsRepository implements IPostsRepository {
  constructor(
    @inject(LOGGER_Symbol) private readonly logger: Logger,
    @inject(CONFIG_Symbol) private readonly config: Config,
    @inject(REST_CLIENT_Symbol) private readonly restClient: RestClient
  ) {}

  async getPostsByUserId(userId: string): Promise<Post[]> {
    try {
      this.logger.debug(`Start ${this.getPostsByUserId.name}`);
      const url = `${this.config.get<string>("posts.basePath")}/${userId}/posts`;
      const res = await this.restClient.get<Post[]>(url);
      this.logger.debug(`End ${this.getPostsByUserId.name} data: ${res}`);
      return res;
    } catch (error) {
      switch ((error as HttpError).status) {
        case StatusCodes.NOT_FOUND:
          throw new PostsNotFoundError("");
        case StatusCodes.BAD_REQUEST:
          throw new InvalidDataError("");
        default:
          throw new InternalServerError("");
      }
    }
  }
}
