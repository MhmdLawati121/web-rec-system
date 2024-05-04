const express = require("express");
const path = require("path");
const router = express.Router();
const pool = require("../database/db");


router.get('/getSharedApps', async (req, res) => {
    try {

        const email = await pool.query('SELECT email FROM accounts WHERE userid = $1', [req.session.userId]);
        const response = await pool.query('SELECT * FROM delegations WHERE assigned_to = $1', [email.rows[0].email]);
        res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

module.exports = router;