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
router.patch("/:id", (req, res) => {
	try {
		let sql = "SELECT * FROM flights WHERE ? ";
		let flight = { flight_id: req.params.id };
		con.query(sql, flight, (err, result) => {
			if (err) throw err;
			if (result.length !== 0) {
				let updateSql = `UPDATE flights SET ? WHERE flight_id = ${req.params.id}`;
				let updateUser = {
					flight_id: req.body.flight_id,
					flight_date: req.body.flight_date,
					from_destination: req.body.from_destination,
					to_destination: req.body.to_destination,
					jet_id: req.body.jet_id,
					duration: req.body.duration,
				};
				con.query(updateSql, updateUser, (err, updated) => {
					if (err) throw err;
					res.send("Successfully updated Flight Details");
				});
			} else {
				res.send("Flight not found");
			}
		});
	} catch (error) {
		console.log(error);
	}
});
router.delete("/:id", (req, res) => {
	try {
		con.query(
			`Delete from flights WHERE flight_id= ${req.params.id}`,
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
