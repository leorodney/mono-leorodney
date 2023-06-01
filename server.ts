import express from "express";
import dotenv from "dotenv";
// Routes
import { authorizationRoute } from './routes/auth';
import { registerRoute } from './routes/register';
import { loginRoute } from './routes/login';
import { logoutRoute } from "./routes/logout";
import { productionRoute } from "./routes/production";
import { promptifyRoute } from "./routes/promptify";
import { promptsRoute, userPromptsRoute } from "./routes/prompts";
import { downloadPromptRoute, likePromptRoute, promptRoute } from "./routes/prompt";
// Micro Database connection
import { mongoConnect } from "./database/connect";
// Configs
import { corsConfig, luscaConfig, limiterConfig, helmetConfig, sessionConfig } from "./configs";
// Middlewares
import { consoleMiddleware } from "./middlewares";
// Types
import { SessionUser } from "./types/user";
// load .env variables
dotenv.config();

declare module "express-session" {
    interface SessionData {
        user: SessionUser;
    }
}

// init the server:
const server = express();

//setup express server Middelwares:
// => security middlewares
server.use(corsConfig); // cors configuration
server.use(limiterConfig); // rate limiter
server.use(helmetConfig) // helmet configuration
// server.use(luscaConfig); // lusca protection configuration
server.use(sessionConfig) // session configuration
// => body parser middlewares
server.use(express.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
server.use(express.json()); // parse application/json
// => custom middlewares
server.use(consoleMiddleware); // console middleware

//init the server:
server.listen(process.env.SERVER_PORT, ()=> console.info(`=> SERVER is live in: http://localhost:${process.env.SERVER_PORT}`));
// MONGODB CONNECTION SETUP
mongoConnect(process.env.MONGODB_URL as string, process.env.MONGODB_DB as string); 

//Routes handellers:
// auth
server.get("/", authorizationRoute);
server.post(["/signin", "/login"], loginRoute);
server.post(["/signup", "/register"], registerRoute);
server.get("/logout", logoutRoute);
// production
server.post("/production", productionRoute);
server.get("/promptify", promptifyRoute);
// prompts
server.get("/prompts", promptsRoute);
server.post("/prompts/new", promptRoute);
server.get("/prompts/mine/:uid", userPromptsRoute);
// prompt likes and downloads
server.post("/prompt/likes", likePromptRoute);
server.post("/prompt/downloads", downloadPromptRoute);
