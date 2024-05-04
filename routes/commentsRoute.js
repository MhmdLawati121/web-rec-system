const express = require("express");
const path = require("path");
const router = express.Router();
const pool = require("../database/db");
const auth = require("../middleware/auth");

router.post('/postComment', auth.requireAdminOrHr, async (req, res) => {
    console.log(req.body)
    const comment = req.body.comment;
    const appId = req.query.appId;
    const userId = req.session.userId;

    const response = await pool.query(`SELECT first_name, last_name FROM profiles WHERE userid = $1`, [userId]);
    const name = response.rows[0].first_name + ' ' + response.rows[0].last_name;

    const post = await pool.query(`INSERT INTO comments (appid, commenter_name, comment_text) 
    VALUES  ($1, $2, $3)`, [appId, name, comment]);

    res.status(200).json({ message: 'Comment posted successfully!' });

})

router.get('/getComments', auth.requireAdminOrHr, async (req, res) => {
    const appId = req.query.appId;
    const response = await pool.query('SELECT * FROM comments WHERE appid = $1', [appId]);
    res.status(200).json({ response: response });
})

module.exports = router;
