const express = require("express");
const fsPromises = require("fs/promises");
const { readFileSync } = require("fs");
const path = require("path");

const {
	getAllBooks,
	addBook,
	updateBook,
	deleteBook,
} = require("../src/books");
const { authenticate } = require("../src/users");

const pathToBooksDb = path.join(process.cwd(), "db", "books.json");
const booksDb = readFileSync(pathToBooksDb, "utf8");

const bookRoute = express.Router();

// get all books
bookRoute.get("/", (req, res) => {
	authenticate(req, res, ["admin", "reader"])
		.then(() => {
			// return res.status(200).json(booksDb);
      console.log(booksDb);
		})
		.catch((err) => {
			// return res.status(401).json({error: err});
      console.log(err);
		});
});

// Add a book => POST
bookRoute.post("/", (req, res) => {
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
});

// Update book => PUT
bookRoute.put("/", (req, res) => {
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
});

// Delete book => DELETE
bookRoute.delete("/", (req, res) => {
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
});

module.exports = bookRoute;
