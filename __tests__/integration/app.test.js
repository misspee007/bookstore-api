const http = require("http");
const supertest = require("supertest");
const app = require("../../app");

describe("Test the root path", () => {
	let server;

	beforeAll((done) => {
		server = http.createServer(app.requestHandler);
		server.listen(done);
	});

	afterAll((done) => {
		server.close(done);
	});

	it("should response the GET method", async () => {
		const response = await supertest(server).get("/books");

    expect(response.statusCode).toBe(200);
	});

  // it("should create a book in the directory", async () => {
	// 	const response = await supertest(server).post("/books").send({
  //     "title": "A Book",
  //     "author": "An Author",
  //     "year": 2022
	// 	});

	// 	expect(response.status).toBe(200);
	// 	expect(response.text).toBe(JSON.stringify({ title: "A Book",
  //   author: "An Author",
  //   year: 2022 }));
	// });
});
