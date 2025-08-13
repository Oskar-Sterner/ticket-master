import { ObjectId } from "mongodb";
import type { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";

import { AppError } from "../utils/errorHandler.js";
import {
  CreateUserRequest,
  LoginRequest,
  UpdateUserRequest,
  User,
  UserWithDetails,
} from "../types";

export class UserService {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  async getAllUsers(): Promise<UserWithDetails[]> {
    try {
      return await this.fastify.mongo.users
        .aggregate<UserWithDetails>([
          { $project: { password: 0 } },
          {
            $lookup: {
              from: "tickets",
              localField: "_id",
              foreignField: "userId",
              as: "tickets",
            },
          },
          {
            $lookup: {
              from: "projects",
              localField: "tickets.projectId",
              foreignField: "_id",
              as: "projects",
            },
          },
          {
            $addFields: {
              projects: {
                $reduce: {
                  input: "$projects",
                  initialValue: [],
                  in: {
                    $cond: [
                      { $in: ["$$this", "$$value"] },
                      "$$value",
                      { $concatArrays: ["$$value", ["$$this"]] },
                    ],
                  },
                },
              },
            },
          },
        ])
        .toArray();
    } catch (error) {
      throw new AppError("Failed to fetch users", 500);
    }
  }

  async getUserById(id: string): Promise<UserWithDetails> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new AppError("Invalid user ID", 400);
      }

      const userWithDetails = await this.fastify.mongo.users
        .aggregate<UserWithDetails>([
          { $match: { _id: new ObjectId(id) } },
          { $project: { password: 0 } },
          {
            $lookup: {
              from: "tickets",
              localField: "_id",
              foreignField: "userId",
              as: "tickets",
            },
          },
          {
            $lookup: {
              from: "projects",
              localField: "tickets.projectId",
              foreignField: "_id",
              as: "projects",
            },
          },
          {
            $addFields: {
              projects: {
                $reduce: {
                  input: "$projects",
                  initialValue: [],
                  in: {
                    $cond: [
                      { $in: ["$$this", "$$value"] },
                      "$$value",
                      { $concatArrays: ["$$value", ["$$this"]] },
                    ],
                  },
                },
              },
            },
          },
        ])
        .next();

      if (!userWithDetails) {
        throw new AppError("User not found", 404);
      }

      return userWithDetails;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to fetch user details", 500);
    }
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    try {
      const { name, email, password } = data;

      if (!name || !email || !password) {
        throw new AppError("Name, email, and password are required", 400);
      }

      const existingUser = await this.fastify.mongo.users.findOne({ email });
      if (existingUser) {
        throw new AppError("User with this email already exists", 409);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user: Omit<User, "_id"> = {
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await this.fastify.mongo.users.insertOne(user);
      const createdUser = await this.fastify.mongo.users.findOne(
        { _id: result.insertedId },
        { projection: { password: 0 } }
      );

      if (!createdUser) {
        throw new AppError("Failed to retrieve created user", 500);
      }

      return createdUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to create user", 500);
    }
  }

  async findUserByCredentials(
    credentials: LoginRequest
  ): Promise<Omit<User, "password"> & { _id: ObjectId }> {
    const { email, password } = credentials;
    const user = await this.fastify.mongo.users.findOne({ email });

    if (!user || !user.password) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new AppError("Invalid user ID", 400);
      }

      if (Object.keys(data).length === 0) {
        throw new AppError(
          "At least one field must be provided for update",
          400
        );
      }

      const updateFields: Partial<User> = {
        ...data,
        updatedAt: new Date(),
      };

      const result = await this.fastify.mongo.users.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateFields },
        { returnDocument: "after", projection: { password: 0 } }
      );

      if (!result) {
        throw new AppError("User not found", 404);
      }

      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to update user", 500);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new AppError("Invalid user ID", 400);
      }

      const result = await this.fastify.mongo.users.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        throw new AppError("User not found", 404);
      }

      await this.fastify.mongo.tickets.updateMany(
        { userId: new ObjectId(id) },
        { $unset: { userId: "" } }
      );
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to delete user", 500);
    }
  }
}
