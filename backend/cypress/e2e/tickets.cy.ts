describe("Ticket API", () => {
  let token;
  let projectId;
  let ticketId;
  let userId;

  before(() => {
    const uniqueId = new Date().getTime();
    const user = {
      name: "Ticket Tester",
      email: `ticket_tester_${uniqueId}@example.com`,
      password: "password123",
    };

    cy.request("POST", "/register", user).then((response) => {
      userId = response.body._id;
    });

    cy.request("POST", "/login", {
      email: user.email,
      password: user.password,
    })
      .its("body.token")
      .then((t) => {
        token = t;
        cy.request({
          method: "POST",
          url: "/projects",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            title: "Project for Tickets",
            description: "A project to test tickets with.",
          },
        }).then((response) => {
          projectId = response.body._id;
        });
      });
  });

  after(() => {
    if (projectId && token) {
      cy.request({
        method: "DELETE",
        url: `/projects/${projectId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      });
    }
    if (userId && token) {
      cy.request({
        method: "DELETE",
        url: `/users/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      });
    }
  });

  it("should create a new ticket for a project", () => {
    cy.request({
      method: "POST",
      url: "/tickets",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: "My First Ticket",
        description: "This is a test ticket.",
        priority: "high",
        projectId: projectId,
        userId: userId,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("title", "My First Ticket");
      expect(response.body).to.have.property("projectId", projectId);
      expect(response.body).to.have.property("userId", userId);
      ticketId = response.body._id;
    });
  });

  it("should get all tickets", () => {
    cy.request("/tickets").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.some((t) => t._id === ticketId)).to.be.true;
    });
  });

  it("should get a specific ticket by ID", () => {
    cy.request(`/tickets/${ticketId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("_id", ticketId);
      expect(response.body).to.have.property("user").to.be.an("object");
      expect(response.body.user).to.have.property("_id", userId);
    });
  });

  it("should get all tickets for a specific project", () => {
    cy.request(`/projects/${projectId}/tickets`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.at.least(1);
      expect(response.body[0]).to.have.property("projectId", projectId);
    });
  });

  it("should update a ticket", () => {
    cy.request({
      method: "PUT",
      url: `/tickets/${ticketId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        status: "in-progress",
        priority: "critical",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("status", "in-progress");
      expect(response.body).to.have.property("priority", "critical");
    });
  });

  it("should delete a ticket", () => {
    cy.request({
      method: "DELETE",
      url: `/tickets/${ticketId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    cy.request({
      method: "GET",
      url: `/tickets/${ticketId}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
