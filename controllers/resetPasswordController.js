
const nodemailer = require('nodemailer');
const express = require('express');
const pool = require('../database/db');
require('dotenv').config();
const appPassword = process.env.EMAIL; // Your email app password

// Controller for handling password reset requests
async function resetPassword(req, res) {
  const { email } = req.body;
  console.log(email);

  try {
    // Check if the email exists in the database
    const existingUser = await pool.query("SELECT accounts.*, profiles.* from accounts INNER JOIN profiles ON accounts.userid = profiles.userid WHERE email = $1", [email]);

    if (!existingUser.rows[0]) {
      // Respond with an error if the email is not found
      return res.status(400).json({
        success: false,
        message: "Email not found. Please provide a registered email.",
      });
    }

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "recruitment4squ@gmail.com",
        pass: appPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Construct the reset password email
    const newPasswordRoute = "http://localhost:3500/newPassword"; // Update with your route
    const mailOptions = {
      from: "recruitment4squ@gmail.com", // Replace with your email
      to: email,
      subject: "Password Reset Instructions",
      html: `
        <html>
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4285F4;">Password Reset Instructions</h2>
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
              <p>Dear ${existingUser.rows[0].first_name} ${existingUser.rows[0].last_name},</p>
              <p>We trust this message finds you in good health. We have recently received a request to reset the password associated with your account. If you did not initiate this request, please disregard this email.</p>
              <p>If you did request a password reset, kindly click on the link below to create a new password:
                <a href="${newPasswordRoute}">here</a>
              </p>
              <p>Thank you for your attention to this matter.</p>
            </div>
          </body>
        </html>
      `,
    };

    // Send the reset password email
    await transporter.sendMail(mailOptions);

    // Respond with success message on successful password reset
    res.json({
      success: true,
      message: "Password reset instructions sent to your email.",
    });
  } catch (error) {
    // Handle any unexpected errors during the password reset process
    console.error("Error during password reset:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during password reset.",
    });
  }
}

// Function to capitalize the first letter of a string
function capitalizeName(name) {
  return name.split(' ').map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');
}

// Export the resetPassword function for external use
module.exports = resetPassword;
