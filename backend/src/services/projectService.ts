import { ObjectId } from "mongodb";
import type { FastifyInstance } from "fastify";

import { AppError } from "../utils/errorHandler.js";
import {
  ProjectWithTickets,
  CreateProjectRequest,
  Project,
  UpdateProjectRequest,
} from "../types/index.js";

export class ProjectService {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  async getAllProjects(): Promise<ProjectWithTickets[]> {
    try {
      const projectsWithTickets = await this.fastify.mongo.projects
        .aggregate([
          {
            $lookup: {
              from: "tickets",
              localField: "_id",
              foreignField: "projectId",
              as: "tickets",
            },
          },
          {
            $unwind: {
              path: "$tickets",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "tickets.userId",
              foreignField: "_id",
              as: "tickets.user",
            },
          },
          {
            $unwind: {
              path: "$tickets.user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: "$_id",
              title: { $first: "$title" },
              description: { $first: "$description" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              tickets: {
                $push: {
                  $cond: [
                    { $ifNull: ["$tickets._id", false] },
                    "$tickets",
                    "$$REMOVE",
                  ],
                },
              },
            },
          },
        ])
        .toArray();

      if (projectsWithTickets.length === 0) {
        throw new AppError("There are no projects", 404);
      }
      return projectsWithTickets as ProjectWithTickets[];
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to fetch projects", 500);
    }
  }

  async getProjectById(id: string): Promise<ProjectWithTickets> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new AppError("Invalid project ID", 400);
      }

      const project = await this.fastify.mongo.projects
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: {
              from: "tickets",
              localField: "_id",
              foreignField: "projectId",
              as: "tickets",
            },
          },
          {
            $unwind: {
              path: "$tickets",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "tickets.userId",
              foreignField: "_id",
              as: "tickets.user",
            },
          },
          {
            $unwind: {
              path: "$tickets.user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: "$_id",
              title: { $first: "$title" },
              description: { $first: "$description" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              tickets: {
                $push: {
                  $cond: [
                    { $ifNull: ["$tickets._id", false] },
                    "$tickets",
                    "$$REMOVE",
                  ],
                },
              },
            },
          },
        ])
        .next();

      if (!project) {
        throw new AppError("Project not found", 404);
      }

      return project as ProjectWithTickets;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to fetch project", 500);
    }
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    try {
      if (!data.title || !data.description) {
        throw new AppError("Title and description are required", 400);
      }

      const project: Omit<Project, "_id"> = {
        title: data.title,
        description: data.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await this.fastify.mongo.projects.insertOne(project);
      const createdProject = await this.fastify.mongo.projects.findOne({
        _id: result.insertedId,
      });

      if (!createdProject) {
        throw new AppError("Failed to retrieve created project", 500);
      }

      return createdProject;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to create project", 500);
    }
  }

  async updateProject(
    id: string,
    data: UpdateProjectRequest
  ): Promise<Project> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new AppError("Invalid project ID", 400);
      }

      if (!data.title && !data.description) {
        throw new AppError(
          "At least one field must be provided for update",
          400
        );
      }

      const updateFields: Partial<Project> = {
        ...data,
        updatedAt: new Date(),
      };

      const result = await this.fastify.mongo.projects.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateFields },
        { returnDocument: "after" }
      );

      if (!result) {
        throw new AppError("Project not found", 404);
      }

      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to update project", 500);
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new AppError("Invalid project ID", 400);
      }

      await this.fastify.mongo.tickets.deleteMany({
        projectId: new ObjectId(id),
      });

      const result = await this.fastify.mongo.projects.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        throw new AppError("Project not found", 404);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to delete project", 500);
    }
  }
}
