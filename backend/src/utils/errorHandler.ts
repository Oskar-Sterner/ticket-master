import type {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  FastifyError,
} from "fastify";
import fp from "fastify-plugin";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

async function errorHandler(fastify: FastifyInstance) {
  fastify.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(404).send({
      error: "Not Found",
      message: `Route ${request.method}:${request.url} not found`,
      statusCode: 404,
    });
  });

  fastify.setErrorHandler(
    (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      fastify.log.error({
        error: error.message,
        stack: error.stack,
        url: request.url,
        method: request.method,
        params: request.params,
        query: request.query,
      });

      if (error.statusCode === 401) {
        return reply.status(401).send({
          error: "Unauthorized",
          message: "Authentication is required to access this resource.",
          statusCode: 401,
        });
      }

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          error: "Application Error",
          message: error.message,
          statusCode: error.statusCode,
        });
      }

      if (error.validation) {
        return reply.status(400).send({
          error: "Validation Error",
          message: error.message,
          statusCode: 400,
        });
      }

      if (
        error.name === "MongoServerError" &&
        "code" in error &&
        (error as unknown as { code: number }).code === 11000
      ) {
        return reply.status(409).send({
          error: "Duplicate Entry",
          message: "Resource already exists",
          statusCode: 409,
        });
      }

      return reply.status(500).send({
        error: "Internal Server Error",
        message: "Something went wrong",
        statusCode: 500,
      });
    }
  );
}

export default fp(errorHandler);
