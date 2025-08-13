import type { FastifyInstance } from "fastify";

import { TicketController } from "../controllers/ticketController.js";
import { CreateTicketRequest, UpdateTicketRequest } from "../types/index.js";

export async function ticketRoutes(fastify: FastifyInstance) {
  const ticketController = new TicketController(fastify);

  fastify.get(
    "/tickets",
    ticketController.getAllTickets.bind(ticketController)
  );

  fastify.get<{ Params: { id: string } }>(
    "/tickets/:id",
    ticketController.getTicketById.bind(ticketController)
  );

  fastify.get<{ Params: { projectId: string } }>(
    "/projects/:projectId/tickets",
    ticketController.getTicketsByProjectId.bind(ticketController)
  );

  fastify.post<{ Body: CreateTicketRequest }>(
    "/tickets",
    { onRequest: [fastify.authenticate] },
    ticketController.createTicket.bind(ticketController)
  );

  fastify.put<{ Params: { id: string }; Body: UpdateTicketRequest }>(
    "/tickets/:id",
    { onRequest: [fastify.authenticate] },
    ticketController.updateTicket.bind(ticketController)
  );

  fastify.delete<{ Params: { id: string } }>(
    "/tickets/:id",
    { onRequest: [fastify.authenticate] },
    ticketController.deleteTicket.bind(ticketController)
  );
}
