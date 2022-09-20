const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");
const { parseBody } = require("./utils");

const pathToBooksDb = path.join(process.cwd(), "db", "books.json");
const booksDb = JSON.parse(fs.readFileSync(pathToBooksDb, "utf8"));

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
			let newBook = parseBody(body);

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
			const bookUpdate = parseBody(body);

			// get book by id
			const updatedBookId = booksDb.findIndex(
				(book) => book.id === bookUpdate.id
			);

			if (updatedBookId === -1) {
				res.writeHead(400);
				res.end("Book not found. Please enter a valid id");
				return;
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

function deleteBook(req, res) {
	let body = [];
	req.on("data", (chunk) => {
		body.push(chunk);
	});

	req.on("end", async () => {
		try {
			// get book by id
			const bookId = parseBody(body);
			const bookToDelete = booksDb.findIndex((book) => book.id === bookId.id);

			if (bookToDelete === -1) {
				res.writeHead(400);
				res.end("Book not found. Please enter a valid id");
				return;
			}

			// delete from db
			booksDb.splice(bookToDelete, 1);

			// update db
			await fsPromises.writeFile(pathToBooksDb, JSON.stringify(booksDb));
			res.writeHead(201);
			res.end(`Deleted successfully: ${booksDb[bookToDelete].title}`);
		} catch (err) {
			console.log(err);
			res.writeHead(500);
			res.end(
				JSON.stringify({
					message:
						"Internal Server Error. Could not delete book from database.",
				})
			);
		}
	});
}

module.exports = {
	addBook,
	updateBook,
	deleteBook,
	getAllBooks,
};
