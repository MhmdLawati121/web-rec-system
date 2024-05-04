const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const pool = require("../database/db");

// Specify the destination folder for uploads
const uploadDestination = 'uploads/';

// Check if the destination directory exists, create it if not
if (!fs.existsSync(uploadDestination)) {
    fs.mkdirSync(uploadDestination);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Change './resumes' to your desired path
    },
    filename: (req, file, cb) => {
        console.log("Filename", req.session.userId);
        cb(null, req.session.userId + '.pdf');
    }
});

const upload = multer({ storage: storage });



router.post('/submitApplication', upload.none(), async (req, res) => {
    // TODO:
    // Fix professional skills submission
    // Date of Error: 03/03/24
    // FIX: Test more later
    try {
        const jobId = req.body.jobId;
        const body = JSON.parse(req.body.data);

        // Check if non-academic and Omani
        const isOmani = await pool.query(`SELECT nationality FROM profiles WHERE userid = $1`, [req.session.userId]);
        const isAcademic = await pool.query(`SELECT category FROM jobs WHERE jobid = $1`, [jobId]);
        let hrApprovalReq = false;
        if (isOmani.rows[0].nationality === "Omani" && isAcademic.rows[0].category === "Non-Academic")
            hrApprovalReq = true;

        console.log("HRApproval? ", hrApprovalReq);
        const currentDate = new Date().toISOString().slice(0, 10);
        let result;
        if (hrApprovalReq) {
            result = await pool.query(`INSERT INTO applications (userid, jobid, subdate, hr_approval) VALUES ($1, $2, $3, $4) RETURNING appid`, [req.session.userId, jobId, currentDate, false]);
        }
        else {
            result = await pool.query(`INSERT INTO applications (userid, jobid, subdate) VALUES ($1, $2, $3) RETURNING appid`, [req.session.userId, jobId, currentDate]);
        }
        const appId = result.rows[0].appid;
        const addScoreEntry = await pool.query(`INSERT INTO scores (appid) VALUES ($1)`, [appId]);
        const academicQualifications = (body && body.academicQualifications) || [];
        const employmentHistory = (body && body.employmentHistory) || [];
        const professionalSkills = (body && body.professionalSkills) || [];
        const awardsAndHonors = (body && body.awardsAndHonors) || [];


        console.log(academicQualifications);
        if (academicQualifications.length !== 0) {
            const aq_level = [], aq_title = [], aq_major = [], aq_university = [], aq_country = [], aq_gradyear = [];
            for (let i = 0; i < academicQualifications.length; i++) {
                aq_level.push(academicQualifications[i][0]);
                aq_title.push(academicQualifications[i][1]);
                aq_major.push(academicQualifications[i][2]);
                aq_university.push(academicQualifications[i][3]);
                aq_country.push(academicQualifications[i][4]);
                aq_gradyear.push(parseInt(academicQualifications[i][5], 10));
            }
            const result = await pool.query(`UPDATE applications 
        SET aq_level = $1, aq_title = $2, aq_major = $3, aq_university = $4, aq_country = $5, aq_gradyear = $6
        WHERE userid = $7 AND jobid = $8;`,
                [aq_level, aq_title, aq_major, aq_university, aq_country, aq_gradyear, req.session.userId, jobId]);
        }

        if (employmentHistory.length !== 0) {
            const eh_employer = [], eh_title = [], eh_location = [], eh_start = [], eh_end = [];
            for (let i = 0; i < employmentHistory.length; i++) {
                eh_employer.push(employmentHistory[i][0]);
                eh_title.push(employmentHistory[i][1]);
                eh_location.push(employmentHistory[i][2]);
                let startDate = new Date(employmentHistory[i][3]);
                startDate = startDate.toISOString().split('T')[0];
                let endDate = new Date(employmentHistory[i][4]);
                endDate = endDate.toISOString().split('T')[0];
                eh_start.push(startDate);
                eh_end.push(endDate);
            }
            const result = await pool.query(`UPDATE applications 
        SET eh_employer = $1, eh_title = $2, eh_location = $3, eh_start = $4, eh_end = $5
        WHERE userid = $6 AND jobid = $7;`,
                [eh_employer, eh_title, eh_location, eh_start, eh_end, req.session.userId, jobId]);
        }

        if (professionalSkills.length !== 0) {
            const ps_title = [], ps_experience = [], ps_lastused = [];
            for (let i = 0; i < professionalSkills.length; i++) {
                ps_title.push(professionalSkills[i][0]);
                ps_experience.push(professionalSkills[i][1]);
                ps_lastused.push(professionalSkills[i][2]);
            }
            const result = await pool.query(`UPDATE applications 
        SET ps_skill = $1, ps_experience = $2, ps_lastused = $3 
        WHERE userid = $4 AND jobid = $5;`,
                [ps_title, ps_experience, ps_lastused, req.session.userId, jobId]);
        }

        if (awardsAndHonors.length !== 0) {
            const ah_title = [], ah_level = [], ah_type = [], ah_inst = [], ah_year = [];
            for (let i = 0; i < awardsAndHonors.length; i++) {
                ah_title.push(awardsAndHonors[i][0]);
                ah_level.push(awardsAndHonors[i][1]);
                ah_type.push(awardsAndHonors[i][2]);
                ah_inst.push(awardsAndHonors[i][3]);
                ah_year.push(awardsAndHonors[i][4]);
            }
            const result = await pool.query(`UPDATE applications 
        SET ah_title = $1, ah_level = $2, ah_type = $3, ah_inst = $4, ah_year = $5
        WHERE userid = $6 AND jobid = $7;`,
                [ah_title, ah_level, ah_type, ah_inst, ah_year, req.session.userId, jobId]);
        }
        const quiz = await pool.query(`SELECT * FROM assessments WHERE jobid = $1`, [jobId]);
        if (quiz.rows.length > 0)
            res.redirect(`/assessment/take-assessment?jobId=${jobId}&appId=${appId}`);
        else
            res.redirect(`${req.session.role}/dashboard`);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "internal server error" });
    }
})

router.post('/upload', upload.single('resume'), (req, res) => {
    if (req.resume) {
        res.json({ message: 'File uploaded successfully!' });
    } else {
        res.status(400).json({ message: 'No file uploaded!' });
    }
});

router.get('/download', (req, res) => {
    const fileName = req.query.userId + '.pdf';

    // Construct the file path
    const filePath = path.join(__dirname, '../uploads', fileName);
    console.log(filePath);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            return res.status(404).json({ message: 'File not found' });
        }
        const fileStream = fs.createReadStream(filePath);
        res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
        fileStream.pipe(res);
    });
});

module.exports = router;