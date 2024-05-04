const jobForm = document.getElementById("jobForm");
const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", () => {
  for (let element of jobForm) {
    if (element.tagName === "INPUT") {
      element.value = "";
    }
  }
});

const counters = {
  dutyCounter: 1,
  requirementCounter: 1,
  certificateCounter: 1,
  benefitCounter: 1,
};

const dutiesSection = document.querySelector(".dutiesSection");
const addDuty = document.getElementById("addDuty");
const requirementsSection = document.querySelector(".requirementsSection");
const addRequirement = document.getElementById("addRequirement");
const certificatesSection = document.querySelector(".certificatesSection");
const addCertificate = document.getElementById("addCertificate");
const benefitsSection = document.querySelector(".benefitsSection");
const addBenefit = document.getElementById("addBenefit");

addDuty.addEventListener("click", (event) =>
  addEntry(event, dutiesSection, "dutyCounter")
);
dutiesSection.addEventListener("click", (event) =>
  deleteEntry(event, dutiesSection, "dutyCounter")
);

addRequirement.addEventListener("click", (event) =>
  addEntry(event, requirementsSection, "requirementCounter")
);
requirementsSection.addEventListener("click", (event) =>
  deleteEntry(event, requirementsSection, "requirementCounter")
);

addCertificate.addEventListener("click", (event) =>
  addEntry(event, certificatesSection, "certificateCounter")
);
certificatesSection.addEventListener("click", (event) =>
  deleteEntry(event, certificatesSection, "certificateCounter")
);

addBenefit.addEventListener("click", (event) =>
  addEntry(event, benefitsSection, "benefitCounter")
);
benefitsSection.addEventListener("click", (event) =>
  deleteEntry(event, benefitsSection, "benefitCounter")
);

function addEntry(event, section, sectionCounter) {
  event.preventDefault();
  counters[sectionCounter] += 1;
  const elem = document.createElement("input");
  const counter = document.createElement("input");
  const btn = document.createElement("button");
  const part = document.createElement("div");

  elem.type = "text";
  counter.classList = "counter";
  counter.disabled = true;
  counter.placeholder = counters[sectionCounter] + ".";
  btn.classList = "removeBtn";
  btn.textContent = "-";
  part.classList = "sectionPart";

  part.appendChild(counter);
  part.appendChild(elem);
  part.appendChild(btn);
  section.appendChild(part);
}

function deleteEntry(event, section, sectionCounter) {
  event.preventDefault();
  const elem = event.target;
  if (elem.nodeName === "BUTTON") {
    counters[sectionCounter] -= 1;
    let keyNum = elem.parentElement.firstChild.placeholder;
    keyNum = keyNum.slice(0, keyNum.length - 1);

    const allSectionCounters = section.querySelectorAll(".counter");
    console.log("all duty counters: ", allSectionCounters);
    for (let counter of allSectionCounters) {
      let currentNum = counter.placeholder.slice(
        0,
        counter.placeholder.length - 1
      );
      if (currentNum > keyNum) {
        counter.placeholder = currentNum - 1 + ".";
      }
    }
    section.removeChild(event.target.parentElement);
  }
}

function createArray(section, component) {
  const inputs = document
    .querySelector("." + section)
    .querySelectorAll(".sectionPart");
  for (let input of inputs) {
    component.push(input.firstElementChild.nextElementSibling.value);
  }
}

/**************************
 **** SKILL ASSESSMENT ****
 **************************/

/***************
 * Data Holders *
 ****************/

// quiz active
let quizFlag = false;

// holds all assessment data to POST
let assessmentData = [];

// stores IDs of the questions within the quiz
let questionIds = [];

// tracks number of questions
let questionCounter = 0;

/***************
 * DOM Elements *
 ****************/

// toggles quiz visibility
const toggleBtn = document.getElementById("toggle-assessment");

// holds quiz division
const quizSection = document.getElementById("quiz");

