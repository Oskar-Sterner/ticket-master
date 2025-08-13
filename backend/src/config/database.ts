import { MongoClient, Db, Collection } from "mongodb";
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { Project, Ticket, User } from "../types";

async function dbConnector(fastify: FastifyInstance) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log("Connecting to MongoDB...");
    console.log("MongoDB URI exists:", !!mongoUri);

    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is required");
    }

    const client = new MongoClient(mongoUri, {
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: "majority",
    });

    console.log("Attempting MongoDB connection...");
    await client.connect();
    console.log("MongoDB client connected");

    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB ping successful");

    const db = client.db("jira-ticketing");
    console.log("Database selected");

    fastify.decorate("mongo", {
      client,
      db,
      projects: db.collection<Project>("projects"),
      tickets: db.collection<Ticket>("tickets"),
      users: db.collection<User>("users"),
    });

    fastify.addHook("onClose", async () => {
      await client.close();
    });

    fastify.log.info("MongoDB connected successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("MongoDB connection error details:", error);
    console.error("Please check:");
    console.error("1. Your MongoDB Atlas cluster exists and is running");
    console.error(
      "2. Your IP address is whitelisted in MongoDB Atlas Network Access"
    );
    console.error("3. Your internet connection is working");
    console.error("4. The connection string is correct");
    fastify.log.error(`MongoDB connection failed: ${errorMessage}`);
    throw error;
  }
}

export default fp(dbConnector);

declare module "fastify" {
  interface FastifyInstance {
    mongo: {
      client: MongoClient;
      db: Db;
      projects: Collection<Project>;
      tickets: Collection<Ticket>;
      users: Collection<User>;
    };
  }
}
