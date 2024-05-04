// setting up express environment
const express = require("express");
const session = require("express-session");
const moment = require("moment")
const app = express();
app.use(require("./database/session"));

const auth = require("./middleware/auth");
const requireAuth = auth.requireAuth;
const requireAdmin = auth.requireAdmin;
const requireHr = auth.requireHr;

// parse form data
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// database
const pool = require("./database/db");

// path
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));


/////////////
// routing //
/////////////
const changePassword = require("./controllers/changePasswordController");

app.get('/changePassword', requireAuth, async (req, res) => {
  res.sendFile(path.join(__dirname, "public/html", "changePassword.html"))
});

app.post('/changePassword', requireAuth, changePassword);


// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html", "index.html"));
});

// User Authentication Routes
app.use("/register", require("./routes/registerRoute"));
app.use("/registration", require("./routes/registerRoute"));
app.use("/login", require("./routes/loginRoute"));
app.use('/logout', require("./routes/logoutRoute"));

app.use('/apr', require("./routes/academicProfileRoute"));

// Information Obtaining Routes
app.use("/getData", require("./routes/dataRoute"));

// Assessment Routes
app.use("/assessment", require("./routes/assessmentRoute"))

// Role-specific Routes
app.use("/user", requireAuth, require("./routes/userRoute"));
app.use("/hr", require("./routes/hrRoute")); // add requireHr middleware
app.use("/admin", requireAdmin, require("./routes/adminRoute"));

// View job details
app.use("/viewDetails", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html", "jobdetails.html"));
});

// View applications
app.use("/viewApps", requireAdmin || requireHr, (req, res) => {
  res.sendFile(path.join(__dirname, "public/html", "viewApplications.html"))
})

// Comments
app.use("/", require("./routes/commentsRoute"));

// Profile 
app.use("/", require("./routes/profileRoute"));

// Application submitting
app.get("/apply", requireAuth, async (req, res) => {
  const userId = req.session.userId;

  const profileResponse = await pool.query(`
    SELECT dob, nationality, country_of_residence, civil_id, gender, phone FROM profiles WHERE
    userid = $1`, [userId]);

  let pData = profileResponse.rows[0];

  // Check if pData is defined and if any of its properties are blank
  if (!pData || !(pData.dob && pData.country_of_residence && pData.nationality && pData.civil_id && pData.phone && pData.gender)) {
    res.sendFile(path.join(__dirname, "public/html", "edit-profile.html"));
    return; // Stop execution to prevent further processing
  }

  const response = await pool.query(`
    SELECT jobs.closing FROM jobs INNER JOIN applications 
    ON jobs.jobid = applications.jobid WHERE applications.userid = $1`, [userId]);

  if (response.rows.length > 0) {
    let allowed = true;
    for (let row of response.rows) {
      const closingDate = moment(row.closing);
      const currentDate = moment();
      if (currentDate.isBefore(closingDate)) {
        allowed = false;
        break; // No need to continue checking if one application is already open
      }
    }
    if (!allowed) {
      res.send("Sorry, you can only apply to one job at a time.");
    } else {
      res.sendFile(path.join(__dirname, "public/html", "submission.html"));
    }
  } else {
    res.sendFile(path.join(__dirname, "public/html", "submission.html"));
  }
});

app.get('/detailedappview', async (req, res) => {
  const appId = req.query.appId;
  const response = await pool.query("SELECT userid, jobid FROM applications WHERE appid = $1", [appId]);
  // const response2 = await pool.query("SELECT recruiter FROM jobs WHERE jobid = $1", [response.rows[0].jobid]);
  // console.log(response.rows[0].jobid);

  res.sendFile(path.join(__dirname, "public/html", "detailedappview.html"));

})

app.use('/', require('./routes/submissionRoute'));

app.post('/updateStatus', async (req, res) => {
  const ids = req.body.ids;
  const status = req.body.status;
  console.log(ids);
  console.log(status);
  const query = `UPDATE applications set status = '${status}' WHERE appid IN (${ids})`
  console.log(query);
  const response = await pool.query(query);
  res.status(200).json({ message: "Status has been updated - please refresh this page" });
})

app.use('/delegation', require('./routes/sharedApplicationsRoute'));

const resetPassword = require('./controllers/resetPasswordController');
app.get("/resetPassword", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html", "resetPassword.html"));
})
app.post("/resetPassword", resetPassword);

// Add newpassword method
app.get('/newPassword', (req, res) => {
  res.sendFile(path.join(__dirname, "public/html", "updateResetPassword.html"))
})

const newPassword = require('./controllers/updatePasswordController')
app.post('/newPassword', newPassword);

// running server
const port = 3500;
const server = app.listen(port, () => {
  console.log("server running");
  console.log(`running on port ${port}`);
});
