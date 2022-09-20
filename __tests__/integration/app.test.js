const http = require("http");
const supertest = require("supertest");
const app = require("../../app");

describe("Test the CRUD actions", () => {
  let server;

	beforeAll((done) => {
		server = http.createServer(app.requestHandler);
		server.listen(done);
	});

	afterAll((done) => {
		server.close(done);
	});

  it("GET => should return an array of objects", async () => {
		const response = await supertest(server).get("/books");

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.text).length).toBeGreaterThan(0);
	});

  it("POST => should create a book in the directory with an auto-generated id", async () => {
		const response = await supertest(server).post("/books").send({
      "title": "A Book",
      "author": "An Author",
      "year": 2022
		});

		expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.text)).toHaveProperty("title", "A Book");
    expect(JSON.parse(response.text)).toHaveProperty("author", "An Author");
    expect(JSON.parse(response.text)).toHaveProperty("year", 2022);
    expect(JSON.parse(response.text)).toHaveProperty("id");
    expect(JSON.parse(response.text).id).toBeTruthy;
	});
});
