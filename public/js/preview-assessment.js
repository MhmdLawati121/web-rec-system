// Retrieve the assessment IDs from the query parameters
const urlParams = new URLSearchParams(window.location.search);
const tempIdEncoded = urlParams.get("assessmentData");
const tempIds = decodeURIComponent(tempIdEncoded.slice(1, -1)).split(",");
console.log(tempIds);

// Retrieve the assessment data from the server
document.addEventListener("DOMContentLoaded", async () => {
    for (const tempId of tempIds) {
        const data = await fetch(
            "/assessment/getAssessmentData?assessmentData=" + tempId
        );
        const info = await data.json();
        console.log(info);

        const section = document.getElementById("assessment");

        // Create elements to display assessment data
        const questionDiv = document.createElement("div");
        const imageElement = document.createElement("img");
        const questionText = document.createElement("p");
        const optionsText = document.createElement("ul");

        // Populate elements with assessment data
        imageElement.src = info.imagedata;
        questionText.textContent = info.question;
        for (let i = 0; i < info.options.length; i++) {
            const option = document.createElement("li");
            option.textContent = info.options[i];
            optionsText.appendChild(option);
        }

        // Append elements to the DOM
        questionDiv.appendChild(questionText);
        questionDiv.appendChild(imageElement);
        questionDiv.appendChild(optionsText);
        section.appendChild(questionDiv);
    }
});
