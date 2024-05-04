/**
 * Filename: homepage.js
 * Purpose: Dynamic generation of job listings page.
 * Updated on: 01/03/2024
 * TODO: set expiry date filter
 */

const jobIds = [];
const titles = [];
const colleges = [];
const specs = [];
const categories = [];
const dates = [];
const descriptions = [];

document.addEventListener("DOMContentLoaded", function () {
  // Make a fetch request to get data from the server
  fetch("/getData/jobData")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Update the HTML with the fetched data
      console.log(data);
      getDataFromDb(data);
      generateCards();
    })
    .catch((error) => {
      window.displayError("Error fetching data:" + error);
    });
});

function getDataFromDb(data) {
  for (let i = 0; i < data.length; i++) {
    jobIds.push(data[i].jobid);
    titles.push(data[i].title);
    colleges.push(data[i].college);
    categories.push(data[i].category);
    dates.push(formatDate(data[i].closing));
    descriptions.push(data[i].details);
    specs.push(data[i].spec);
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

const cardsSection = document.getElementById("all-cards");
let cardData = [];

function generateCards() {
  for (let i = 0; i < titles.length; i++) {
    createCard(
      jobIds[i],
      titles[i],
      colleges[i],
      specs[i],
      categories[i],
      dates[i],
      descriptions[i]
    );
  }

  const dropDownTitle = document.getElementById("filter-dropdown-title");
  const dropDownSubtitle = document.getElementById("filter-dropdown-subtitle");
  const dropDownRole = document.getElementById("filter-dropdown-role");
  const searchInput = document.getElementById("search-input");
  const cardsForFilter = cardsSection.querySelectorAll(
    ".card:not([style*='display: none'])"
  );

  // filling cardData
  cardsForFilter.forEach((card) => {
    const cardTitle = card.querySelector(".card-title");
    const cardSubtitle = card.querySelector(".card-subtitle");
    const cardRole = card.querySelector(".job-type");
    cardData.push({
      title: cardTitle.textContent,
      subtitle: cardSubtitle.textContent,
      role: cardRole.textContent,
    });
  });

  function refreshDropdown(dropDown, title, placeholder, cardData) {
    dropDown.innerHTML = "";
    let duplicateFlag = 0;

    const placeholderOption = document.createElement("option");
    placeholderOption.text = placeholder;
    placeholderOption.value = "";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    dropDown.appendChild(placeholderOption);

    const selectAll = document.createElement("option");
    selectAll.text = "Select All";
    dropDown.appendChild(selectAll);

    cardData.forEach((card, index) => {
      if (card.display !== "none") {
        const option = document.createElement("option");
        option.value = index;
        option.text = card[title];
        if (card[title] !== duplicateFlag) {
          dropDown.appendChild(option);
          duplicateFlag = card[title];
        }
      }
    });
  }

  updateCardData();
  refreshDropdown(dropDownSubtitle, "subtitle", "Specialization", cardData);
  refreshDropdown(dropDownTitle, "title", "College/Dept.", cardData);
  refreshDropdown(dropDownRole, "role", "Role", cardData);

  // dropDownTitle listener
  dropDownTitle.addEventListener("change", function () {
    const selectedOptions = Array.from(dropDownTitle.selectedOptions);
    // Extract the text of the selected options
    const selectedTexts = selectedOptions.map((option) => option.textContent);

    cardsForFilter.forEach((card) => {
      const cardContent = card.textContent;
      if (selectedTexts[0] !== "Select All") {
        if (cardContent.includes(selectedTexts[0])) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      } else {
        card.style.display = "block";
        updateCardData();
        refreshDropdown(dropDownTitle, "title", "College/Dept.", cardData);
      }
      updateCardData();
      refreshDropdown(dropDownSubtitle, "subtitle", "Specialization", cardData);
      refreshDropdown(dropDownRole, "role", "Role", cardData);
    });
  });

  // dropDownSubTitle listener
  dropDownSubtitle.addEventListener("change", function () {
    const selectedOptions = Array.from(dropDownSubtitle.selectedOptions);
    // Extract the text of the selected options
    const selectedTexts = selectedOptions.map((option) => option.textContent);
    cardsForFilter.forEach((card) => {
      const cardContent = card.textContent;
      if (selectedTexts[0] !== "Select All") {
        if (cardContent.includes(selectedTexts[0])) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      } else {
        card.style.display = "block";
        updateCardData();
        refreshDropdown(
          dropDownSubtitle,
          "subtitle",
          "Specialization",
          cardData
        );
      }
    });
    updateCardData();
    refreshDropdown(dropDownTitle, "title", "College/Dept.", cardData);
    refreshDropdown(dropDownRole, "role", "Role", cardData);
  });

  // dropDownRole listener
  dropDownRole.addEventListener("change", function () {
    const selectedOptions = Array.from(dropDownRole.selectedOptions);
    // Extract the text of the selected options
    const selectedTexts = selectedOptions.map((option) => option.textContent);
    cardsForFilter.forEach((card) => {
      const cardContent = card.textContent;
      if (selectedTexts[0] !== "Select All") {
        if (cardContent.includes(selectedTexts[0])) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      } else {
        card.style.display = "block";
        updateCardData();
        refreshDropdown(
          dropDownSubtitle,
          "subtitle",
          "Specialization",
          cardData
        );
      }
    });
    updateCardData();
    refreshDropdown(dropDownTitle, "title", "College/Dept.", cardData);
    refreshDropdown(dropDownSubtitle, "subtitle", "Specialization", cardData);
  });

  // Search Filter
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    cardsForFilter.forEach((card) => {
      const cardContent = card.textContent.toLowerCase();
      if (cardContent.includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

    // After filtering based on search input, update the other dropdown filters
    updateCardData();
    refreshDropdown(dropDownTitle, "title", "College/Dept.", cardData);
    refreshDropdown(dropDownSubtitle, "subtitle", "Specialization", cardData);
  });
}

function toggleExpansion(button) {
  const card = button.closest(".card");
  const cardBody = card.querySelector(".hidden-text");
  const arrowDown = card.querySelector(".show-details");
  const arrowUp = card.querySelector(".hide-details");

  if (cardBody.style.maxHeight) {
    cardBody.style.maxHeight = null;
    cardBody.classList.remove("expanded");
    arrowDown.style.display = "inline";
    arrowUp.style.display = "none";
  } else {
    cardBody.style.maxHeight = cardBody.scrollHeight + "px";
    cardBody.classList.add("expanded");
    arrowDown.style.display = "none";
    arrowUp.style.display = "inline";
  }
}

function updateCardData() {
  const cardsTemp = cardsSection.querySelectorAll(
    ".card:not([style*='display: none'])"
  );
  cardData = [];
  cardsTemp.forEach((card) => {
    const cardTitle = card.querySelector(".card-title");
    const cardSubtitle = card.querySelector(".card-subtitle");
    const cardRole = card.querySelector(".job-type");
    cardData.push({
      title: cardTitle.textContent,
      subtitle: cardSubtitle.textContent,
      role: cardRole.textContent,
    });
  });
}

function viewDetails(jobId) {
  window.location.href = `../html/jobdetails.html?jobId=${jobId}`;
}

function createCard(
  jobId,
  title,
  department,
  specialization,
  role,
  closing,
  desc = "Not set - Click view Details to see more"
) {
  const cards = document.createElement("div");
  cards.classList.add("card");
  cards.classList.add("custom-card");
  const card = document.createElement("div");

  card.innerHTML = `
      <div class="card-header">
      <h5>${title}</h5>
      <h6 class="card-title">${department}</h6>

      <h6 class="card-subtitle mb-2 text-muted" style="display: inline;">${specialization}</h6>
      <p class="mb-2 text-muted" style="display: inline; margin:0px 3px 0 3px">|</p>
      <p class="job-type mb-2 text-muted" style="display: inline;">${role}</p>


  </div>
      <div class="hidden-text">
        <div class="card-body">
          <p>Job Description: ${desc}</p><br />
          <p>Last date to apply: ${closing}</p>
        </div>
      </div>

  <div class="card-footer">
      <span onclick="toggleExpansion(this)" class="show-details" style="margin-left: 2px">
          <i class="fa-solid fa-angles-down" style="color: #c2bfbf;"></i>
      </span>
      <span onclick="toggleExpansion(this)" style="display: none; margin-left: 2px" class="hide-details">
          <i class="fa-solid fa-angles-up" style="color: #c2bfbf;"></i>
      </span> 
      <button class="custom-button" onclick="viewDetails(${jobId})">View Details</button>
  </div>
      `;
  cards.appendChild(card);
  cardsSection.appendChild(cards);
}
