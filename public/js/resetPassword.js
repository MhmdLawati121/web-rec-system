// Add an event listener to the form with the id "resetForm" when it is submitted,
document.querySelector("#resetForm").addEventListener("submit", resetPassword);

function alert(message, color = "red", timeout = 1000) {
    const messageElement = document.getElementById("message");
    messageElement.innerHTML = message;
    messageElement.style.color = color;
    setTimeout(() => {
        messageElement.innerHTML = "";
    }, timeout);
}

async function resetPassword(event) {
    event.preventDefault();
    const email = document.querySelector(".email").value;

    // Validate form fields
    if (!email) {
        alert("Please fill out  the  email field");
        return;
    }

    const formData = {
        email: email,
    };

    // Regular expression pattern to validate the email format
    const emailPattern = /^[^\s@]+@(gmail|yahoo|outlook|hotmail|icloud|aol|protonmail|zoho|yandex)\.(com|co\.uk|co\.in|fr|de|es|it|nl|ru|co\.jp|com\.br|com\.mx|com\.au)$/i;

    // Check if the entered email does not match the expected pattern
    if (!email.match(emailPattern)) {
        alert("Please enter a valid email address");
        return;
    }

    try {
        const response = await fetch("/resetPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // Convert the form data object to JSON and include it in the request body
            body: JSON.stringify(formData),
        });

        // Parse the JSON response from the server
        const data = await response.json();

        // Get the message element by its id
        const messageElement = document.getElementById("message");

        // Check if the password reset was successful
        if (data.success) {
            messageElement.innerHTML = "Password reset instructions sent to your email";
            messageElement.style.color = "limegreen";
        } else {
            messageElement.innerHTML = "Email not found. Please provide a registered email";
            messageElement.style.color = "red";
        }

        // Set a timeout to clear the message element after a certain period
        setTimeout(() => {
            messageElement.innerHTML = "";
        }, 1000);
    } catch (error) {
        console.error("Error during password reset:", error);
        alert("An error occurred during password reset. Please try again later");
    }
}