// quiz buttons
const addQuestion = document.getElementById("addQuestion");
const delQuestion = document.getElementById("removeQuestion");

/******************
 * Event Listeners *
 *******************/

toggleBtn.addEventListener("click", (event) => {
  event.preventDefault();
  quizFlag = !quizFlag;
  document.querySelector(".assessment").classList.toggle("hide");
  for (let e of document.querySelectorAll(".pageBtns"))
    e.classList.toggle("hide");
  if (toggleBtn.innerHTML === "Remove")
    toggleBtn.innerHTML = "Add";
  else
    toggleBtn.innerHTML = "Remove";
})

// event listener to add questions
addQuestion.addEventListener("click", (event) => {
  event.preventDefault();
  createQuestion();
});

// event listener to remove questions
delQuestion.addEventListener("click", (event) => {
  event.preventDefault();
  removeQuestion();
});

/*****************
 * Main Functions *
 ******************/

// function to create a new questions with 4 MC options
function createQuestion() {
  const questionTitle = document.createElement("span");
  questionTitle.innerHTML = "Question " + String(questionCounter + 1);
  const questionDiv = document.createElement("div");
  questionDiv.classList = "question";
  questionDiv.id = "question" + String(questionCounter);
  const question = document.createElement("input");
  question.classList = "questionText";
  const answers = document.createElement("div");
  answers.classList = "answers";
  const addOption = document.createElement("button");
  addOption.innerHTML = "Add Answer";
  const delOption = document.createElement("button");
  delOption.innerHTML = "Remove Answer";

  const imageUpload = document.createElement("input");
  imageUpload.type = "file";
  imageUpload.accept = "image/*";
  imageUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const imagePreview = document.createElement("img");
      imagePreview.src = event.target.result;
      imagePreview.style.maxWidth = "500px"; // Change this value to your desired maximum width
      imagePreview.style.maxHeight = "500px";
      questionDiv.insertBefore(imagePreview, answers);
    };
    reader.readAsDataURL(file);
  });

  prepareAddOptionBtn(addOption, answers);
  prepareRemoveOptionBtn(delOption, answers);
  for (let i = 0; i < 4; i++) {
    addAnswer(answers);
  }
  questionDiv.appendChild(questionTitle);
  questionDiv.appendChild(question);
  questionDiv.appendChild(imageUpload);
  questionDiv.appendChild(answers);
  questionDiv.appendChild(addOption);
  questionDiv.appendChild(delOption);
  quizSection.appendChild(questionDiv);
  questionCounter++;
}


// function to delete last question
function removeQuestion() {
  quizSection.removeChild(quizSection.lastElementChild);
  questionCounter--;
}

// function to add more answer options
function addAnswer(answers) {
  const option = document.createElement("input");
  option.classList = "answerText";
  const correctAnswer = document.createElement("input");
  correctAnswer.classList = "answerCheckbox";
  correctAnswer.type = "checkbox";
  answers.appendChild(option);
  answers.appendChild(correctAnswer);
}

// function to add more answer options
function prepareAddOptionBtn(btn, answers) {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    addAnswer(answers);
  });
}

// function to remove answer options
function prepareRemoveOptionBtn(btn, answers) {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    answers.removeChild(
      answers.lastElementChild.previousElementSibling.previousElementSibling
    );
    answers.removeChild(
      answers.lastElementChild.previousElementSibling.previousElementSibling
    );
  });
}


