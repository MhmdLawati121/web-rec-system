const express = require("express");
const path = require("path");
const router = express.Router();
const pool = require("../database/db");
const { requireHead } = require("../middleware/auth");

router.get("/add", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "jobapplication.html"));
});

router.post("/add", async (req, res) => {
  const form = req.body;
  if (!form.title || !form.college || !form.openingDate || !form.closingDate || !form.jobCategory) {
    return res.status(400).json({ error: "Missing required fields in the form data" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO jobs (title, college, spec, opening, closing, category, details, experience, qualification, duties, requirements, certificates, benefits, type, recruiter) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING jobid`,
      [
        form.title,
        form.college,
        form.specialization,
        form.openingDate,
        form.closingDate,
        form.jobCategory,
        form.details,
        form.experience,
        form.qualification,
        form.duties,
        form.requirements,
        form.certificates,
        form.benefits,
        form.type,
        req.session.userId
      ]
    );

    const jobId = result.rows[0].jobid; // Extract the job ID from the result

    res.status(200).json({ message: "Job application form successfully received", id: jobId });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "An error occurred while saving the job application form" });
  }
});

router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "adminDashboard.html"));
});

router.post("/add-recruiter", requireHead, async (req, res) => {
  const username = req.body.recruiterUsername;
  if (req.session.role !== 'admin') {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  try {
    const update = await pool.query("UPDATE accounts SET role = 'admin' WHERE email = $1 RETURNING userid", [username]);
    if (update.rows.length === 0) {
      res.status(404).json({ error: `User '${username}' not found` });
      return;
    }
    console.log(update.rows[0]);
    res.status(200).json({ message: `${username} successfully added as recruiter` });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Database server error" });
  }
}
);

router.post('/delegate', async (req, res) => {
  const request = req.body;
  const jobId = req.query.jobId;
  if (!jobId || !request.appids || !Array.isArray(request.appids) || request.appids.length === 0 ||
    !request.task_description || !request.assigned_to) {
    return res.status(400).json({ error: "Missing or invalid parameters for delegation" });
  }
  for (const id of request.appids) {
    try {
      // Check if there's already an entry with the same appid and assigned_to
      const existingEntry = await pool.query(`SELECT COUNT(*) FROM delegations 
                                              WHERE appid = $1 AND assigned_to = $2`, [id, request.assigned_to]);

      const existingCount = existingEntry.rows[0].count;
      console.log(existingEntry.rows);
      console.log(existingCount);

      const userAccount = await pool.query(`SELECT email FROM accounts WHERE userid = $1`, [req.session.userId]);
      const assignedByEmail = userAccount.rows[0].email;

      // If no existing entry found, insert into the delegations table
      if (!parseInt(existingCount, 10)) {
        const response = await pool.query(`INSERT INTO delegations (appid, jobid, task_description, assigned_by, assigned_to) 
                                          VALUES ($1, $2, $3, $4, $5)`, [id, jobId, request.task_description, assignedByEmail, request.assigned_to]);
        // Handle response if needed
      } else {
        console.log(`Entry with appid ${id} and assigned_to ${request.assigned_to} already exists.`);
      }
    } catch (error) {
      console.error("Error inserting delegation:", error);
      return res.status(500).json({ error: "Internal server error. Failed to delegate tasks." });
    }
  }
  res.status(200).json({ message: "Delegation(s) completed successfully!" })
}
);

router.get('/deleteJobPost', async (req, res) => {
  const jobId = req.query.jobId;
  console.log(jobId);
  try {
    const response = await pool.query('DELETE FROM jobs WHERE jobid=$1', [jobId]);
    res.status(200).json({ message: "entry successfully deleted" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
})

module.exports = router;
