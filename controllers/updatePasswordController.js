
const bcrypt = require('bcrypt');
const pool = require('../database/db');
require('dotenv').config();
const appPassword = process.env.EMAIL; // Your email app password
const nodemailer = require('nodemailer');

async function updatePassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const existingUser = await pool.query("SELECT accounts.*, profiles.* FROM profiles INNER JOIN accounts ON accounts.userid = profiles.userid WHERE email = $1", [email]);

    if (existingUser.rows.length === 0) {
      // Respond with an error if the user is not found
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update the user's password in the database
    await pool.query("UPDATE accounts SET password = $1 WHERE email = $2", [hashedPassword, email]);


    // Send email notification
    const resetPasswordRoute = "http://localhost:3000/resetPassword.html";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "recruitment4squ@gmail.com", // Replace with your email
        pass: appPassword, // Replace with your email app password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: "recruitment4squ@gmail.com", // Replace with your email
      to: email,
      subject: "Your Password Was Changed",
      html: `
        <html>
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4285F4;">Your Password Was Changed</h2>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                padding: 20px;
              }

              .email-container {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }

              h5 {
                color: #4285F4;
              }

              p {
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <p>Dear ${capitalizeName(existingUser.rows[0].first_name)} ${capitalizeName(existingUser.rows[0].last_name)},</p>
              <p>Your password for the account ${email} was changed. If you didn't change it, you should recover your account <a href="${resetPasswordRoute}">here</a>.</p>
              <p>Thank you for your attention to this matter.</p>
            </div>
          </body>
        </html>
      `,
    };

    // Function to capitalize the first letter of a string
    function capitalizeName(name) {
      return name.split(' ').map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');
    }

    await transporter.sendMail(mailOptions);

    // Respond with success message on password update
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // Handle any unexpected errors during the password update process
    console.error(error);
    res.status(400).json({ success: false, message: "Password update failed" });
  }
}

// Export the updatePassword function for external use
module.exports = updatePassword;
