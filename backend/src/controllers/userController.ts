import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

import { UserService } from "../services/userService.js";
import {
  CreateUserRequest,
  LoginRequest,
  UpdateUserRequest,
} from "../types/index.js";

export class UserController {
  private userService: UserService;

  constructor(fastify: FastifyInstance) {
    this.userService = new UserService(fastify);
  }

  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.userService.getAllUsers();
    return reply.send(users);
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const user = await this.userService.getUserById(request.user._id);
    return reply.send(user);
  }

  async getUserById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const user = await this.userService.getUserById(id);
    return reply.send(user);
  }

  async registerUser(
    request: FastifyRequest<{ Body: CreateUserRequest }>,
    reply: FastifyReply
  ) {
    const user = await this.userService.createUser(request.body);
    return reply.status(201).send(user);
  }

  async loginUser(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
  ) {
    const user = await this.userService.findUserByCredentials(request.body);
    const token = request.server.jwt.sign({
      _id: user._id.toHexString(),
      email: user.email,
    });
    return reply.send({ token });
  }

  async updateUser(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateUserRequest;
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const user = await this.userService.updateUser(id, request.body);
    return reply.send(user);
  }

  async deleteUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    await this.userService.deleteUser(id);
    return reply.status(204).send();
  }
}
