import dotenv from "dotenv";
dotenv.config();

import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import dbConnector from "./config/database.js";
import { initializeDatabase } from "./config/dbInit.js";
import errorHandler from "./utils/errorHandler.js";
import rateLimiter from "./middleware/rateLimiter.js";
import authPlugin from "./plugins/auth.js";
import { projectRoutes } from "./routes/projects.js";
import { ticketRoutes } from "./routes/tickets.js";
import { userRoutes } from "./routes/users.js";
import { FastifyInstance } from "fastify";
import Fastify from "fastify";

const fastify: FastifyInstance = Fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

async function buildServer(): Promise<FastifyInstance> {
  try {
    console.log("Starting server build...");

    await fastify.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    });

    await fastify.register(cors, {
      origin:
        process.env.NODE_ENV === "production"
          ? "YOUR_PRODUCTION_URL"
          : "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    });

    await fastify.register(authPlugin);

    await fastify.register(dbConnector);
    await initializeDatabase(fastify);
    await fastify.register(rateLimiter);
    await fastify.register(errorHandler);

    await fastify.register(async function (fastify) {
      await fastify.register(projectRoutes, { prefix: "/api" });
      await fastify.register(ticketRoutes, { prefix: "/api" });
      await fastify.register(userRoutes, { prefix: "/api" });
    });

    fastify.get("/health", async (request, reply) => {
      return { status: "ok", timestamp: new Date().toISOString() };
    });

    return fastify;
  } catch (error) {
    console.error("Server build failed:", error);
    fastify.log.error(error);
    process.exit(1);
  }
}

async function start() {
  try {
    console.log("Starting application...");
    const server = await buildServer();
    const port = Number(process.env.PORT) || 3001;
    const host = process.env.HOST || "0.0.0.0";

    await server.listen({ port, host });
    server.log.info(`Server listening on ${host}:${port}`);
  } catch (error) {
    console.error("Start failed:", error);
    fastify.log.error(error);
    process.exit(1);
  }
}

start();

export { buildServer };
