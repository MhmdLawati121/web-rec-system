const bcrypt = require("bcrypt");
const pool = require("../database/db");

async function checkEmailExists(email) {
  try {
    const result = await pool.query(
      "SELECT * FROM accounts WHERE email = $1",
      [email]
    );
    return result.rows.length > 0; // Return boolean indicating existence
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error; // Re-throw to handle in the calling function
  }
}

const handleNewUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const emailExists = await checkEmailExists(email);
    console.log(emailExists);
    if (emailExists) {
      return res.status(400).json({ success: false, message: "Email is already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO accounts (email, password) VALUES ($1, $2) RETURNING userid",
      [email, hashedPassword]
    );
    const userId = result.rows[0].userid;
    await pool.query(
      "INSERT INTO profiles (userid, first_name, last_name, phone) VALUES ($1, $2, $3, $4)",
      [userId, firstName, lastName, phone]
    )
    res.status(200).json({ success: true, message: "Registration successful" });

  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating account");
  }
};

module.exports = { handleNewUser };
