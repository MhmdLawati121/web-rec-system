const userId = new URLSearchParams(window.location.search).get("id");
const userDashboardButton = document.getElementById("userDashboardButton");
const messageElement = document.getElementById("message");

function alert(message, color = "red", timeout = 1000) {
    const messageElement = document.getElementById("message");
    messageElement.innerHTML = message;
    messageElement.style.color = color;
    setTimeout(() => {
        messageElement.innerHTML = "";
    }, timeout);
}

function changePassword() {
    const userId = new URLSearchParams(window.location.search).get("id");
    const currentPassword = document.getElementById("currentPassword").value;
    const NewPassword = document.getElementById("NewPassword").value;
    const ConfirmPassword = document.getElementById("ConfirmPassword").value;


    // Check password strength
    const passwordStrength = checkPasswordStrength(NewPassword);
    if (passwordStrength !== "strong") {
        window.displayError("Password is too weak. Please use a stronger password");
        return;
    }

    // Function to check password strength
    function checkPasswordStrength(NewPassword) {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
        if (passwordRegex.test(NewPassword)) {
            return "strong";
        } else {
            return "weak";
        }
    }


    // Validating the presence of all form fields
    if (!currentPassword || !NewPassword || !ConfirmPassword) {
        window.displayError("Please fill out all the form fields");
        return;
    }

    // Checking if the new password is the same as the current password
    if (NewPassword === currentPassword) {
        window.displayError("You can't reuse the old password");
        return;
    }

    // Checking if the new password matches the confirmation password
    if (NewPassword !== ConfirmPassword) {
        window.displayError("Passwords do not match. Please try again");
        return;
    }

    // Sending data to the server for password change
    fetch(`/changePassword`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            currentPassword,
            NewPassword,
            ConfirmPassword,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            // Handling the server response
            console.log(data);

            if (data.success) {
                messageElement.innerHTML = "Password changed successfully";
                messageElement.style.color = "limegreen";

                setTimeout(() => {
                }, 1000);
            } else {
                window.displayError("Password change failed");
            }

        })
        .catch((error) => {
            console.error("Error:", error);
            window.displayError("An error occurred. Please try again later.");
        });
}
