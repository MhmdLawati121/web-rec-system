/**
 * Filename: dashboard.js
 * Purpose: Dynamic generation of all dashboard pages.
 * Updated on: 01/03/2024
 */

document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Make a fetch request to get data from the server
    const response = await fetch("/getData/userData", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Update the HTML with the fetched data
    setupPage(data);
    if (data.head === true) {
      setupRecruiter();
    }
    if (data.applications) {
      try {
        const app = await fetch("/getData/userAppData", {
          method: "GET"
        })
        const data = await app.json();
        for (let appData of data) {
          const date = dateFormat(appData.date);
          setupApplications(appData.title, appData.college, `Submitted on: ${date}`, appData.status, appData.appid);
        }
      }
      catch (error) {
        console.log("No applications found: ", error);
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});



const cardsSection = document.getElementById("cards");

//-------------------//
// Functions Section //
//-------------------//

// User's name setup
function setupPage(data) {
  const heading = document.getElementById("welcome");
  heading.innerHTML = `${data.name}'s Dashboard`;
}

function dateFormat(date) {
  const day = date.slice(8, 10);
  const month = date.slice(5, 7);
  const year = date.slice(0, 4);
  const newDate = day + "/" + month + "/" + year;
  return newDate;
}

// Setup add-recruiter functionality - HEAD ADMIN FUNCTIONALITY
function setupRecruiter() {
  const recruiterAdd = document.createElement('div');
  recruiterAdd.classList = "action"
  recruiterAdd.innerHTML = `<label>
  <a onclick="popupAddRecruiter()"
    >Give admin privileges</a
  ></label
>`;
  /* recruiterAdd.innerHTML = `
  <form action="/admin/add-recruiter" method="post">
    <label for="recruiterUsername">Give recruiter priveleges to:</label>
    <input
      type="text"
      name="recruiterUsername"
      id="recruiterUsername"
    />
    <button type="submit" id="add-recruiter">Add recruiter</button>
  </form>`
 */  document.querySelector("#actions-content").appendChild(recruiterAdd);
}

async function popupAddRecruiter() {
  const reply = prompt("Enter email:");
  const object = { recruiterUsername: reply };
  const response = await fetch("/admin/add-recruiter", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(object)
  })
  if (response.status === 404)
    alert("Email not found");
  else if (response.status === 200)
    alert(`User ${reply} has been enlisted as an admin`);
  else
    alert("Unknown error occured - please try again later");
}

/**
 * Function to setup candidate's submitted application(s)
 * @param {string} title 
 * @param {string} specialization 
 * @param {string} role 
 * @param {string} status 
 */
function setupApplications(title, specialization, role, status, id) {
  const cards = document.createElement("div");
  cards.classList.add("card");
  cards.classList.add("custom-card");
  const card = document.createElement("div");

  card.innerHTML = `
        <div class="card-header">
        <h5>${title}</h5>

        <h6 class="card-subtitle mb-2 text-muted" style="display: inline;">${specialization}</h6>
        <p class="mb-2 text-muted" style="display: inline; margin:0px 3px 0 3px">|</p>
        <p class="job-type mb-2 text-muted" style="display: inline;">${role}</p>
    </div>
        
    <div class="card-footer">
        <p>Status: ${status}</p>
        <a href="/detailedappview?appId=${id}">Preview Application</a>
    </div>
        `;
  cards.appendChild(card);
  cardsSection.appendChild(cards);
}