let QUIZ_IDs = [];
// function to obtain user input and save to assessmentData array
async function saveAssessment(url, jobId) {
  QUIZ_IDs = [];
  let correctAnswers = [];
  let options = [];
  let newData = {};

  const questions = document.querySelectorAll(".question");
  for (let question of questions) {
    const questionTitle = question.querySelector(".questionText");

    const inputs = question.querySelectorAll(".answerText");
    for (value of inputs) options.push(value.value);

    const checks = question.querySelectorAll(".answerCheckbox");
    for (value of checks) {
      if (value.checked === true)
        correctAnswers.push(value.previousElementSibling.value);
    }
    let imageData = null;
    const imagePreview = question.querySelector("img");
    if (imagePreview) {
      const canvas = document.createElement("canvas");
      canvas.width = imagePreview.width; // Set canvas width to match image
      canvas.height = imagePreview.height; // Set canvas height to match image
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imagePreview, 0, 0);
      imageData = canvas.toDataURL("image/png");
    }
    newData = {
      question: questionTitle.value,
      options: options,
      answer: correctAnswers,
      imageData: imageData
    };
    correctAnswers = [];
    options = [];

    try {
      console.log(JSON.stringify(newData));
      await saveToServer(newData, url, jobId); // Wait for the saveToServer function to complete
    } catch (error) {
      console.error('Error saving data on server:', error);
      window.displayError("Cannot save assessment - server error " + error)
    }
  }
}

async function saveToServer(data, url, jobId) {
  try {
    const requestData = { ...data, jobId };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    const responseData = await response.json();
    console.log('Data saved on server with ID:', responseData.id);
    QUIZ_IDs.push(responseData.id);
  } catch (error) {
    throw error; // Re-throw the error to be caught by the caller
  }
}

async function previewAssessment() {
  try {
    await saveAssessment('/assessment/save-temporary', 0);
    const previewURL = "/assessment/preview-assessment?assessmentData=" + encodeURIComponent(JSON.stringify(QUIZ_IDs));
    window.open(previewURL, "_blank");
  } catch (error) {
    console.error('Error saving assessment data:', error);
  }
}


/*****************
 * Submission
 *****************/

jobForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const requiredFieldsFilled = checkRequiredFields(); // Check if all required fields are filled

  if (!requiredFieldsFilled) {
    window.displayError("Please fill in all required fields.");
    return; // Prevent form submission if required fields are not filled
  }

  const jobDetails = {
    title: document.getElementById("title").value,
    college: document.getElementById("college").value,
    specialization: document.getElementById("specialization").value,
    openingDate: document.getElementById("openingDate").value,
    closingDate: document.getElementById("closingDate").value,
    jobCategory: document.getElementById("jobCategory").value,
    details: document.getElementById("description").value,
    experience: document.getElementById("experience").value,
    qualification:
      document.getElementById("qualificationType").value +
      " " +
      document.getElementById("qualification").value,
    duties: [],
    requirements: [],
    certificates: [],
    benefits: [],
    type: document.getElementById("jobType").value,
  };
  createArray("dutiesSection", jobDetails.duties);
  createArray("requirementsSection", jobDetails.requirements);
  createArray("certificatesSection", jobDetails.certificates);
  createArray("benefitsSection", jobDetails.benefits);

  const date1 = new Date(jobDetails.openingDate);
  const date2 = new Date(jobDetails.closingDate);
  if (date1 > date2) {
    alert("Opening and closing dates don't match, please check them again.");
    return; // Prevent form submission if opening and closing dates don't match
  }

  try {
    const response = await fetch("/admin/add", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobDetails),
    });
    if (response.ok) {
      const data = await response.json();
      const jobId = data.id;
      console.log("Job ID:", jobId);
      await saveAssessment("/assessment/save-assessment", jobId);
      console.log("Assessment saved!");
      window.displayMessage("Posting is now live - awaiting HR approval");
      setTimeout(function () {
        window.location.href = `/`;
      }, 2000);
    }
  } catch (error) {
    console.log("[ERR] ", error);
    window.displayError("Error creating job posting")
  }
});

// Function to check if all required fields are filled
function checkRequiredFields() {
  const requiredInputs = document.querySelectorAll(".required");
  for (const input of requiredInputs) {
    if (!input.value.trim()) {
      return false; // Return false if any required field is empty
    }
  }
  return true; // Return true if all required fields are filled
}
