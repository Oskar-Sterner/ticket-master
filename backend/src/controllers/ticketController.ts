import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

import { TicketService } from "../services/ticketService.js";
import { CreateTicketRequest, UpdateTicketRequest } from "../types/index.js";

export class TicketController {
  private ticketService: TicketService;

  constructor(fastify: FastifyInstance) {
    this.ticketService = new TicketService(fastify);
  }

  async getAllTickets(request: FastifyRequest, reply: FastifyReply) {
    const tickets = await this.ticketService.getAllTickets();
    return reply.send(tickets);
  }

  async getTicketById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const ticket = await this.ticketService.getTicketById(id);
    return reply.send(ticket);
  }

  async getTicketsByProjectId(
    request: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply
  ) {
    const { projectId } = request.params;
    const tickets = await this.ticketService.getTicketsByProjectId(projectId);
    return reply.send(tickets);
  }

  async createTicket(
    request: FastifyRequest<{ Body: CreateTicketRequest }>,
    reply: FastifyReply
  ) {
    const ticket = await this.ticketService.createTicket(request.body);
    return reply.status(201).send(ticket);
  }

  async updateTicket(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateTicketRequest;
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const ticket = await this.ticketService.updateTicket(id, request.body);
    return reply.send(ticket);
  }

  async deleteTicket(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    await this.ticketService.deleteTicket(id);
    return reply.status(204).send();
  }
}
