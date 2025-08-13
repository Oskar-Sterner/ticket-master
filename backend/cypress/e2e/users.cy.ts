describe("User API", () => {
  let user;
  let token;

  before(() => {
    const uniqueId = new Date().getTime();
    user = {
      name: "Test User",
      email: `testuser_${uniqueId}@example.com`,
      password: "password123",
    };
  });

  it("should register a new user", () => {
    cy.request({
      method: "POST",
      url: "/register",
      body: user,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("name", user.name);
      expect(response.body).to.have.property("email", user.email);
      expect(response.body).to.not.have.property("password");
      user._id = response.body._id;
    });
  });

  it("should login the user and receive a token", () => {
    cy.request({
      method: "POST",
      url: "/login",
      body: {
        email: user.email,
        password: user.password,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("token");
      token = response.body.token;
    });
  });

  it("should get the current user's details with /me", () => {
    cy.request({
      method: "GET",
      url: "/me",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("_id", user._id);
      expect(response.body).to.have.property("email", user.email);
    });
  });

  it("should get all users", () => {
    cy.request("/users").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.some((u) => u.email === user.email)).to.be.true;
    });
  });

  it("should get a specific user by ID", () => {
    cy.request(`/users/${user._id}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("_id", user._id);
    });
  });

  it("should update a user", () => {
    const newName = "Updated Test User";
    cy.request({
      method: "PUT",
      url: `/users/${user._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        name: newName,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("name", newName);
    });
  });

  it("should delete a user", () => {
    cy.request({
      method: "DELETE",
      url: `/users/${user._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    cy.request({
      method: "GET",
      url: `/users/${user._id}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
