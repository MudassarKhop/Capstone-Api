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
router.post("/", (req, res) => {
	const { ticket_id, ticket_type, ticket_prices, passenger_id, flight_id } =
		req.body;
	try {
		con.query(
			`INSERT INTO tickets ( ticket_id, ticket_type, ticket_prices, passenger_id, flight_id ) values ("${ticket_id}","${ticket_type}","${ticket_prices}","${passenger_id}","${flight_id}")`,
			(err, result) => {
				if (err) throw err;
				res.send(result);
			}
		);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
