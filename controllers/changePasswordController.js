// change password controller.js
// Importing the bcrypt library for password hashing and the database connection pool
const bcrypt = require('bcrypt');
const pool = require('../database/db');

async function changePassword(req, res) {
    const { currentPassword, NewPassword, ConfirmPassword } = req.body;

    if (!currentPassword || !NewPassword || !ConfirmPassword) {

        return res.status(400).json({ message: "Missing fields" });

    } else if (NewPassword !== ConfirmPassword) {

        return res.status(400).json({ message: "Passwords do not match" });
    }

    let userId = req.session.userId;

    try {
        // Retrieving the user's current hashed password from the database
        const result = await pool.query(
            "SELECT password FROM accounts WHERE userid = $1",
            [userId],
            async (error, results) => {
                if (error) {
                    // Handling database query error
                    console.error("Error executing query", error);
                    return res
                        .status(500)
                        .json({ success: false, message: "Internal Server Error" });
                }

                // Check if any results were returned
                if (!results.rows || results.rows.length === 0) {
                    return res
                        .status(404)
                        .json({ success: false, message: "User not found" });
                }

                // Check if the current password matches the stored hashed password
                const storedHashedPassword = results.rows[0].password;
                if (!storedHashedPassword) {
                    return res
                        .status(500)
                        .json({ success: false, message: "Error retrieving password" });
                }

                // Comparing the entered current password with the stored hashed password
                const passwordMatch = await bcrypt.compare(
                    currentPassword,
                    storedHashedPassword
                );

                if (!passwordMatch) {
                    // Return unauthorized status if passwords don't match
                    return res
                        .status(401)
                        .json({ success: false, message: "Incorrect current password" });
                }

                // Hashing the new password before updating it in the database
                const hashedPassword = await bcrypt.hash(NewPassword, 10);

                // Updating the password in the database
                await pool.query(
                    "UPDATE accounts SET password = $1 WHERE userid = $2",
                    [hashedPassword, userId],
                    (updateError) => {
                        if (updateError) {
                            // Handling error while updating password
                            console.error("Error updating password", updateError);
                            return res
                                .status(500)
                                .json({ success: false, message: "Internal Server Error" });
                        }

                        // Sending success response if password is updated successfully
                        res.json({
                            success: true,
                            message: "Password changed successfully",
                        });
                    }
                );
            }
        );
    } catch (error) {
        // Handling any unexpected errors
        console.error("Error changing password", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Exporting the changePassword function for use in other parts of the application
module.exports = changePassword;
