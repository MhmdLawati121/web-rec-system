const express = require("express");
const path = require("path");
const router = express.Router();
const pool = require("../database/db");
const auth = require("../middleware/auth");
const requireAuth = auth.requireAuth;

router.get('/profile', requireAuth, async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html", "edit-profile.html"))
})

router.post('/updateProfile', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log(req.body);

        const fn = req.body.first_name;
        const sn = req.body.second_name;
        const tn = req.body.third_name;
        const ln = req.body.last_name;
        const dob = req.body.dob;
        const nat = req.body.nationality;
        const cor = req.body.country_of_residence;
        const ms = req.body.marital_status;
        const ge = req.body.gender;
        const cid = req.body.civil_id;

        console.log(fn, sn, tn, ln);
        const response = await pool.query(
            `UPDATE profiles
         SET 
           first_name = $1,
           second_name = $2,
           third_name = $3,
           last_name = $4,
           dob = $5,
           nationality = $6,
           country_of_residence = $7,
           marital_status = $8,
           gender = $9,
           civil_id = $10
         WHERE userid = $11`,
            [fn, sn, tn, ln, dob, nat, cor, ms, ge, cid, userId]
        );

        res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating profile" });
    }
});

module.exports = router;