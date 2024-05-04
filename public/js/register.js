// Add event listener to the registration form
document.querySelector(".form").addEventListener("submit", register);

// Function to handle the registration process
async function register(event) {
  event.preventDefault();

  // Retrieve form field values
  const firstName = document.querySelector(".firstName").value;
  const lastName = document.querySelector(".lastName").value;
  const email = document.querySelector(".email").value;
  const password = document.querySelector(".password").value;
  const confirmPassword = document.querySelector(".confirm-password").value;
  const phone = document.querySelector(".phone").value;

  // Function to display an alert message
  function alert(message, color = "red", timeout = 1000) {
    const messageElement = document.getElementById("message");
    messageElement.innerHTML = message;
    messageElement.style.color = color;

    setTimeout(() => {
      messageElement.innerHTML = "";
    }, timeout);
  }

  // Validate form fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !confirmPassword
  ) {
    alert("Please fill out all the form fields.");
    return;
  }

  // Validate email format using a regular expression
  const emailPattern = /^[^\s@]+@(gmail|yahoo|outlook|hotmail|icloud|aol|protonmail|zoho|yandex)\.(com|co\.uk|co\.in|fr|de|es|it|nl|ru|co\.jp|com\.br|com\.mx|com\.au)$/i;
  if (!email.match(emailPattern)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return;
  }

  // Check password strength
  const passwordStrength = checkPasswordStrength(password);
  if (passwordStrength !== "strong") {
    alert("Password is too weak. Please use a stronger password.");
    return;
  }

  // Prepare data for registration
  const formData = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    phone: phone,
  };

  try {
    // Send a registration request to the server
    const registrationResponse = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const registrationData = await registrationResponse.json();
    const messageElement = document.getElementById("message");
    const emailInput = document.querySelector(".email");

    // Handle the server response
    if (registrationData.success) {
      // Display success message and redirect to login page
      messageElement.innerHTML = "Registration successful";
      messageElement.style.color = "limegreen";

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); // 2000 milliseconds = 2 seconds
    } else {
      // Check if the failure is due to email already in use
      if (registrationData.message.includes("Email is already in use")) {
        const errorAlert = document.createElement("p");
        errorAlert.innerHTML = "This email is already in use. Please use a different email.";
        errorAlert.style.color = "red";
        errorAlert.className = "error-alert";
        emailInput.parentNode.insertBefore(errorAlert, emailInput.nextSibling);

        setTimeout(() => {
          errorAlert.remove();
        }, 3000);
      } else {
        // Display failure message
        messageElement.innerHTML = "Registration failed. Please try again.";
        messageElement.style.color = "red";

        setTimeout(() => {
          messageElement.innerHTML = "";
        }, 3000);
      }
    }
  } catch (error) {
    // Handle registration error
    console.error("Error during registration:", error);
    alert("An error occurred during registration. Please try again later.");
  }
}

// Function to check password strength
function checkPasswordStrength(password) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
  if (passwordRegex.test(password)) {
    return "strong";
  } else {
    return "weak";
  }
}

