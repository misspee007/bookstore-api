const fs = require("fs");
const path = require("path");
const { parseBody } = require("./utils");

const usersDbPath = path.join(process.cwd(), "db", "users.json");
const usersDb = JSON.parse(fs.readFileSync(usersDbPath, "utf8"));

//  CreateUser - POST
function createUser(req, res) {
	const body = [];

	req.on("data", (chunk) => {
		body.push(chunk);
	});

	req.on("end", () => {
		// get user details
		const newUser = parseBody(body);

		// check if user exists
		const newUserIndex = usersDb.findIndex(
			(user) =>
				user.username === newUser.username || user.email === newUser.email
		);

		if (newUserIndex === -1) {
			// add user to db
			usersDb.push(newUser);

			// save updated db
			fs.writeFile(usersDbPath, JSON.stringify(usersDb), (err) => {
				if (err) {
					console.log(err);
					res.writeHead(500);
					res.end(
						JSON.stringify({
							message: "Internal Server Error. Could not create account.",
						})
					);
				}

				res.writeHead(201);
				res.end(`Account created with username ${newUser.username}`);
			});
		} else if (usersDb[newUserIndex].email === newUser.email) {
			res.writeHead(400);
			res.end(`User with email "${newUser.email}" exists`);
		} else if (usersDb[newUserIndex].username === newUser.username) {
			res.writeHead(400);
			res.end(`User with username "${newUser.username}" exists`);
		}
	});
}
//  AuthenticateUser - POST
//  getAllUsers - GET

module.exports = {
	createUser,
};
