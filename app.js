const express = require("express");
const bookRoute = require("./routes/book");

const app = express();

// express body parser
app.use(express.json());

app.use("/books", bookRoute);

app.get('/', (req, res) => {
  res.end('Home Page');
});

module.exports = { app };



// const http = require("http");
// const { getAllBooks, addBook, updateBook, deleteBook } = require("./src/books");
// const { createUser, getAllUsers, authenticate } = require("./src/users");

// function requestHandler(req, res) {
// 	res.setHeader("Content-Type", "application/json");
//   //Configure CORS
//   res.setHeader('Access-Control-Allow-Origin', '*');

// 	// user routes
// 	if (req.url === "/users" && req.method === "GET") {
// 		authenticate(req, res, ["admin"])
// 			.then(() => {
// 				getAllUsers(req, res);
// 			})
// 			.catch((err) => {
// 				res.statusCode = 401;
// 				res.end(
// 					JSON.stringify({
// 						error: err,
// 					})
// 				);
// 			});
// 	} else if (req.url === "/users/register" && req.method === "POST") {
// 		createUser(req, res);
// 	} else {
// 		res.statusCode = 404;
// 		res.end("Not Found");
// 	}
// 	// LoanOut => POST
// 	// Return => POST
// }

// const server = http.createServer(requestHandler);

