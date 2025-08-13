import { ObjectId, UpdateFilter } from "mongodb";
import type { FastifyInstance } from "fastify";

import { AppError } from "../utils/errorHandler.js";
import {
  TicketWithUser,
  CreateTicketRequest,
  Ticket,
  UpdateTicketRequest,
} from "../types/index.js";

export class TicketService {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  async getAllTickets(): Promise<TicketWithUser[]> {
    try {
      const tickets = await this.fastify.mongo.tickets
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .toArray();
      return tickets as TicketWithUser[];
    } catch (error) {
      throw new AppError("Failed to fetch tickets", 500);
    }
  }

  async getTicketById(id: string): Promise<TicketWithUser> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new AppError("Invalid ticket ID", 400);
      }

      const ticket = await this.fastify.mongo.tickets
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .next();

      if (!ticket) {
        throw new AppError("Ticket not found", 404);
      }

      return ticket as TicketWithUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to fetch ticket", 500);
    }
  }

  async getTicketsByProjectId(projectId: string): Promise<TicketWithUser[]> {
    try {
      if (!ObjectId.isValid(projectId)) {
        throw new AppError("Invalid project ID", 400);
      }

      const tickets = await this.fastify.mongo.tickets
        .aggregate([
          { $match: { projectId: new ObjectId(projectId) } },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .toArray();

      return tickets as TicketWithUser[];
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to fetch project tickets", 500);
    }
  }

  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    try {
      const { title, description, priority, userId, projectId } = data;

      if (!title || !description || !priority || !projectId) {
        throw new AppError("Required fields are missing", 400);
      }

      if (!ObjectId.isValid(projectId)) {
        throw new AppError("Invalid project ID", 400);
      }
      if (userId && !ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
      }

      const validPriorities = ["low", "medium", "high", "critical"];
      if (!validPriorities.includes(priority)) {
        throw new AppError("Invalid priority level", 400);
      }

      const project = await this.fastify.mongo.projects.findOne({
        _id: new ObjectId(projectId),
      });
      if (!project) {
        throw new AppError("Project not found", 404);
      }

      if (userId) {
        const user = await this.fastify.mongo.users.findOne({
          _id: new ObjectId(userId),
        });
        if (!user) {
          throw new AppError("Assignee user not found", 404);
        }
      }

      const ticket: Omit<Ticket, "_id"> = {
        title,
        description,
        priority,
        projectId: new ObjectId(projectId),
        status: "open",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (userId) {
        ticket.userId = new ObjectId(userId);
      }

      const result = await this.fastify.mongo.tickets.insertOne(ticket);
      const createdTicket = await this.getTicketById(
        result.insertedId.toHexString()
      );

      if (!createdTicket) {
        throw new AppError("Failed to retrieve created ticket", 500);
      }

      return createdTicket;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to create ticket", 500);
    }
  }

  async updateTicket(id: string, data: UpdateTicketRequest): Promise<Ticket> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new AppError("Invalid ticket ID", 400);
      }

      if (Object.keys(data).length === 0) {
        throw new AppError(
          "At least one field must be provided for update",
          400
        );
      }

      if (data.priority) {
        const validPriorities = ["low", "medium", "high", "critical"];
        if (!validPriorities.includes(data.priority)) {
          throw new AppError("Invalid priority level", 400);
        }
      }

      if (data.status) {
        const validStatuses = ["open", "in-progress", "resolved", "closed"];
        if (!validStatuses.includes(data.status)) {
          throw new AppError("Invalid status", 400);
        }
      }

      if (data.userId && !ObjectId.isValid(data.userId)) {
        throw new AppError("Invalid user ID", 400);
      }

      if (data.userId) {
        const user = await this.fastify.mongo.users.findOne({
          _id: new ObjectId(data.userId),
        });
        if (!user) {
          throw new AppError("Assignee user not found", 404);
        }
      }

      const { userId, ...restOfData } = data;

      const setData: Partial<Ticket> = {
        ...restOfData,
        updatedAt: new Date(),
      };

      if (userId) {
        setData.userId = new ObjectId(userId);
      }

      const updateOperation: UpdateFilter<Ticket> = {
        $set: setData,
      };

      if (userId === null) {
        updateOperation.$unset = { userId: true };
      }

      const result = await this.fastify.mongo.tickets.findOneAndUpdate(
        { _id: new ObjectId(id) },
        updateOperation,
        { returnDocument: "after" }
      );

      if (!result) {
        throw new AppError("Ticket not found", 404);
      }

      return this.getTicketById(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to update ticket", 500);
    }
  }

  async deleteTicket(id: string): Promise<void> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new AppError("Invalid ticket ID", 400);
      }

      const result = await this.fastify.mongo.tickets.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        throw new AppError("Ticket not found", 404);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to delete ticket", 500);
    }
  }
}
