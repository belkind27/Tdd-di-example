import httpStatus from "http-status-codes";
import { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";
import { errorStatusHandler } from "../models/interfaces/errors/errors";
import { UserDisplay } from "../models/interfaces/userDisplay";
import { Post } from "../models/interfaces/post";
import { PostsManager, Posts_MANAGER_SYMBOL } from "../bl/postsManager/postsManager";

type GetPostsByUserId = RequestHandler<
  { userId: string },
  { user: UserDisplay; posts: Post[] }
>;

@injectable()
export class PostsController {
  public constructor(
    @inject(Posts_MANAGER_SYMBOL) private readonly postsManager: PostsManager
  ) {}
  public getPostsByUserId: GetPostsByUserId = async (req, res, next) => {
    try {
      const data = await this.postsManager.getData(req.params.userId);
      return res.status(httpStatus.OK).json(data);
    } catch (error) {
      const e = errorStatusHandler(error);
      return next(e);
    }
  };
}
