const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");
router.get("/", (req, res) => {
	try {
		con.query("SELECT * FROM flights", (err, result) => {
			if (err) throw err;
			res.send(result);
		});
	} catch (error) {
		console.log(error);
	}
});
router.post("/", (req, res) => {
	const {
		flight_id,
		flight_date,
		from_destination,
		to_destination,
		jet_id,
		duration,
	} = req.body;
	try {
		con.query(
			`INSERT INTO flights (flight_id,flight_date,from_destination,to_destination,jet_id,duration) values ("${flight_id}", "${flight_date}", "${from_destination}", "${to_destination}", "${jet_id}", "${duration}")`,
			(err, result) => {
				if (err) throw err;
				res.send(result);
			}
		);
	} catch (error) {
		console.log(error);
	}
});

router.get("/:id", (req, res) => {
	try {
		con.query(
			`SELECT * FROM flights where flight_id= ${req.params.id} `,
			(err, result) => {
				if (err) throw err;
				res.send(result);
			}
		);
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}
});
router.put("/:id", (req, res) => {
	const {
		flight_id,
		flight_date,
		from_destination,
		to_destination,
		jet_id,
		duration,
	} = req.body;
	try {
		con.query(
			`INSERT INTO flights (flight_id,flight_date,from_location,to_destination,jet_id,duration) values ( "${flight_id}","${flight_date}", "${from_destination}", "${to_destination}", "${jet_id}", "${duration}")`,
			(err, result) => {
				if (err) throw err;
				res.send(result);
			}
		);
	} catch (error) {
		console.log(error);
	}
});
router.delete("/:id", (req, res) => {
	try {
		con.query(
			`Delete from orders WHERE flight_id= ${req.params.id}`,
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
