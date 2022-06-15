import { Router } from "express";
import { FactoryFunction } from "tsyringe";
import { PostsController } from "../controllers/postsController";

const postsRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(PostsController);

  router.get(postsPath.byUserId, controller.getPostsByUserId);
  return router;
};

const POSTS_ROUTER_SYMBOL = Symbol("postsRouterFactory");

const postsPath = {
  baseUrl: "/posts",
  byUserId: "/byUserId/:userId",
};

export { postsRouterFactory, POSTS_ROUTER_SYMBOL, postsPath };
