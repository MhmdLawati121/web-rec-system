let role = "user";

const pageContainer = document.querySelector(".container");

const errorContainer = document.createElement("div");
errorContainer.id = "error-container";
errorContainer.classList.add("errorInActive"); // Use add instead of toggle

const messageContainer = document.createElement("div");
messageContainer.id = "message-container";
messageContainer.classList.add("errorInActive"); // Use add instead of toggle

pageContainer.insertBefore(errorContainer, pageContainer.firstChild);
pageContainer.insertBefore(messageContainer, pageContainer.firstChild);



document.addEventListener("DOMContentLoaded", () => {
  fetch('/getData/sessionData')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // assuming server returns JSON data
    })
    .then((data) => {
      console.log("Data: ", data.sessionId)
      role = data.role;
      if (data.sessionId)
        setupLogout();
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });

});

function setupLogout() {
  document.querySelector(".account-buttons").innerHTML = ` 
    <div class="dropdown">
    <button class="dropbtn btn btn-md custom-btn">Account</button>
    <div class="dropdown-content">
      <a href="/profile">Profile</a>
  <a href="/${role}/dashboard">Dashboard</a>
      <a href="/changePassword">Change Password</a>
      <a href="/logout">Logout</a>
    </div>
  </div> 
  </button>`

}



function displayError(error) {
  const errorContainerUpdatable = document.getElementById("error-container");

  // Check if error container already has child nodes
  if (errorContainerUpdatable.childNodes.length > 0) {
    // If yes, update existing error text content
    const errorText = errorContainerUpdatable.querySelector('p');
    errorText.textContent = error;
  } else {
    // If not, create new elements and append them
    const icon = document.createElement('i');
    icon.classList.add('fa-solid');
    icon.classList.add('fa-circle-xmark');
    icon.classList.add('fa-xl');
    icon.style.color = "#fe3d21";

    const errorText = document.createElement("p");
    errorText.textContent = error;

    errorContainerUpdatable.appendChild(icon);
    errorContainerUpdatable.appendChild(errorText);

    // Toggle errorActive class
    errorContainerUpdatable.classList.toggle("errorActive");
    errorContainerUpdatable.classList.toggle("errorInActive");
    window.scrollTo(0, 0);

  }
}

function displayErrorTimed(error) {
  clearTimeout(errorTimeout);
  displayError(error);

  setTimeout(() => {
    const errorContainerUpdatable = document.getElementById("error-container");
    errorContainerUpdatable.classList.toggle("errorActive");
    errorContainerUpdatable.classList.toggle("errorInActive");
  }, 3000);
}

function displayMessage(msg) {
  const messageContainerUpdatable = document.getElementById("message-container");
  // Check if error container already has child nodes
  if (messageContainerUpdatable.childNodes.length > 0) {
    // If yes, update existing error text content
    const messageText = messageContainerUpdatable.querySelector('p');
    messageText.textContent = msg;
  } else {
    // If not, create new elements and append them
    const icon = document.createElement('i');
    icon.classList.add('fa-solid');
    icon.classList.add('fa-circle-check');
    icon.classList.add('fa-xl');
    icon.style.color = "green";

    const messageText = document.createElement("p");
    messageText.textContent = msg;

    messageContainerUpdatable.appendChild(icon);
    messageContainerUpdatable.appendChild(messageText);

    // Toggle errorActive class
    messageContainerUpdatable.classList.toggle("messageActive");
    messageContainerUpdatable.classList.toggle("errorInActive");
    window.scrollTo(0, 0);
  }
}

function displayMessageTimed(msg) {
  displayMessage(msg);

  setTimeout(() => {
    const messageContainerUpdatable = document.getElementById("message-container");
    messageContainerUpdatable.classList.toggle("messageActive");
    messageContainerUpdatable.classList.toggle("errorInActive");
  }, 3000);
}


// Assign function references to the window object
window.displayError = displayError;
window.displayErrorTimed = displayErrorTimed;
window.displayMessage = displayMessage;
window.displayMessageTimed = displayMessageTimed;
