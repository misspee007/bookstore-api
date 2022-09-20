const http = require("http");
const { getAllBooks, addBook, updateBook, deleteBook } = require("./src/books");
const { createUser, getAllUsers } = require("./src/users");

function requestHandler(req, res) {
	// Book routes
	if (req.url === "/books" && req.method === "GET") {
		// Get all books => GET
		getAllBooks(req, res);
	} else if (req.url === "/books" && req.method === "POST") {
		// Add a book => POST
		addBook(req, res);
	} else if (req.url === "/books" && req.method === "PUT") {
		// Update book => PUT
		updateBook(req, res);
	} else if (req.url === "/books" && req.method === "DELETE") {
		// Delete book => DELETE
		deleteBook(req, res);
	} else if (req.url === "/users" && req.method === "GET") {
		getAllUsers(req, res);
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
