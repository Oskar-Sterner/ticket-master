export interface User {
  _id?: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  _id?: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  userId?: string;
  user?: User;
  projectId: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface ProjectWithTickets extends Project {
  tickets: Ticket[];
}

export interface TicketWithProject extends Ticket {
  project: Project;
}

export interface TicketWithUser extends Ticket {
  user?: User;
}

export interface UserWithDetails extends User {
  projects: ProjectWithTickets[];
  tickets: Ticket[];
}

export interface CreateProjectRequest {
  title: string;
  description: string;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  userId?: string;
  projectId: string;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "critical";
  userId?: string;
  status?: "open" | "in-progress" | "resolved" | "closed";
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
