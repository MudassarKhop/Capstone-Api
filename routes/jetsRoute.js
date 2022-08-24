const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");

router.get("/", (req, res) => {
	try {
		con.query("SELECT * FROM jets", (err, result) => {
			if (err) throw err;
			res.send(result);
		});
	} catch (error) {
		console.log(error);
	}
});

router.post("/", (req, res) => {
	const { jet_id, jet_name, jet_type } = req.body;
	try {
		con.query(
			`INSERT INTO jets (jet_id, jet_name, jet_type) values ("${jet_id}","${jet_name}","${jet_type}")`,
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
			`SELECT * FROM flight_details where flight_id= ${req.params.id} `,
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
	const { category_id, name, description, thumbnail } = req.body;
	try {
		con.query(
			`UPDATE flight_details SET flight_id="${flight_id}","${flight_departure_date}","${price}" WHERE flight_id= ${req.params.id}`,
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
			`Delete from flight_details WHERE flight_id= ${req.params.id}`,
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
