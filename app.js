const http = require("http");
const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");
const { error } = require("console");

const pathToBooksDb = path.join(__dirname, "db", "books.json");

const booksDb = JSON.parse(fs.readFileSync(pathToBooksDb, "utf8"));

function requestHandler(req, res) {
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
		// deleteBook(req, res);
	} else {
		res.statusCode = 404;
		res.end("Not Found");
	}
	// LoanOut => POST
	// Return => POST
}

async function getAllBooks(req, res) {
	try {
		const books = await fsPromises.readFile(pathToBooksDb, "utf8");
		res.writeHead(200);
		res.end(books);
	} catch (error) {
		console.log(error);
	}
}

function addBook(req, res) {
	const body = [];
	req.on("data", (chunk) => {
		body.push(chunk);
	});

	req.on("end", async () => {
		try {
			// concatenate raw data into a single buffer string
			const parsedBody = Buffer.concat(body).toString();
			// parse the buffer string into a JSON object
			let newBook = JSON.parse(parsedBody);

			// get ID of last book in the database
			const lastBook = booksDb[booksDb.length - 1];
			const lastBookId = lastBook.id;
			newBook.id = lastBookId + 1;

			//save to db
			booksDb.push(newBook);

			await fsPromises.writeFile(pathToBooksDb, JSON.stringify(booksDb));

			res.writeHead(201);
			res.end(JSON.stringify(newBook));
		} catch (err) {
			console.log(err);
			res.writeHead(500);
			res.end(
				JSON.stringify({
					message: "Internal Server Error. Could not save book to database.",
				})
			);
		}
	});
}

function updateBook(req, res) {
	const body = [];
	req.on("data", (chunk) => {
		body.push(chunk);
	});

	req.on("end", async () => {
		try {
			const parsedBody = Buffer.concat(body).toString();
			const bookUpdate = JSON.parse(parsedBody);

      console.log(bookUpdate);

			// get book by id
			const updatedBookId = booksDb.findIndex(
				(book) => book.id === bookUpdate.id
			);

      if (updatedBookId === -1) {
        res.writeHead(400);
        res.end("Book not found. Please enter a valid id");
        return
      }

			// update book
			const updatedBook = { ...booksDb[updatedBookId], ...bookUpdate };
			booksDb[updatedBookId] = updatedBook;

			// save updated book to db
			await fsPromises.writeFile(pathToBooksDb, JSON.stringify(booksDb));

			res.writeHead(201);
			res.end(JSON.stringify(updatedBook));
		} catch (err) {
			console.log(err);
			res.writeHead(500);
			res.end(
				JSON.stringify({
					message: "Internal Server Error. Could not save book to database.",
				})
			);
		}
	});
}



const server = http.createServer(requestHandler);

module.exports = { server, requestHandler };
