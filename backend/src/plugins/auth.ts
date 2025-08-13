import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { _id: string; email: string };
    user: {
      _id: string;
      email: string;
    };
  }
}

async function authPlugin(fastify: FastifyInstance) {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET as string,
  });

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      await request.jwtVerify();
    }
  );
}

export default fp(authPlugin);
