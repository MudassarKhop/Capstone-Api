const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/auth");

router.get("/", (req, res) => {
	try {
		con.query("SELECT * FROM tickets", (err, result) => {
			if (err) throw err;
			res.send(result);
		});
	} catch (error) {
		console.log(error);
	}
});
module.exports = router;
