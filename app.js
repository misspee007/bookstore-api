const http = require("http");
const fs = require("fs");
const path = require("path");

const pathToBooksDb = path.join(__dirname, "db", "books.json");

const booksDb = JSON.parse(fs.readFileSync(pathToBooksDb, "utf8"));

function requestHandler(req, res) {
	if (req.url === "/books" && req.method === "GET") {
		// Get all books => GET
		getAllBooks(req, res);
	} else if (req.url === "/books" && req.method === "POST") {
		// Add a book => POST
		// addBook(req, res);
	} else if (req.url === "/books" && req.method === "PUT") {
		// Update book => PUT
		// updateBook(req, res);
	} else if (req.url === "/books" && req.method === "DELETE") {
		// Delete book => DELETE
		// deleteBook(req, res);
	}
	else {
		res.statusCode = 404;
		res.end("Not Found");
	}
	// LoanOut => POST
	// Return => POST
}

function getAllBooks(req, res) {
	const books = fs.readFileSync(pathToBooksDb, "utf8", "r");
	res.writeHead(200);
	res.end(books);
}



const server = http.createServer(requestHandler);

module.exports = { server, requestHandler };
