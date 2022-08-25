const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/auth");

router.get("/", middleware, (req, res) => {
	try {
		let sql = "SELECT * FROM passengers";
		con.query(sql, (err, result) => {
			if (err) throw err;
			res.send(result);
		});
	} catch (error) {
		console.log(error);
	}
});
// Register Route
// The Route where Encryption starts
router.post("/register", (req, res) => {
	try {
		let sql = "INSERT INTO passengers SET ?";
		const { passenger_id, pname, psurname, pemail, password, pcell, role } =
			req.body;
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);
		// The start of hashing / encryption
		let passengers = {
			passenger_id,
			pname,
			psurname,
			pemail,
			password: hash,
			pcell,
			role,
		};
		con.query(sql, passengers, (err, result) => {
			if (err) throw err;
			console.log(result);
			res.send(
				`passenger ${
					(passengers.pname, passengers.pemail)
				} created successfully`
			);
		});
	} catch (error) {
		console.log(error);
	}
});

// Login
// The Route where Decryption happens
router.post("/login", (req, res) => {
	try {
		let sql = "SELECT * FROM passengers WHERE ?";
		let user = {
			pemail: req.body.pemail,
		};
		con.query(sql, user, async (err, result) => {
			if (err) throw err;
			if (result.length === 0) {
				res.send("Email not found please register");
			} else {
				// Decryption
				// Accepts the password stored in database and the password given by user (req.body)
				const isMatch = await bcrypt.compare(
					req.body.password,
					result[0].password
				);
				// If password does not match
				if (!isMatch) {
					res.send("Password incorrect");
				} else {
					res.send(result);
				}
			}
		});
	} catch (error) {
		console.log(error);
	}
});
router.post("/login", (req, res) => {
	try {
		let sql = "SELECT * FROM passengers WHERE ?";
		let user = {
			email: req.body.pemail,
		};
		con.query(sql, user, async (err, result) => {
			if (err) throw err;
			if (result.length === 0) {
				res.send("Email not found please register");
			} else {
				const isMatch = await bcrypt.compare(
					req.body.password,
					result[0].password
				);
				if (!isMatch) {
					res.send("Password incorrect");
				} else {
					// The information the should be stored inside token
					const payload = {
						user: {
							passenger_id: result[0].passenger_id,
							pname: result[0].pname,
							psurname: result[0].psurname,
							pemail: result[0].pemail,
							password: result[0].password,
							pcell: result[0].pcell,
							role: result[0].role,
						},
					};
					// Creating a token and setting expiry date
					jwt.sign(
						payload,
						process.env.jwtSecret,
						{
							expiresIn: "365d",
						},
						(err, token) => {
							if (err) throw err;
							res.json({ token });
						}
					);
				}
			}
		});
	} catch (error) {
		console.log(error);
	}
});
// Verify
router.get("/verify", (req, res) => {
	const token = req.header("x-auth-token");
	jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
		if (error) {
			res.status(401).json({
				msg: "Unauthorized Access!",
			});
		} else {
			res.status(200);
			res.send(decodedToken);
		}
	});
});
module.exports = router;
