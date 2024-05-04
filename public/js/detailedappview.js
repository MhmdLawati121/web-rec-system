const urlParams = new URLSearchParams(window.location.search);
const appid = urlParams.get('appId');
updateCommentSection();


document.getElementById('post-comment').addEventListener('click', async (event) => {
    event.preventDefault();
    const comment = document.getElementById('comment').value
    const response = await fetch(`/postComment?appId=${appid}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ comment })
    })
    if (!response.ok) {
        window.displayError("HTTP Error!");
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    window.location.reload();

})
let data = 0;
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(`/getData/detailedAppData?appId=${appid}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        let appData = data.appData;

        if (!appData || !Array.isArray(appData) || appData.length === 0) {
            throw new Error('No data returned or invalid data format.');
        }

        appData = appData[0];

        console.log(appData);

        if (appData.aq_title) {
            const aqSection = document.getElementById("aq-section");
            for (let i = 0; i < appData.aq_title.length; i++) {
                const object = {
                    Title: appData.aq_title[i],
                    Level: appData.aq_level[i],
                    Major: appData.aq_major[i],
                    College: appData.aq_university[i],
                    Graduation_Year: appData.aq_gradyear[i],
                    Country: appData.aq_country[i]
                }
                aqSection.innerHTML += generateTable(object);
                aqSection.innerHTML += '<br></br>';
            }
        }

        if (appData.eh_title) {
            const ehSection = document.getElementById("eh-section");
            for (let i = 0; i < appData.eh_title.length; i++) {
                const object = {
                    Title: appData.eh_title[i],
                    Employer: appData.eh_employer[i],
                    Location: appData.eh_location[i],
                    Starting: appData.eh_start[i].slice(0, 10),
                    End: appData.eh_end[i].slice(0, 10)
                }
                ehSection.innerHTML += generateTable(object);
                ehSection.innerHTML += '<br></br>';
            }
        }
        if (appData.ps_skill) {
            const psSection = document.getElementById("ps-section");
            for (let i = 0; i < appData.ps_skill.length; i++) {
                const object = {
                    Title: appData.ps_skill[i],
                    Years_used: appData.ps_experience[i],
                    Last_used: appData.ps_lastused[i]
                }
                psSection.innerHTML += generateTable(object);
                psSection.innerHTML += '<br></br>';
            }
        }
        if (appData.ah_title) {
            const ahSection = document.getElementById("ah-section");
            for (let i = 0; i < appData.ah_title.length; i++) {
                const object = {
                    Title: appData.ah_title[i],
                    Level: appData.ah_level[i],
                    Type: appData.ah_type[i],
                    Year: appData.ah_year[i],
                    Institution: appData.ah_inst[i]
                }
                ahSection.innerHTML += generateTable(object);
                ahSection.innerHTML += '<br></br>';
            }
        }

        const userIdData = await fetch(`/getData/appToUserId`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ appid })
        })

        const userId = await userIdData.json();

        const academicProfileData = await fetch(`/apr/getAcademicProfile?view=admin&userId=${userId.userId}`)
        const academicProfile = await academicProfileData.json();
        displaySectionTables(academicProfile)

    } catch (error) {
        console.error('Error:', error);
        // Handle error, show error message to user, etc.
    }
});

const displaySectionTables = (sectionData) => {
    // Iterate over each section in the sectionData object
    for (const section in sectionData) {
        if (sectionData.hasOwnProperty(section)) {
            // Convert section name to title case
            const sectionTitle = section.replace(/([A-Z])/g, ' $1').trim();
            const formattedSectionTitle = sectionTitle.charAt(0).toUpperCase() + sectionTitle.slice(1);

            // Get the data for the current section
            const data = sectionData[section];

            // Create a new table element
            const table = document.createElement('table');
            table.classList.add('section-table');

            // Create a table header row
            const headerRow = table.insertRow();
            let index = 0;
            for (const key in data[0]) {
                if (data[0].hasOwnProperty(key) && index >= 2) {
                    const headerCell = document.createElement('th');
                    headerCell.textContent = key;
                    headerRow.appendChild(headerCell);
                }
                index++;
            }

            // Create table rows for each entry in the data
            data.forEach(entry => {
                const row = table.insertRow();
                let index = 0;
                let entryId;
                for (const key in entry) {
                    if (entry.hasOwnProperty(key) && index >= 2) {
                        const cell = row.insertCell();
                        const value = key.toLowerCase().includes('date') ? formatDate(entry[key]) : entry[key];
                        cell.textContent = value;
                    }
                    if (index === 0) {
                        entryId = entry[key]; // Store the value of the first key as the entry ID
                    }
                    index++;
                }

                // Add a title above the table
                const title = document.createElement('h3');
                title.textContent = formattedSectionTitle;
                document.getElementById("view-academic-profile").appendChild(title);

                // Add the table to the HTML document
                document.getElementById("view-academic-profile").appendChild(table);
            })
        }
    }
};
// Function to format date to dd/mm/yyyy format
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};


textarea = document.getElementById('comment');
// Add an input event listener
textarea.addEventListener("input", function () {
    // Auto-expand the textarea vertically to fit content
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
});

function generateTable(obj) {
    let tableHTML = '<table class="section-table">';
    tableHTML += '<tr><th>Field</th><th>Value</th></tr>';
    for (const key in obj) {
        tableHTML += `<tr><td>${key}</td><td>${obj[key]}</td></tr>`;
    }
    tableHTML += '</table>';
    console.log(tableHTML);
    return tableHTML;
}

const section = document.getElementById("comment-section");
async function updateCommentSection() {
    const post = document.getElementById("comments");
    const response = await fetch(`/getComments?appId=${appid}`, {
        method: 'GET'
    });
    let data = await response.json();
    console.log(data);
    data = data.response;
    for (let i = 0; i < data.rows.length; i++) {
        const account = data.rows[i].commenter_name;
        const comment = data.rows[i].comment_text;
        const dateTime = new Date(data.rows[i].comment_date);
        const day = dateTime.getDate();
        const month = dateTime.getMonth() + 1; // Months are zero-indexed
        const year = dateTime.getFullYear();
        const date = day + "/" + month + "/" + year;
        const time = dateTime.getHours() + ":" + (dateTime.getMinutes() < 10 ? '0' : '') + dateTime.getMinutes();
        const division = document.createElement('div');
        division.classList = "comment";
        division.innerHTML = `
        <div class="heading">
          <div class="avatar">${account.slice(0, 1)}</div>
          <span>${account}</span>
          <p>${time}, ${date}</p>
        </div>
        <p>${comment}</p>`;
        post.after(division);
    }
}

function displayComments() {
    if (section.style.display === "none")
        section.style.display = "block";
    else
        section.style.display = "none";

}


