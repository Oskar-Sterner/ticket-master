import type { FastifyInstance } from "fastify";

export async function initializeDatabase(
  fastify: FastifyInstance
): Promise<void> {
  try {
    const db = fastify.mongo.db;

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);

    if (!collectionNames.includes("projects")) {
      await db.createCollection("projects");
      fastify.log.info("Created projects collection");
    }

    if (!collectionNames.includes("tickets")) {
      await db.createCollection("tickets");
      fastify.log.info("Created tickets collection");
    }

    if (!collectionNames.includes("users")) {
      await db.createCollection("users");
      fastify.log.info("Created users collection");
    }

    const projectsIndexes = await db
      .collection("projects")
      .listIndexes()
      .toArray();
    const hasProjectTitleIndex = projectsIndexes.some(
      (index) => index.key && "title" in index.key
    );

    if (!hasProjectTitleIndex) {
      await db.collection("projects").createIndex({ title: 1 });
      fastify.log.info("Created index on projects.title");
    }

    const ticketsIndexes = await db
      .collection("tickets")
      .listIndexes()
      .toArray();
    const hasTicketProjectIdIndex = ticketsIndexes.some(
      (index) => index.key && "projectId" in index.key
    );
    const hasTicketStatusIndex = ticketsIndexes.some(
      (index) => index.key && "status" in index.key
    );
    const hasTicketPriorityIndex = ticketsIndexes.some(
      (index) => index.key && "priority" in index.key
    );
    const hasTicketUserIdIndex = ticketsIndexes.some(
      (index) => index.key && "userId" in index.key
    );

    if (!hasTicketProjectIdIndex) {
      await db.collection("tickets").createIndex({ projectId: 1 });
      fastify.log.info("Created index on tickets.projectId");
    }

    if (!hasTicketStatusIndex) {
      await db.collection("tickets").createIndex({ status: 1 });
      fastify.log.info("Created index on tickets.status");
    }

    if (!hasTicketPriorityIndex) {
      await db.collection("tickets").createIndex({ priority: 1 });
      fastify.log.info("Created index on tickets.priority");
    }

    if (!hasTicketUserIdIndex) {
      await db.collection("tickets").createIndex({ userId: 1 });
      fastify.log.info("Created index on tickets.userId");
    }

    const usersIndexes = await db.collection("users").listIndexes().toArray();
    const hasUserEmailIndex = usersIndexes.some(
      (index) => index.key && "email" in index.key
    );

    if (!hasUserEmailIndex) {
      await db.collection("users").createIndex({ email: 1 }, { unique: true });
      fastify.log.info("Created unique index on users.email");
    }

    await db.collection("tickets").createIndex({ projectId: 1, status: 1 });
    await db.collection("tickets").createIndex({ createdAt: -1 });
    await db.collection("projects").createIndex({ createdAt: -1 });
    await db.collection("users").createIndex({ createdAt: -1 });

    fastify.log.info("Database initialization completed successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    fastify.log.error(`Database initialization failed: ${errorMessage}`);
    throw error;
  }
}
