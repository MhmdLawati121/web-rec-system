const express = require("express");
const path = require("path");
const registrationController = require("../controllers/registerController");
const router = express.Router();
const pool = require("../database/db");
const auth = require("../middleware/auth");
const nodemailer = require('nodemailer');
require('dotenv').config();
const appPassword = process.env.EMAIL; // Your email app password
const requireAuth = auth.requireAuth;
const requireAdmin = auth.requireAdmin;

/* router.get("/appData", async (req, res) => {
  const jobId = req.query.jobId;
  const appRows = await pool.query(`SELECT * FROM applications WHERE jobid = $1`, [jobId]);
  const jobRows = await pool.query(`SELECT * FROM jobs WHERE jobid = $1`, [jobId]);
  res.status(200).json({ message: "AppData ok", appData: appRows.rows, jobData: jobRows.rows });
}); */

router.get("/appData", async (req, res) => {
  try {
    const jobId = req.query.jobId;

    // Check if jobId is provided
    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required." });
    }

    // Query for application data
    const appRows = await pool.query(`SELECT * FROM applications WHERE jobid = $1`, [jobId]);
    if (appRows.rowCount === 0) {
      return res.status(404).json({ error: "No applications found for the provided job ID." });
    }

    // Query for job data
    const jobRows = await pool.query(`SELECT * FROM jobs WHERE jobid = $1`, [jobId]);
    if (jobRows.rowCount === 0) {
      return res.status(404).json({ error: "No job found for the provided job ID." });
    }

    // Send response with data
    res.status(200).json({ message: "AppData ok", appData: appRows.rows, jobData: jobRows.rows });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error retrieving app data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* router.get("/detailedAppData", async (req, res) => {
  const appId = req.query.appId;
  console.log(appId);
  const appRows = await pool.query(`SELECT * FROM applications WHERE appid = $1`, [appId]);
  res.status(200).json({ message: "Detailed AppData ok", appData: appRows.rows });
});
 */
router.get("/detailedAppData", async (req, res) => {
  try {
    const appId = req.query.appId;

    // Check if appId is provided
    if (!appId) {
      return res.status(400).json({ error: "Application ID is required." });
    }

    // Query for detailed application data
    const appRows = await pool.query(`SELECT * FROM applications WHERE appid = $1`, [appId]);

    // Check if application data is found
    if (appRows.rowCount === 0) {
      return res.status(404).json({ error: "No application found for the provided ID." });
    }

    // Send response with data
    res.status(200).json({ message: "Detailed AppData ok", appData: appRows.rows });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error retrieving detailed app data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* router.get("/appPersonalData", async (req, res) => {
  try {
    const jobId = req.query.jobId;
    const appRows = await pool.query(`
      SELECT 
        applications.appid, 
        profiles.first_name, 
        profiles.last_name, 
        accounts.email, 
        profiles.phone, 
        scores.assessment_score,
        scores.score,
        applications.hr_approval,
        applications.status
      FROM 
        applications 
        JOIN accounts ON applications.userid = accounts.userid 
        JOIN profiles ON applications.userid = profiles.userid
        JOIN scores ON applications.appid = scores.appid
      WHERE 
        applications.jobid = $1
    `, [jobId]);

    console.log(appRows.rows);
    res.status(200).json({ message: "AppData ok", appPersonalData: appRows.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching appPersonalData" });
  }
});
 */

router.get("/appPersonalData", async (req, res) => {
  try {
    const jobId = req.query.jobId;

    // Check if jobId is provided
    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required." });
    }

    // Query for application personal data
    const appRows = await pool.query(`
      SELECT 
        applications.appid, 
        applications.userid,
        profiles.first_name, 
        profiles.last_name, 
        accounts.email, 
        profiles.phone, 
        scores.assessment_score,
        scores.score,
        applications.hr_approval,
        applications.status
      FROM 
        applications 
        JOIN accounts ON applications.userid = accounts.userid 
        JOIN profiles ON applications.userid = profiles.userid
        JOIN scores ON applications.appid = scores.appid
      WHERE 
        applications.jobid = $1
    `, [jobId]);

    // Check if application personal data is found
    if (appRows.rowCount === 0) {
      return res.status(404).json({ error: "No application personal data found for the provided job ID." });
    }

    // Send response with data
    res.status(200).json({ message: "AppData ok", appPersonalData: appRows.rows });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error fetching appPersonalData:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/myJobs", async (req, res) => {
  try {
    const userId = req.session.userId;

    // Check if userId is available in session
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID is missing in session." });
    }

    // Query for jobs associated with the recruiter
    const myJobs = await pool.query(`SELECT * FROM jobs WHERE recruiter = $1`, [userId]);

    let totalApps = 0;
    let appsToday = 0;
    const today = new Date();

    // Iterate over each job to count applications
    for (let i = 0; i < myJobs.rows.length; i++) {
      // Query for applications associated with the job
      const result = await pool.query(`SELECT * FROM applications WHERE jobid = $1`, [myJobs.rows[i].jobid]);

      // Count total applications and applications submitted today
      for (let j = 0; j < result.rows.length; j++) {
        totalApps++;
        const givenDate = new Date(result.rows[j].subdate);
        if (givenDate.toDateString() === today.toDateString()) {
          appsToday++;
        }
      }
    }

    // Send response with data
    res.status(200).json({ myJobs: myJobs.rows, totalApps: totalApps, appsToday: appsToday });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error fetching myJobs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* router.get("/myJobs", async (req, res) => {
  const userId = req.session.userId;
  const myJobs = await pool.query(`SELECT * FROM jobs WHERE recruiter = $1`, [userId]);
  let totalApps = 0;
  let appsToday = 0;
  const today = new Date();
  for (let i = 0; i < myJobs.rows.length; i++) {
    const result = await pool.query(`SELECT * FROM applications WHERE jobid = $1`, [myJobs.rows[i].jobid]);
    for (let i = 0; i < result.rows.length; i++) {
      totalApps++;
      const givenDate = new Date(result.rows[i].subdate);
      if (givenDate.toDateString() === today.toDateString())
        appsToday++;
    }
  }
  res.status(200).json({ myJobs: myJobs.rows, totalApps: totalApps, appsToday: appsToday });
}) */


router.get("/jobData", (req, res) => {
  console.log("request received");
  let query;
  const jobId = req.query.jobId;

  // Check if jobId is provided
  if (jobId === undefined) {
    query = "SELECT * FROM jobs WHERE approval = true"
    pool.query(query, (err, results) => {
      handleQueryResults(err, results, res);
    });
  } else {
    query = "SELECT * FROM jobs WHERE jobid = $1";
    pool.query(query, [jobId], (err, results) => {
      handleQueryResults(err, results, res);
    });
  }
});

function handleQueryResults(err, results, res) {
  if (err) {
    console.error("Database Query Error: ", err);
    res.status(500).send("Error fetching data from database");
  } else {
    res.json(results.rows);
  }
}

router.get("/sessionData", (req, res) => {
  res.status(200).json({ sessionId: req.session.userId, role: req.session.role });
});


/* router.get("/userData", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    // Fetch user data with first_name and last_name from the profiles table
    const userData = await pool.query(`
      SELECT 
        accounts.email, 
        accounts.role, 
        accounts.head, 
        profiles.first_name, 
        profiles.last_name 
      FROM 
        accounts 
        JOIN profiles ON accounts.userid = profiles.userid
      WHERE 
        accounts.userid = $1
    `, [userId]);

    // Extract required data from the query result
    const { email, role, head, first_name, last_name } = userData.rows[0];

    let applications = [];

    // If the user is a 'user' role, fetch their applications
    if (role === 'user') {
      const userApplications = await pool.query("SELECT * FROM applications WHERE userid = $1", [userId]);
      applications = userApplications.rows;
    }

    // Construct the full name
    const name = `${first_name} ${last_name}`;

    // Send response
    res.status(200).json({ message: "Data has been retrieved successfully", email, role, head, name, applications });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving user data" });
  }
});
 */
router.get("/userData", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    // Check if userId is available in session
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID is missing in session." });
    }

    // Fetch user data with first_name and last_name from the profiles table
    const userData = await pool.query(`
      SELECT 
        accounts.email, 
        accounts.role, 
        accounts.head, 
        profiles.first_name, 
        profiles.last_name 
      FROM 
        accounts 
        JOIN profiles ON accounts.userid = profiles.userid
      WHERE 
        accounts.userid = $1
    `, [userId]);

    // Check if user data is found
    if (userData.rows.length === 0) {
      return res.status(404).json({ error: "User data not found for the provided user ID." });
    }

    // Extract required data from the query result
    const { email, role, head, first_name, last_name } = userData.rows[0];

    let applications = [];

    // If the user is a 'user' role, fetch their applications
    if (role === 'user') {
      const userApplications = await pool.query("SELECT * FROM applications WHERE userid = $1", [userId]);
      applications = userApplications.rows;
    }

    // Construct the full name
    const name = `${first_name} ${last_name}`;

    // Send response
    res.status(200).json({ message: "Data has been retrieved successfully", email, role, head, name, applications });

  } catch (error) {
    // Handle any unexpected errors
    console.error("Error retrieving user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* router.get("/userAppData", requireAuth, async (req, res) => {
  const userId = req.session.userId;
  try {
    const appData = await pool.query("SELECT * FROM applications WHERE userid = $1", [userId]);
    const appDataRows = appData.rows[0];
    const jobid = appDataRows.jobid;
    const jobData = await pool.query("SELECT * FROM jobs WHERE jobid = $1", [jobid]);
    res.status(200).json({ message: "application data sent", status: appDataRows.status, title: jobData.rows[0].title, college: jobData.rows[0].college, date: appDataRows.subdate, appid: appDataRows.appid });
  }
  catch (error) {
    console.log("User has no applications");
  }
}) */

router.get("/userAppData", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    // Check if userId is available in session
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID is missing in session." });
    }

    // Fetch user's application data
    const appData = await pool.query("SELECT * FROM applications WHERE userid = $1", [userId]);

    let newDataArray = [];
    // Check if user has any applications
    if (appData.rows.length === 0) {
      return res.status(404).json({ error: "User has no applications." });
    }

    for (let dataRow of appData.rows) {
      const jobid = dataRow.jobid;

      const jobData = await pool.query("SELECT * FROM jobs WHERE jobid = $1", [jobid]);
      const newData = {
        message: "Application data sent",
        status: dataRow.status,
        title: jobData.rows[0].title,
        college: jobData.rows[0].college,
        date: dataRow.subdate,
        appid: dataRow.appid
      }
      newDataArray.push(newData);
    }
    res.status(200).json(newDataArray);
  }
  catch (error) {
    // Handle any unexpected errors
    console.error("Error fetching user application data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* router.get('/getProfileData', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  try {
    const response = await pool.query(`
  SELECT profiles.*, accounts.email 
  FROM profiles 
  INNER JOIN accounts ON profiles.userid = accounts.userid 
  WHERE profiles.userid = $1
`, [userId]);

    console.log(response.rows[0]);
    res.status(200).json({ success: true, message: "successfully retrieved data", data: response.rows[0] });
  }
  catch (err) {
    res.status(404).json({ message: "Error" });
  }
})
 */
router.get('/getProfileData', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    // Check if userId is available in session
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID is missing in session." });
    }

    // Fetch user profile data
    const response = await pool.query(`
      SELECT profiles.*, accounts.email 
      FROM profiles 
      INNER JOIN accounts ON profiles.userid = accounts.userid 
      WHERE profiles.userid = $1
    `, [userId]);

    // Check if profile data is found
    if (response.rows.length === 0) {
      return res.status(404).json({ error: "Profile data not found for the provided user ID." });
    }

    console.log(response.rows[0]);
    res.status(200).json({ success: true, message: "Successfully retrieved data", data: response.rows[0] });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error retrieving profile data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post('/appToUserId', async (req, res) => {
  try {
    // Ensure that the request body contains the required data
    if (!req.body.appid) {
      return res.status(400).json({ message: 'Missing appid in request body' });
    }

    // Retrieve userId from the database based on the appid
    const response = await pool.query('SELECT userid FROM applications WHERE appid = $1', [req.body.appid]);

    // Check if the query returned any results
    if (response.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Send the userId in the response
    res.status(200).json({ message: "Success", userId: response.rows[0].userid });
  } catch (error) {
    console.error('Error in /appToUserId route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/appToEmail', async (req, res) => {
  try {
    // Ensure that the request body contains the required data
    if (!req.body.appid) {
      return res.status(400).json({ message: 'Missing appid in request body' });
    }

    // Retrieve userId from the database based on the appid
    const response = await pool.query(`
    SELECT accounts.email, 
    profiles.first_name, 
    profiles.last_name,
    jobs.title,
    applications.status
    FROM profiles INNER JOIN applications ON 
    profiles.userid = applications.userid 
    INNER JOIN jobs ON
    jobs.jobid = applications.jobid
    INNER JOIN accounts ON
    accounts.userid = applications.userid
    WHERE appid = $1`, [req.body.appid]);

    // Check if the query returned any results
    if (response.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Send the userId in the response
    res.status(200).json({ message: "Success", email: response.rows[0].email });
    const email = response.rows[0].email
    const title = response.rows[0].title
    const status = response.rows[0].status
    const first_name = response.rows[0].first_name
    const last_name = response.rows[0].last_name

    if (status.toLowerCase() !== "pending") {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "recruitment4squ@gmail.com",
          pass: appPassword,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Email content
      const mailOptions = {
        from: 'recruitment4squ@gmail.com',
        to: email,
        subject: 'Application Status Update',
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <p>Hi ${first_name} ${last_name},</p>
        <p>Your application for the position: ${title} has been reviewed</p>
        <p>Your application has been ${status}</p>
        </div>  
        <p style="margin-top: 15px;">Best regards and good luck,<br>SQU Recruitment Team</p>
      </div>
    `,
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;