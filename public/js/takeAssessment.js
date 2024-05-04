// Retrieve the assessment IDs from the query parameters
const urlParams = new URLSearchParams(window.location.search);
const tempId = urlParams.get("jobId");
const appId = urlParams.get("appId");

// Retrieve the assessment data from the server
document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch(
        "/assessment/getAssessment?jobId=" + tempId
    );
    const data = await response.json();
    console.log(data);

    const section = document.getElementById("assessment");
    for (i = 0; i < data.length; i++) {
        // Create elements to display assessment data
        const info = data[i];
        const questionDiv = document.createElement("div");
        const imageElement = document.createElement("img");
        const questionText = document.createElement("p");
        const optionText = document.createElement("div");
        const optionsList = document.createElement("ul");

        // Populate elements with assessment data

        questionText.textContent = info.question;

        for (let i = 0; i < info.options.length; i++) {
            const tickType = document.createElement("input");
            tickType.classList = info.id + "_" + i;
            if (info.answer.length > 1) tickType.type = "checkbox";
            else {
                tickType.type = "radio";
                tickType.name = "option" + info.id;
            }
            const option = document.createElement("li");
            const optionP = document.createElement("label");
            optionP.textContent = info.options[i];
            option.appendChild(optionP);
            option.appendChild(tickType);
            optionsList.appendChild(option);
        }

        // Append elements to the DOM
        questionDiv.appendChild(questionText);
        if (info.imagedata !== null) {
            imageElement.src = info.imagedata;
            questionDiv.appendChild(imageElement);
        }
        optionText.appendChild(optionsList);
        questionDiv.appendChild(optionText);
        section.appendChild(questionDiv);
    }
});

document
    .getElementById("submit-assessment")
    .addEventListener("click", async (event) => {
        event.preventDefault();
        const allOptions = document.querySelectorAll("input");
        const selectedAnswers = [];
        for (let option of allOptions) {
            if (option.checked) selectedAnswers.push(option.className);
        }
        const response = await fetch(
            `/assessment/markAssessment?jobId=${tempId}&appId=${appId}`,
            {
                method: "POST",
                body: JSON.stringify(selectedAnswers),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(selectedAnswers);
        setTimeout(() => {
            window.displayMessage("Assessment has been submitted, good luck");
        }, 2000)
        window.location.href = "/";
    });