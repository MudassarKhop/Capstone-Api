const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/auth")
// const  = require("..//auth");

router.get("/", (req, res) => {
	// if (req.passenger.p_role === "admin") {
	try {
		con.query("SELECT * FROM passengers", (err, result) => {
			if (err) throw err;
			res.send(result);
		});
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}
	// } else {
	// 	res.send("You are not an admin");
	// }
});
router.put("/:id", middleware, (req, res) => {
	try {
	  const strQry = `UPDATE passengers SET ? WHERE id = ${req.params.id}`;
	  const {
		passenger_id,
		pname,
		psurname,
		pemail,
		pcell,
		prole
	  } = req.body
  
	  const user = {
		passenger_id,
		pname,
		psurname,
		pemail,
		pcell,
		prole
	  }
	  con.query(strQry, passenger, (err, results) => {
		if (err) throw err;
  
		res.json({
		  msg: "Updated Successfully"
		})
	  })
	} catch (error) {
	  res.send(400).json({
		error
	  })
	}
  })
// Register Route
// The Route where Encryption starts
router.post("/register", (req, res) => {
	try {
		let sql = "INSERT INTO passengers SET ?";
		const { passenger_id, pname, psurname, pemail, password, pcell, p_role } =
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
			p_role,
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
// router.post("/login", (req, res) => {
// 	try {
// 		let sql = "SELECT * FROM passengers WHERE ?";
// 		let user = {
// 			pemail: req.body.pemail,
// 		};
// 		con.query(sql, user, async (err, result) => {
// 			if (err) throw err;
// 			if (result.length === 0) {
// 				res.send("Email not found please register");
// 			} else {
// 				// Decryption
// 				// Accepts the password stored in database and the password given by user (req.body)
// 				const isMatch = await bcrypt.compare(
// 					req.body.password,
// 					result[0].password
// 				);
// 				// If password does not match
// 				if (!isMatch) {
// 					res.send("Password incorrect");
// 				} else {
// 					res.send(result);
// 				}
// 			}
// 		});
// 	} catch (error) {
// 		console.log(error);
// 	}
// });
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
							p_role: result[0].p_role,
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

							res.json({
								msg: "Login Successful",
								user: payload.user,
								token: token,
							});
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
