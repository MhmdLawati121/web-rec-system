// Function to get the value of a query parameter from the URL
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Get the job ID from the URL
const jobId = getQueryParam("jobId");
let jobData = "";
document.addEventListener("DOMContentLoaded", function () {
  // Make a fetch request to get data from the server
  fetch(`/getData/jobData?jobId=${jobId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      jobData = data[0];
      fillPrimaryDetails();
      fillSecondaryDetails("duties");
      fillSecondaryDetails("requirements");
      fillSecondaryDetails("certificates");
      fillSecondaryDetails("benefits");
      setupApprove(jobId);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

function fillPrimaryDetails() {
  console.log(jobData);
  document.getElementById("title").innerText = jobData.title;
  document.getElementById("college").innerText = jobData.college;
  document.getElementById("opening-date").innerText = formatDate(
    jobData.opening
  );
  document.getElementById("closing-date").innerText = formatDate(
    jobData.closing
  );
  document.getElementById("specialization").innerText = jobData.spec;
  document.getElementById("category").innerText = jobData.category;
  document.getElementById("experience").innerText =
    jobData.experience + " years";
  document.getElementById("qualification").innerText = jobData.qualification;
  document.getElementById("type").innerText = jobData.type;
}

function fillSecondaryDetails(section) {
  const documentSection = document.getElementById(`${section}`);
  if (jobData[section][0] === "") {
    documentSection.parentElement.style.display = "none";
  } else {
    for (let part of jobData[section]) {
      const listItem = document.createElement("li");
      listItem.innerText = part;
      documentSection.appendChild(listItem);
    }
  }
}

function formatDate(dateString) {
  const options = { day: "numeric", month: "numeric", year: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    "en-GB",
    options
  );
  return formattedDate;
}

async function approveJob(id) {
  const response = await fetch(`/hr/approveJob?jobId=${id}`, {
    method: 'POST'
  });

  if (response.ok)
    console.log("Bazinga");
  else
    console.log("An error has occured - Job cannot be approved")
}

function setupApprove(id) {
  const division = document.getElementById("apply");
  division.innerHTML = `<button class="custom-button" onclick="approveJob(${id})">
  Approve Listing
</button>`
}


/****************** */
/****************** */
/****************** */
/****************** */
/****************** */
/****************** */
