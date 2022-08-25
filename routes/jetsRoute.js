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
			`SELECT * FROM jets where jet_id= ${req.params.id} `,
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
		let sql = "SELECT * FROM jets WHERE ? ";
		let jet = { jet_id: req.params.id };
		con.query(sql, jet, (err, result) => {
			if (err) throw err;
			if (result.length !== 0) {
				let updateSql = `UPDATE jets SET ? WHERE jet_id = ${req.params.id}`;
				let updateUser = {
					jet_id: req.body.jet_id,
					jet_name: req.body.jet_name,
					jet_type: req.body.jet_type,
				};
				con.query(updateSql, updateUser, (err, updated) => {
					if (err) throw err;
					res.send("Successfully updated Jet");
				});
			} else {
				res.send("Jet not found");
			}
		});
	} catch (error) {
		console.log(error);
	}
});
router.delete("/:id", (req, res) => {
	try {
		con.query(
			`Delete from jets WHERE jet_id= ${req.params.id}`,
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
