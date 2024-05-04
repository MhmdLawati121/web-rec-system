// Async function to handle password change
async function resetPassword(event) {
    event.preventDefault();

    // Retrieve values from the New Password form
    const email = document.getElementById("emailInput").value;
    const newPassword = document.getElementById("newPasswordInput").value;
    const confirmPassword = document.getElementById("confirmPasswordInput").value;

    // Function to display an alert message
    function alert(message, color = "red", timeout = 1000) {
        const messageElement = document.getElementById("message");
        messageElement.innerHTML = message;
        messageElement.style.color = color;

        setTimeout(() => {
            messageElement.innerHTML = "";
        }, timeout);
    }

    // Check password strength
    const passwordStrength = checkPasswordStrength(newPassword);
    if (passwordStrength !== "strong") {
        alert("Password is too weak. Please use a stronger password");
        return;
    }


    // Function to check password strength
    function checkPasswordStrength(newPassword) {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
        if (passwordRegex.test(newPassword)) {
            return "strong";
        } else {
            return "weak";
        }
    }


    // Validate new password and confirm password
    if (!email || !newPassword || !confirmPassword) {
        alert("Please fill out all the form fields");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again");
        return;
    }

    // Prepare form data for the server
    const formData = {
        email: email,
        newPassword: newPassword,
    };

    try {
        // Send a request to change the password
        const response = await fetch("/newPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        const messageElement = document.getElementById("message");

        // Handle the server response
        if (data.success) {
            messageElement.innerHTML = "Password changed successfully";
            messageElement.style.color = "limegreen";
            setTimeout(() => {
            }, 1000);
        } else {
            messageElement.innerHTML = "Failed to change password. Please try again";
            messageElement.style.color = "red";

            setTimeout(() => {
            }, 1000);
        }
    } catch (error) {
        console.error("Error during Changing Password:", error);
        alert("An error occurred changing the password. Please try again later");
    }
}
// Add event listener to the New Password form
document.querySelector("#NewpassForm").addEventListener("submit", NewPassword);
