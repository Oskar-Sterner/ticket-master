describe("Project API", () => {
  let token;
  let projectId;
  let userId;

  before(() => {
    const uniqueId = new Date().getTime();
    const user = {
      name: "Project Tester",
      email: `project_tester_${uniqueId}@example.com`,
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
      });
  });

  after(() => {
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

  it("should create a new project", () => {
    cy.request({
      method: "POST",
      url: "/projects",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: "New Awesome Project",
        description: "A description for this awesome project.",
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("title", "New Awesome Project");
      projectId = response.body._id;
    });
  });

  it("should get all projects", () => {
    cy.request("/projects").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.some((p) => p._id === projectId)).to.be.true;
    });
  });

  it("should get a specific project by ID", () => {
    cy.request(`/projects/${projectId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("_id", projectId);
      expect(response.body).to.have.property("tickets").to.be.an("array");
    });
  });

  it("should update a project", () => {
    cy.request({
      method: "PUT",
      url: `/projects/${projectId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: "Updated Awesome Project",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property(
        "title",
        "Updated Awesome Project"
      );
    });
  });

  it("should delete a project", () => {
    cy.request({
      method: "DELETE",
      url: `/projects/${projectId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    cy.request({
      method: "GET",
      url: `/projects/${projectId}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
