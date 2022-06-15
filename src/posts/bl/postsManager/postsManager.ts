import { Logger, LOGGER_Symbol } from "../../../common/logger";
import { inject, injectable } from "tsyringe";
import {
  UserDisplayRepository,
  USER_DISPLAY_REPO_Symbol,
} from "../../models/bl/userRepository";
import { Post } from "../../models/interfaces/post";
import { UserDisplay } from "../../models/interfaces/userDisplay";
import {
  PostsRepository,
  POSTS_REPO_Symbol,
} from "../../models/bl/postsRepository";
import { InvalidDataError } from "../../models/interfaces/errors/errors";

export const Posts_MANAGER_SYMBOL = Symbol("PostsManager");

@injectable()
export class PostsManager {
  public constructor(
    @inject(LOGGER_Symbol) private readonly logger: Logger,
    @inject(USER_DISPLAY_REPO_Symbol)
    private readonly userDisplayRepo: UserDisplayRepository,
    @inject(POSTS_REPO_Symbol)
    private readonly postsRepository: PostsRepository
  ) {}
  public async getData(
    userId: string
  ): Promise<{ user: UserDisplay; posts: Post[] }> {
    this.logger.debug(`Start ${this.getData.name} id: ${userId}`);

    const user = await this.userDisplayRepo.geUserById(userId);

    const posts = await this.postsRepository.getPostsByUserId(userId);

    if (!this.validate(posts)) {
      throw new InvalidDataError("posts isnt valid");
    }

    this.logger.debug(`End ${this.getData.name} id: ${userId}`);

    return { user, posts };
  }
  validate(posts: Post[]): boolean {
    return posts.length > 0;
  }
}
