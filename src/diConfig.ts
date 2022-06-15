import config from "config";
import { DependencyContainer, container as defaultContainer } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";
import { InjectionObject } from "./common/intrfaces";
import { Logger, LOGGER_Symbol, LOGGER_OPTIONS } from "./common/logger";
import { PostsController } from "./posts/controllers/postsController";
import { PostsRepository } from "./posts/dal/postsRepository/postRepository";
import { RestClient } from "./posts/dal/providers/restClient/restClient";
import { UserDisplayRepository } from "./posts/dal/userDisplayRepository/userDisplayRepository";
import { POSTS_REPO_Symbol } from "./posts/models/bl/postsRepository";
import { REST_CLIENT_Symbol } from "./posts/models/bl/restClient";
import { USER_DISPLAY_REPO_Symbol } from "./posts/models/bl/userRepository";
import { postsRouterFactory, POSTS_ROUTER_SYMBOL } from "./posts/routers/postsRouter";

export const CONFIG_Symbol = Symbol("CONFIG");

export const dependencies: InjectionObject<unknown>[] = [
  { token: LOGGER_OPTIONS, provider: { useValue: { isActive: true } } },
  { token: LOGGER_Symbol, provider: { useClass: Logger } },
  { token: CONFIG_Symbol, provider: { useValue: config } },
  { token: REST_CLIENT_Symbol, provider: { useClass: RestClient } },
  { token: POSTS_REPO_Symbol, provider: { useClass: PostsRepository } },
  {
    token: USER_DISPLAY_REPO_Symbol,
    provider: { useClass: UserDisplayRepository },
  },
  { token: PostsController, provider: { useClass: PostsController } },
  { token: POSTS_ROUTER_SYMBOL, provider: { useFactory: postsRouterFactory } },
];

export const registerDependencies = (
  dependencies: InjectionObject<unknown>[]
): DependencyContainer => {
  const container = defaultContainer;
  dependencies.forEach((injectionObj) => {
    container.register(
      injectionObj.token,
      injectionObj.provider as constructor<unknown>
    );
  });
  return container;
};
