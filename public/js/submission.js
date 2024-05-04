function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const listItems = [];

listItems.push(document.getElementById("step1"));
listItems.push(document.getElementById("step2"));
listItems.push(document.getElementById("step3"));
listItems.push(document.getElementById("step4"));
listItems.push(document.getElementById("step5"));
//listItems.push(document.getElementById("step6"));
//listItems.push(document.getElementById("step7"));

const sections = [];

sections.push(document.getElementById("academicQualifications"));
sections.push(document.getElementById("employmentHistory"));
sections.push(document.getElementById("professionalSkills"));
sections.push(document.getElementById("awardsAndHonors"));
sections.push(document.getElementById("uploadDocuments"));
//sections.push(document.getElementById("courseTeaching"));
//sections.push(document.getElementById("publications"));

listItems[0].addEventListener("click", () => displaySection(0));
listItems[1].addEventListener("click", () => displaySection(1));
listItems[2].addEventListener("click", () => displaySection(2));
listItems[3].addEventListener("click", () => displaySection(3));
listItems[4].addEventListener("click", () => {
  displaySection(4);
  createButtons();
});
//listItems[5].addEventListener("click", () => displaySection(5));
//listItems[6].addEventListener("click", () => displaySection(6));

const progressSection = listItems[4].parentElement.parentElement;
const btn = document.createElement("button");
btn.onclick = submitForm;
btn.innerHTML = "Submit Form";

function displaySection(i) {
  if (progressSection.lastChild.innerHTML === "Submit Form") {
    progressSection.removeChild(progressSection.lastChild);
  }
  for (let j = 0; j < sections.length; j++) {
    sections[j].style.display = "none";
    if (j <= i) listItems[j].style.color = "green";
    else listItems[j].style.color = "black"; // Fix here
  }
  sections[i].style.display = "";
}

function createButtons() {
  if (progressSection.lastChild.innerHTML !== "Submit Form") {
    progressSection.appendChild(btn);
  }
}

