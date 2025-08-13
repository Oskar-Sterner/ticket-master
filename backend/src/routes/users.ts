import type { FastifyInstance } from "fastify";

import { UserController } from "../controllers/userController.js";
import { CreateUserRequest, LoginRequest, UpdateUserRequest } from "../types";

export async function userRoutes(fastify: FastifyInstance) {
  const userController = new UserController(fastify);

  fastify.post<{ Body: CreateUserRequest }>(
    "/register",
    userController.registerUser.bind(userController)
  );

  fastify.post<{ Body: LoginRequest }>(
    "/login",
    userController.loginUser.bind(userController)
  );

  fastify.get(
    "/me",
    { onRequest: [fastify.authenticate] },
    userController.getMe.bind(userController)
  );

  fastify.get("/users", userController.getAllUsers.bind(userController));

  fastify.get<{ Params: { id: string } }>(
    "/users/:id",
    userController.getUserById.bind(userController)
  );

  fastify.put<{ Params: { id: string }; Body: UpdateUserRequest }>(
    "/users/:id",
    { onRequest: [fastify.authenticate] },
    userController.updateUser.bind(userController)
  );

  fastify.delete<{ Params: { id: string } }>(
    "/users/:id",
    { onRequest: [fastify.authenticate] },
    userController.deleteUser.bind(userController)
  );
}
