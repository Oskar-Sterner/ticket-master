import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";

interface RateLimitStore {
  requests: number[];
}

class InMemoryRateLimiter {
  private store: Map<string, RateLimitStore> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number = 100, windowMs: number = 1000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  private cleanExpiredRequests(requests: number[], now: number): number[] {
    return requests.filter((timestamp) => now - timestamp < this.windowMs);
  }

  isAllowed(ip: string): boolean {
    const now = Date.now();
    const store = this.store.get(ip) || { requests: [] };

    store.requests = this.cleanExpiredRequests(store.requests, now);

    if (store.requests.length >= this.limit) {
      return false;
    }

    store.requests.push(now);
    this.store.set(ip, store);

    return true;
  }

  reset(): void {
    this.store.clear();
  }

  getStats(ip: string): { requests: number; remaining: number } {
    const now = Date.now();
    const store = this.store.get(ip) || { requests: [] };
    const cleanRequests = this.cleanExpiredRequests(store.requests, now);

    return {
      requests: cleanRequests.length,
      remaining: Math.max(0, this.limit - cleanRequests.length),
    };
  }
}

const rateLimiter = new InMemoryRateLimiter(100, 1000);

async function rateLimitMiddleware(fastify: FastifyInstance) {
  fastify.addHook(
    "preHandler",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const ip = request.ip || request.socket.remoteAddress || "unknown";

      if (!rateLimiter.isAllowed(ip)) {
        const stats = rateLimiter.getStats(ip);

        reply.header("X-RateLimit-Limit", 100);
        reply.header("X-RateLimit-Remaining", stats.remaining);
        reply.header(
          "X-RateLimit-Reset",
          new Date(Date.now() + 1000).toISOString()
        );

        return reply.status(429).send({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Maximum 100 requests per second.",
          statusCode: 429,
          retryAfter: 1,
        });
      }

      const stats = rateLimiter.getStats(ip);
      reply.header("X-RateLimit-Limit", 100);
      reply.header("X-RateLimit-Remaining", stats.remaining);
    }
  );
}

export default fp(rateLimitMiddleware);
export { rateLimiter };