// DO WE NEED?
/* ***************** */
let academicFlag = false;
document.addEventListener("DOMContentLoaded", function () {
  const jobId = getQueryParam("jobId");
  // Make a fetch request to get data from the server
  fetch(`/getData/jobData?jobId=${jobId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data[0].category)
      if (data[0].category === "Academic") { academicFlag = true; }
      document.getElementById("application-heading").innerHTML = `Position - ${data[0].title}`;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

////////////////////////////////////////////////////////////
////////////// ADDING APP FORM SECTIONS ////////////////////
////////////////////////////////////////////////////////////

const formCodes = [];
formCodes.push(`
<label for="level">Level</label>
<select id="level">
  <option>Diploma</option>
  <option>Bachelor</option>
  <option>Master</option>
  <option>PhD</option>
  <option>Equivalent to PhD</option>
</select>
<label for="degreeTitle">Degree Title</label>
<input type="text" name="degreeTitle" id="degreeTitle" />
<label for="degreeMajor">Degree Major</label>
<input type="text" name="degreeMajor" id="degreeMajor" />
<label for="university">University</label>
<input type="text" name="university" id="university" />
<label for="country">Country</label>
<input type="text" name="country" id="country" />
<label for="gradYear">Graduation Year</label>
<input type="number" name="gradYear" id="gradYear" />
`);
formCodes.push(`              <label for="employer">Employer</label>
<input type="text" name="employer" id="employer" />
<label for="jobTitle">Job Title</label>
<input type="text" name="jobTitle" id="jobTitle" />
<label for="location">Location</label>
<input type="text" name="location" id="location" />
<label for="fromDate">From Date</label>
<input type="date" name="fromDate" id="fromDate" />
<label for="toDate">To Date</label>
<input type="date" name="toDate" id="toDate" />`);

formCodes.push(`              <label for="skills">Skills</label>
<input type="text" name="skills" id="skills" />
<label for="skillExp">Total Experience (Years)</label>
<input type="text" name="skillExp" id="skillExp" />
<label for="lastUsed">Last Used (Year)</label>
<input type="text" name="lastUsed" id="lastUsed" />`);

formCodes.push(` <label for="award">Award Title</label>
<input type="text" name="award" id="award" />

<label>Award Level</label> <br />
<input
  type="radio"
  name="awardLevel"
  id="awardLevel1"
  class="radiogroup"
  value="national"
  style="display: inline"
/>
<label for="awardLevel1" class="options">National</label> <br />

<input
  type="radio"
  name="awardLevel"
  id="awardLevel2"
  class="radiogroup"
  value="international"
  style="display: inline"
/>
<label for="awardLevel2" class="options">International</label
><br />
<input
  type="radio"
  name="awardLevel"
  id="awardLevel3"
  class="radiogroup"
  value="university"
  style="display: inline"
/>
<label for="awardLevel3" class="options">University</label><br />

<label>Award Type</label> <br />
<input
  type="radio"
  name="awardType"
  id="awardType1"
  class="radiogroup"
  value="teaching"
  style="display: inline"
/>
<label for="awardType1" class="options">Teaching</label> <br />

<input
  type="radio"
  name="awardType"
  id="awardType2"
  class="radiogroup"
  value="research"
  style="display: inline"
/>
<label for="awardType2" class="options">Research</label> <br />

<input
  type="radio"
  name="awardType"
  id="awardType3"
  class="radiogroup"
  value="clinical"
  style="display: inline"
/>
<label for="awardType3" class="options">Clinical</label> <br />

<input
  type="radio"
  name="awardType"
  id="awardType4"
  class="radiogroup"
  value="other"
  style="display: inline"
/>
<label for="awardType4" class="options">Other</label> <br />

<label for="awardInst">Granting Institution</label>
<input type="text" name="awardInst" id="awardInst" />
<label for="awardYear">Year Awarded</label>
<input
  type="number"
  name="awardYear"
  id="awardYear"
  maxlength="4"
/>`);

formCodes.push(`how did we get here...`);

formCodes.push(`<label for="institution">Institution</label>
<input type="text" name="institution" id="institution" />
<label for="academicRank">Academic Rank</label>
<input type="text" name="academicRank" id="academicRank" />
<label for="fromDate">From Date</label>
<input type="date" name="fromDate" id="fromDate" />
<label for="toDate">To Date</label>
<input type="date" name="toDate" id="toDate" />
<label for="courses">Courses taught (undergraduate level)</label>
<textarea name="courses" id="courses" cols="30" rows="5"></textarea>
`)

formCodes.push(`<label for="type">Publication</label>
<select name="type">
<option value="">Please Select</option>
	<option value="book">Book</option>
	<option value="conferencePresentation">Conference Presentation</option>
	<option value="nonRefereedPublication">Non-refereed Publication</option>
	<option value="refereedBookChapter">Refereed Book Chapter</option>
	<option value="refereedConferencePreceedings">Refereed Conference Preceedings</option>
	<option value="refereedJournal">Refereed Journal</option>
</select>
<label for="title">Title</label>
<input type="text" name="title" id="title" />

<label>Status</label> <br />
<input
type="radio"
name="state"
id="state1"
class="radiogroup"
value="published"
style="display: inline"
/>
<label for="state1" class="options">Published</label> <br />

<input
type="radio"
name="state"
id="state2"
class="radiogroup"
value="submitted"
style="display: inline"
/>
<label for="state1" class="options">Submitted</label> <br />

<label for="pubYear">Year Published</label>
<input type="number" name="pubYear" id="pubYear" />

<label for="journal">Journal</label>
<input type="text" name="journal" id="journal" />

<label for="citation">Full Citation</label>
<textarea name="citation" id="citation" cols="30" rows="5"></textarea>

<label for="url">Web URL/DOI</label>
<input type="text" name="url" id="url" />

`)

formCodes.push(`
`)


counterObject = {
  Qcounter: -1, Ecounter: -1, Scounter: -1, Acounter: -1, Ccounter: -1,
  Pcounter: -1, Vcounter: -1
};
/* researchObject = {
  publicationCounter: -1, supervisionCounter: -1, researchCounter: -1,
  consultationCounter: -1,
};
communityObject = {
  committeCounter: -1, eventsCounter: -1, membershipCounter: -1,
  accrediationCounter: -1
}; */

////////////// Academic Qualifications ////////////////////
createPage("Qualification", 0, "Qcounter");

////////////// Employment History ////////////////////
createPage("Employment", 1, "Ecounter");

////////////// Professional Skills ////////////////////
createPage("Skill", 2, "Scounter");

////////////// Awards & Honors ////////////////////
createPage("Award", 3, "Acounter");

////////////// Courses ////////////////////
//createPage("Course", 5, "Ccounter");

////////////// Publications and Research ////////////////////
//createPage("Publication", 6, "Pcounter");


const savedValues = [];
savedValues[0] = [];
savedValues[1] = [];
savedValues[2] = [];
savedValues[3] = [];
savedValues[4] = [];
/* savedValues[5] = [];
savedValues[6] = [];
savedValues[7] = []; */

function createPage(Keyword, i, counter) {
  const addBtn = document.getElementById(`add${Keyword}Btn`);
  const savedSection = document.getElementById(`saved${Keyword}s`);
  let savedCounter = 0;

  addBtn.addEventListener("click", (event) => {
    event.preventDefault();
    sections[i].removeChild(addBtn);
    const division = document.createElement('section');
    const form = document.createElement('form');
    const button = createSaveBtn(form, i, savedSection, addBtn, counter);
    form.innerHTML = formCodes[i];
    form.appendChild(button);
    division.appendChild(form);
    division.id = counterObject[counter];
    sections[i].appendChild(division);
  }
  )
}

function createSaveBtn(form, i, section, node, counter) {
  const button = document.createElement('button');
  button.innerHTML = "Save";
  button.addEventListener('click', (event) => {
    event.preventDefault();

    // Check if all sections are filled
    const inputs = [];
    let allSectionsFilled = true;

    for (let element of form) {
      if (element.tagName === "INPUT" || element.tagName === "SELECT" || element.tagName === "TEXTAREA") {
        if ((element.type !== "radio" || (element.type === "radio" && document.querySelector('input[name="' + element.name + '"]:checked'))) && element.value.trim() !== "") {
          inputs.push(element.value);
        } else {
          // If any section is not filled, set allSectionsFilled to false
          allSectionsFilled = false;
        }
      }
    }

    if (allSectionsFilled) {
      savedValues[i][counterObject[counter]] = inputs;
      form.parentElement.parentElement.insertBefore(node, form.parentElement)
      form.parentElement.style.display = "none";
      createTable(section, i, form, counter);
    } else {
      alert("Please fill in all sections before saving.");
    }

  })
  counterObject[counter]++;
  return button;
}


// :::::::::::::: BUG REPORT :::::::::::::: //
// Deleting more than one entry then trying to add one more bugs the data variable
// Attempt fix - Not priority

function createTable(section, arrayIndex, form, counter) {
  section.innerHTML = '';
  for (let dataIndex = 0; dataIndex < savedValues[arrayIndex].length; dataIndex++) {
    let data = savedValues[arrayIndex][dataIndex];
    const row = document.createElement('tr');
    let i = 0;
    for (let text of data) {
      const col = document.createElement('th');
      col.innerHTML = `${text}`;
      row.appendChild(col);
      i++;
      if (i === 3) {
        const remove = document.createElement('th');
        remove.classList = `${dataIndex}`;
        remove.appendChild(createRemoveBtn(section, arrayIndex, dataIndex, counter));
        row.appendChild(remove);
        break;
      };
    }
    section.appendChild(row);
  }
}

function createRemoveBtn(section, arrayIndex, dataIndex, counter) {
  const button = document.createElement('button');
  button.innerHTML = 'remove';
  button.addEventListener('click', (event) => {
    event.preventDefault();
    counterObject[counter]--;
    savedValues[arrayIndex].splice(dataIndex, 1);
    createTable(section, arrayIndex);
  })
  return button;
}

async function submitForm() {
  const jobId = getQueryParam("jobId");
  const application = {
    academicQualifications: savedValues[0],
    employmentHistory: savedValues[1],
    professionalSkills: savedValues[2],
    awardsAndHonors: savedValues[3],
  };
  console.log(jobId);
  const formData = new FormData();
  formData.append('jobId', jobId);
  formData.append('data', JSON.stringify(application));
  console.log(formData);
  try {
    console.log("submitted");
    const response = await fetch("/submitApplication", {
      method: "POST",
      credentials: "same-origin",
      body: formData,
    });
    if (response.redirected) {
      if (response.redirected) {
        try {
          console.log(application);

          // Access the file object
          const resumeFile = document.getElementById('resume').files[0];

          // Create a new FormData object specifically for the upload
          const uploadData = new FormData();
          uploadData.append('resume', resumeFile);

          const uploadResponse = await fetch('/upload', {
            method: 'POST',
            body: uploadData
          });
          alert("Application form successfully submitted. Good Luck!");
          window.location.href = response.url;

        } catch (error) {
          console.log("Error: ", error);
        }
      }
    }
  }
  catch (error) {
    console.log("Error: ", error);
  }
}
