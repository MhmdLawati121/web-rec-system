document.addEventListener("DOMContentLoaded", () => {
  const regForm = document.getElementById("login-form");

  regForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const messageElement = document.getElementById("message");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const formData = {
      email: email,
      password: password,
    };

    // Function to display alert messages
    function alert(message, color = "red", timeout = 3000) {
      messageElement.innerHTML = message;
      messageElement.style.color = color;
      setTimeout(() => {
        messageElement.innerHTML = "";
      }, timeout);
    }

    const emailPattern = /^[^\s@]+@(gmail|yahoo|outlook|hotmail|icloud|aol|protonmail|zoho|yandex)\.(com|co\.uk|co\.in|fr|de|es|it|nl|ru|co\.jp|com\.br|com\.mx|com\.au)$/i;
    if (!email.match(emailPattern)) {
      messageElement.innerHTML = "Please enter a valid email address";
      messageElement.style.color = "red";
      setTimeout(() => { }, 1000);
      return;
    }

    try {
      console.log("success1");
      const response = await fetch("/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.redirected)
        window.location.href = response.url;
      else {
        const data = await response.json()
        console.log(data);
        messageElement.innerHTML = data.message;
        messageElement.style.color = "red";
        setTimeout(() => {
          messageElement.innerHTML = "";
        }, 2000);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  });
});
