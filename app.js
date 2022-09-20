const http = require("http");
const { getAllBooks, addBook, updateBook, deleteBook } = require("./src/books");
const { createUser, getAllUsers, authenticate } = require("./src/users");

function requestHandler(req, res) {
	res.setHeader("Content-Type", "application/json");
  //Configure CORS
  res.setHeader('Access-Control-Allow-Origin', '*');

	// Book routes
	if (req.url === "/books" && req.method === "GET") {
		// Get all books => GET
		authenticate(req, res, ["admin", "reader"])
			.then(() => {
				getAllBooks(req, res);
			})
			.catch((err) => {
				res.statusCode = 401;
				res.end(
					JSON.stringify({
						error: err,
					})
				);
			});
	} else if (req.url === "/books" && req.method === "POST") {
		// Add a book => POST
		authenticate(req, res, ["admin"])
			.then(() => {
				addBook(req, res);
			})
			.catch((err) => {
				res.statusCode = 401;
				res.end(
					JSON.stringify({
						error: err,
					})
				);
			});
	} else if (req.url === "/books" && req.method === "PUT") {
		// Update book => PUT
    authenticate(req, res, ["admin"])
			.then(() => {
				updateBook(req, res);
			})
			.catch((err) => {
				res.statusCode = 401;
				res.end(
					JSON.stringify({
						error: err,
					})
				);
			});
	} else if (req.url === "/books" && req.method === "DELETE") {
		// Delete book => DELETE
		authenticate(req, res, ["admin"])
			.then(() => {
				deleteBook(req, res);
			})
			.catch((err) => {
				res.statusCode = 401;
				res.end(
					JSON.stringify({
						error: err,
					})
				);
			});
	} else if (req.url === "/users" && req.method === "GET") {
		authenticate(req, res, ["admin"])
			.then(() => {
				getAllUsers(req, res);
			})
			.catch((err) => {
				res.statusCode = 401;
				res.end(
					JSON.stringify({
						error: err,
					})
				);
			});
	} else if (req.url === "/users/register" && req.method === "POST") {
		createUser(req, res);
	} else {
		res.statusCode = 404;
		res.end("Not Found");
	}
	// LoanOut => POST
	// Return => POST
}

const server = http.createServer(requestHandler);

module.exports = { server, requestHandler };
