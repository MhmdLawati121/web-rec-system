const bcrypt = require("bcrypt");
const pool = require("../database/db");
const nodemailer = require('nodemailer');
require('dotenv').config();
const appPassword = process.env.EMAIL; // Your email app password
const geoip = require('geoip-lite');
const uaParser = require('ua-parser-js');

const login = async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
  try {
    const emailExists = await pool.query(
      "SELECT * FROM accounts WHERE email = $1",
      [email]
    );

    if (emailExists.rows.length > 0) {
      const user = emailExists.rows[0];

      // Check if the account is locked due to too many failed attempts
      if (user.failed_login_attempts >= 3 && Date.now() - user.last_login_attempt < 300000) {
        return res.status(401).json({
          success: false,
          message: "Account is temporarily locked. Please try again later.",
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // Reset failed login attempts on successful login
        await pool.query(
          "UPDATE accounts SET failed_login_attempts = 0, last_login_attempt = null WHERE userid = $1",
          [user.userid]
        );

        // Check if user session exists and set the user ID
        req.session.userId = user.userid;
        req.session.role = user.role;
        req.session.head = user.head;
        res.redirect(`${user.role}/dashboard`);

        // Notify user about the login and send device details via email
        sendLoginAlertEmail(user.email, user.first_name, user.last_name, req);

        // Respond with success and user information
      }
      else {
        // Increment failed login attempts and update last login attempt timestamp
        const currentTimestamp = new Date().getTime();
        await pool.query(
          "UPDATE accounts SET failed_login_attempts = failed_login_attempts + 1, last_login_attempt = to_timestamp($1 / 1000.0) WHERE userid = $2",
          [currentTimestamp, user.userid]
        );

        if (user.failed_login_attempts >= 2) {
          // Lock the account for 5 minutes
          await pool.query(
            "UPDATE accounts SET last_login_attempt = to_timestamp($1 / 1000.0) WHERE userid = $2",
            [currentTimestamp, user.userid]
          );

          return res.status(401).json({
            success: false,
            message: "Account is temporarily locked. Please try again later.",
          });
        } else {
          // Respond with failure due to invalid credentials
          res.status(401).json({ success: false, message: "Invalid credentials" });
        }
      }
    }
    else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    // Handle any unexpected errors during the login process
    console.error("Error during login:", error);
    res.status(400).json({ success: false, message: "Invalid credentials" });
  }
}

/** LOGIN ALERT EMAIL */
function sendLoginAlertEmail(email, first_name, last_name, req) {

  let ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  ipAddress = ipAddress.replace('::ffff:', '');
  const userAgent = req.get('User-Agent');
  const parsedUserAgent = uaParser(userAgent);
  const geoData = geoip.lookup(ipAddress);

  const deviceDetails = {
    ipAddress,
    userAgent,
    browser: `${parsedUserAgent.browser.name} ${parsedUserAgent.browser.version}`,
    os: `${parsedUserAgent.os.name} ${parsedUserAgent.os.version}`,
  };

  // Nodemailer setup
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

  // change url ::
  const resetPasswordRoute = "http://localhost:3500/edit-profile.html";


  // Email content
  const mailOptions = {
    from: 'recruitment4squ@gmail.com',
    to: email,
    subject: 'Login Alert',
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #4285F4;">Login Alert</h2>
      <p>Hi ${first_name} ${last_name},</p>
      <p>Your account ${email} was just accessed from a new device.</p>
      <div style="border: 1px solid #ddd; border-radius: 8px; padding: 10px; margin-top: 15px;">
        <p><strong>Device Details:</strong></p>
        <p><strong>IP Address:</strong> ${deviceDetails.ipAddress}</p>
        <p><strong>Device:</strong> ${deviceDetails.userAgent}</p>
        <p><strong>Browser:</strong> ${deviceDetails.browser}</p>
        <p><strong>Operating System:</strong> ${deviceDetails.os}</p>
      </div>
      <p>If this was you, you can ignore this email.</p>
      <p>If you don't recognize this activity, please <a href="${resetPasswordRoute}" class="link">reset your password</a></p>

      <p style="margin-top: 15px;">Best regards,<br>SQU Recruitment Team</p>
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

module.exports = { login };
