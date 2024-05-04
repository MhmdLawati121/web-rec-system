const express = require("express");
const path = require("path");
const router = express.Router();
const pool = require("../database/db");

router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "dashboardHr.html"));
});

router.get("/jobsAwaitingApproval", async (req, res) => {
  try {

    const response = await pool.query(`SELECT jobs.*, accounts.email FROM jobs INNER JOIN accounts ON jobs.recruiter = accounts.userid WHERE approval = false`);
    if (response.rowCount > 0) {
      res.status(201).json({ message: "Successful query", data: response.rows });
    }
    else {
      res.status(200).json({ message: "Jobs cannot be retrieved" });
    }

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
})

router.get("/jobDetailsForApproval", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "jobDetailsForApproval.html"))
})

router.post("/approveJob", async (req, res) => {
  const jobId = req.query.jobId;
  try {
    const response = await pool.query('UPDATE jobs SET approval = true WHERE jobid = $1', [jobId]);
    if (response.rowCount > 0)
      res.status(201).json({ message: "job posting has been approved" });
    else
      res.status(400).json({ message: "job posting has failed to approve" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
})

router.get("/nonAcademicOmani", async (req, res) => {
  try {
    const response = await pool.query(`
    SELECT applications.appid, applications.jobid, profiles.*, accounts.email,
    jobs.title, jobs.college
    FROM profiles INNER JOIN
    applications ON 
    applications.userid=profiles.userid 
    INNER JOIN
    accounts ON
    applications.userid=accounts.userid 
    INNER JOIN
    jobs ON
    applications.jobid=jobs.jobid
    WHERE applications.hr_approval=false;`)
    if (response.rowCount > 0)
      res.status(200).json({ message: "Successful query", data: response.rows });
    else
      res.status(200).json({ message: "No entries found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
})

router.post("/approveApplication", async (req, res) => {
  const appId = req.query.appId;
  try {
    const response = await pool.query(`UPDATE applications SET hr_approval=true WHERE
    appid = $1`, [appId]);
    if (response.rowCount > 0)
      res.status(200).json({ message: "Successfully approved application" });
    else
      res.status(200).json({ message: "No entries found" });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
})

router.get("/delegatedTasks", async (req, res) => {
  try {
    const userId = req.session.userId;
    const getEmail = await pool.query(`SELECT email FROM accounts WHERE userid = $1`, [userId]);
    const email = getEmail.rows[0].email;
    const response = await pool.query(`SELECT * FROM delegations WHERE assigned_to=$1 AND completed=false`, [email]);

    if (response.rowCount > 0)
      res.status(200).json({ message: "Delegations obtained", data: response.rows });
    else
      res.status(200).json({ message: "No delegations found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
})


router.get("/completeTask", async (req, res) => {
  const taskId = req.query.taskId;
  try {
    const response = await pool.query('UPDATE delegations SET completed = true WHERE taskid = $1', [taskId]);
    res.status(200).json({ message: "response obtained" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
})

// Page routing
router.get("/viewJobsAwaitingApproval", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/hrFiles", "jobsAwaitingApproval.html"))
})

router.get("/viewAppsAwaitingApproval", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/hrFiles", "AppsAwaitingApproval.html"))
})

router.get("/viewDelegatedTasks", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/", "delegatedTasks.html"))
})

module.exports = router;
