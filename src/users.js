const fs = require("fs");
const { readFile } = require("fs/promises");

const path = require("path");
// const { parseBody } = require("./utils");

const usersDbPath = path.join(process.cwd(), "db", "users.json");
const usersDb = JSON.parse(fs.readFileSync(usersDbPath, "utf8"));

//  getAllUsers - GET
function getAllUsers(req, res) {
	res.writeHead(200);
	res.end(usersDb);
}

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
async function authenticate(req, res, roles) {
	// return new Promise((resolve, reject) => {
	// get user details
	try {
		const userDetails = await req.body;
    

		if (!userDetails) {
			return res
				.status(401)
				.json({ message: "Please enter your username and password" });
		} else {
			// validate username and password
			const userIndex = usersDb.findIndex(
				(user) =>
					user.username === userDetails.username ||
					user.email === userDetails.email
			);
		}
		const foundUser = usersDb[userIndex];

		if (userIndex === -1 || foundUser.password !== userDetails.password) {
			return res
				.status(401)
				.json({ message: "Invalid username/email or password" });
		} else {
			// validate access level
			if (!roles.includes(foundUser.role)) {
				return res.status(401).json({
					message: "You do not have the required role to access this resource",
				});
			}
		}
		return userDetails;
	} catch (err) {
		console.log(err);
	}
	// });
}

module.exports = {
	createUser,
	getAllUsers,
	authenticate,
};
