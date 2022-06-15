import { IConfig } from "config";
import express, { Router } from "express";
import { Logger, LOGGER_Symbol } from "./common/logger";
import { registerDependencies, dependencies, CONFIG_Symbol } from "./diConfig";
import { postsPath, POSTS_ROUTER_SYMBOL } from "./posts/routers/postsRouter";

const app = express();
const container = registerDependencies(dependencies);

const config = container.resolve(CONFIG_Symbol) as IConfig;

const logger = container.resolve(LOGGER_Symbol) as Logger;

const postRouter = container.resolve(POSTS_ROUTER_SYMBOL) as Router;

app.use(postsPath.baseUrl, postRouter);

const port = config.get<number>("port");

app.listen(port, () => {
  logger.debug(`app is up on port ${port}`);
});
