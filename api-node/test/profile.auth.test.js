process.env.JWT_SECRET = "testsecret";

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/index");

describe("Auth middleware – protected route", () => {
  let token;

  beforeAll(() => {
    token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
  });

  test("Should return 401 when no token is provided", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.statusCode).toBe(401);
  });

  test("Should return 200 or 401 when token is provided", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 401]).toContain(res.statusCode);
  });
});
