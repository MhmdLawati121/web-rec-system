// Define form creation functions for each option
const formCreationFunctions = {
    'Add course': function () {
        const form = document.createElement('form');
        form.setAttribute('data-route', '/apr/add-course');
        form.innerHTML = `<label for="institution">Institution</label>
      <input type="text" name="institution" id="institution" />
      <label for="academicRank">Academic Rank</label>
      <input type="text" name="academicRank" id="academicRank" />
      <label for="fromDate">From Date</label>
      <input type="date" name="fromDate" id="fromDate" />
      <label for="toDate">To Date</label>
      <input type="date" name="toDate" id="toDate" />
      <label for="courses">Courses taught (undergraduate level)</label>
      <textarea name="courses" id="courses" cols="30" rows="5"></textarea>
      <button type="submit">Submit</button>`;
        return form;
    },
    'Add publication': function () {
        const form = document.createElement('form');
        form.setAttribute('data-route', '/apr/add-publication');
        form.innerHTML = (`<label for="type">Publication</label>
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
        
        <div class="radio-flex">
        <label for="state1" class="options">Published</label> <br />
        <input
        type="radio"
        name="state"
        id="state1"
        class="radiogroup"
        value="published"
        style="display: inline"
        />
        </div>
        
        <div class="radio-flex">
        <label for="state1" class="options">Submitted</label> <br />
        <input
        type="radio"
        name="state"
        id="state2"
        class="radiogroup"
        value="submitted"
        style="display: inline"
        />
        </div>
        <label for="pubYear">Year Published</label>
        <input type="number" name="pubYear" id="pubYear" />
        
        <label for="journal">Journal</label>
        <input type="text" name="journal" id="journal" />
        
        <label for="citation">Full Citation</label>
        <textarea name="citation" id="citation" cols="30" rows="5"></textarea>
        
        <label for="url">Web URL/DOI</label>
        <input type="text" name="url" id="url" />
      <button type="submit">Submit</button>
        `)
        return form;
    },
    'Add postgraduate supervision': function () {
        const form = document.createElement('form');
        form.setAttribute('data-route', '/apr/add-supervision');
        form.innerHTML = `
      <label for="student-name">Student name</label>
      <input type="text" name="studentName" id="studentName" />
      <label for="thesis">Thesis title</label>
      <input type="text" name="thesis" id="thesis" />
      <label for="year">Year published</label>
      <input type="text" name="year" id="year" />
      <button type="submit">Submit</button>
      `;
        return form;
    },
    'Add research grants': function () {
        const form = document.createElement('form');
        form.setAttribute('data-route', '/apr/add-research');
        form.innerHTML = ` 
        <label for="role">Role:</label><br>

        <div class="radio-flex">
        <label for="role_pi">Principal Investigator</label><br>
        <input type="radio" id="role_pi" name="role" value="principal_investigator">
        </div>
        
        <div class="radio-flex">
        <label for="role_ci">Co-Investigator</label><br>
        <input type="radio" id="role_ci" name="role" value="co_investigator">
        </div>

        <label for="projectTitle">Project Title:</label><br>
        <input type="text" id="projectTitle" name="projectTitle" required><br>
        
        <input type="text" id="fundedBy" name="fundedBy" required><br>
        <label for="fundedBy">Funded by:</label><br>
        
        <label for="budget">Budget:</label><br>
        <input type="text" id="budget" name="budget" required><br>
        <label for="fromYear">From (Year):</label><br>
        <input type="number" id="fromYear" name="fromYear" required><br>
        <label for="toYear">To (Year):</label><br>
        <input type="number" id="toYear" name="toYear" required><br>
        <input type="submit" value="Submit">
      `
        return form;
    },
    'Add research consultation contracts': function () {
        const form = document.createElement('form');
        form.setAttribute('data-route', '/apr/add-consultancy');
        form.innerHTML = `
            <label for="consultancyTitle">Consultancy Title:</label><br>
            <input type="text" id="consultancyTitle" name="consultancyTitle" required><br>
            
            <label for="organization">Organization:</label><br>
            <input type="text" id="organization" name="organization" required><br>
            
            <label for="fromYear">From (Year):</label><br>
            <input type="number" id="fromYear" name="fromYear" required><br>
            
            <label for="toYear">To (Year):</label><br>
            <input type="number" id="toYear" name="toYear" required><br>
            
            <label for="contractAmount">Contract Amount:</label><br>
            <input type="text" id="contractAmount" name="contractAmount" required><br>
            
            <button type="submit">Submit</button>
        `;
        return form;
    },
    'Add committee participation': function () {
        const form = document.createElement('form');
        form.setAttribute('data-route', '/apr/add-position-committee');
        form.innerHTML = `
            <label for="type">Type:</label><br>
            <select id="type" name="type" required>
                <option value="">Please Select</option>
                <option value="aap">Academic Admin Position</option>
                <option value="cc">College Committee</option>
                <option value="dc">Departmental Committee</option>
                <option value="ic">International Committee</option>
                <option value="nc">National Committee</option>
                <option value="uc">University Committee</option>
            </select><br>
            
            <label for="title">Title:</label><br>
            <input type="text" id="title" name="title" required><br>
            
            <label for="institution">Institution:</label><br>
            <input type="text" id="institution" name="institution" required><br>
            
            <label for="fromYear">From (Year):</label><br>
            <input type="number" id="fromYear" name="fromYear" required><br>
            
            <label for="toYear">To (Year):</label><br>
            <input type="number" id="toYear" name="toYear" required><br>
            
            <button type="submit">Submit</button>
        `;
        return form;
    },
    'Add events organized': function () {
        const form = document.createElement('form');
        form.setAttribute('data-route', '/apr/add-event');
        form.innerHTML = `
            <label for="eventTitle">Event Title:</label><br>
            <input type="text" id="eventTitle" name="eventTitle" required><br>
            
            <label for="fromDate">From Date:</label><br>
            <input type="date" id="fromDate" name="fromDate" required><br>
            
            <label for="toDate">To Date:</label><br>
            <input type="date" id="toDate" name="toDate" required><br>
            
            <label for="audienceProfile">Audience Profile:</label><br>
            <input type="text" id="audienceProfile" name="audienceProfile" required><br>
            
            <label for="institution">Institution:</label><br>
            <input type="text" id="institution" name="institution" required><br>
            
            <label for="country">Country:</label><br>
            <input type="text" id="country" name="country" required><br>
            
            <button type="submit">Submit</button>
        `;
        return form;
    },
    'Add professional memberships': function () {
        const form = document.createElement('form');
        form.setAttribute('data-route', '/apr/add-membership');
        form.innerHTML = `
            <label for="type">Type:</label><br>
            <select id="type" name="type" required>
                <option value="">Please Select</option>
                <option value="international">International</option>
                <option value="national">National</option>
            </select><br>
            
            <label for="organization">Organization:</label><br>
            <input type="text" id="organization" name="organization" required><br>
            
            <label for="organizationCountry">Organization Country:</label><br>
            <input type="text" id="organizationCountry" name="organizationCountry" required><br>
            
            <label for="role">Role:</label><br>
            <input type="text" id="role" name="role" required><br>
            
            <label for="fromYear">From (Year):</label><br>
            <input type="number" id="fromYear" name="fromYear" required><br>
            
            <label for="toYear">To (Year):</label><br>
            <input type="number" id="toYear" name="toYear" required><br>
            
            <button type="submit">Submit</button>
        `;
        return form;
    },
    'Add academic accreditation / QA participations': function () {
        const form = document.createElement('form');
        form.setAttribute('data-route', '/apr/add-accreditation');
        form.innerHTML = `
            <label for="accreditingOrganization">Accrediting Organization:</label><br>
            <input type="text" id="accreditingOrganization" name="accreditingOrganization" required><br>
            
            <label for="institution">Institution:</label><br>
            <input type="text" id="institution" name="institution" required><br>
            
            <label for="role">Role:</label><br>
            <input type="text" id="role" name="role" required><br>
            
            <label for="accreditationDate">Accreditation Date:</label><br>
            <input type="date" id="accreditationDate" name="accreditationDate" required><br>
            
            <button type="submit">Submit</button>
        `;
        return form;
    }
};

// Define form submission functions for each option
const formSubmissionFunctions = {
    'Add course': async function (formData, route) {
        try {
            console.log(formData);
            const response = await fetch(route, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to add course');
            }
            const data = await response.json();
            console.log('Course added successfully:', data);
        } catch (error) {
            console.error('Error adding course:', error);
        }
    },
    'Add publication': async function (formData, route) {
        try {
            const response = await fetch(route, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to add publication');
            }
            const data = await response.json();
            console.log('Publication added successfully:', data);
        } catch (error) {
            console.error('Error adding publication:', error);
        }
    },
    'Add postgraduate supervision': async function (formData, route) {
        try {
            const response = await fetch(route, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to add postgraduate supervision');
            }
            const data = await response.json();
            console.log('Postgraduate supervision added successfully:', data);
        } catch (error) {
            console.error('Error adding postgraduate supervision:', error);
        }
    },
    'Add research grants': async function (formData, route) {
        try {
            const response = await fetch(route, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to add research grants');
            }
            const data = await response.json();
            console.log('Research grants added successfully:', data);
        } catch (error) {
            console.error('Error adding research grants:', error);
        }
    },
    'Add research consultation contracts': async function (formData, route) {
        try {
            const response = await fetch(route, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to add research consultation contracts');
            }
            const data = await response.json();
            console.log('Research consultation contracts added successfully:', data);
        } catch (error) {
            console.error('Error adding research consultation contracts:', error);
        }
    },
    'Add committee participation': async function (formData, route) {
        try {
            const response = await fetch(route, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to add committee participation');
            }
            const data = await response.json();
            console.log('Committee participation added successfully:', data);
        } catch (error) {
            console.error('Error adding committee participation:', error);
        }
    },
    'Add events organized': async function (formData, route) {
        try {
            const response = await fetch(route, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to add events organized');
            }
            const data = await response.json();
            console.log('Events organized added successfully:', data);
        } catch (error) {
            console.error('Error adding events organized:', error);
        }
    },
    'Add professional memberships': async function (formData, route) {
        try {
            const response = await fetch(route, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to add professional memberships');
            }
            const data = await response.json();
            console.log('Professional memberships added successfully:', data);
        } catch (error) {
            console.error('Error adding professional memberships:', error);
        }
    },
    'Add academic accreditation / QA participations': async function (formData, route) {
        try {
            const response = await fetch(route, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to add academic accreditation / QA participations');
            }
            const data = await response.json();
            console.log('Academic accreditation / QA participations added successfully:', data);
        } catch (error) {
            console.error('Error adding academic accreditation / QA participations:', error);
        }
    }
};

// Fetch academic profile
const academicProfileRetrieval = async () => {
    try {
        const response = await fetch('/apr/getAcademicProfile?view=user');
        const data = await response.json()
        displaySectionTables(data);
    } catch (error) {
        window.displayError(error);
    }
}

// Function to display data in tables for each section
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

            // Add a column for the delete button in the header row
            const deleteHeaderCell = document.createElement('th');
            deleteHeaderCell.textContent = 'Actions';
            headerRow.appendChild(deleteHeaderCell);

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

                // Add a delete button to each row
                const deleteCell = row.insertCell();
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-button');
                deleteButton.id = `${section}_${entryId}`;

                // Attach event listener to delete button
                deleteButton.addEventListener('click', () => {
                    // Call function to delete entry from the database
                    deleteEntry(deleteButton.id); // Pass the ID of the entry to the function
                });

                deleteCell.appendChild(deleteButton);
            });

            // Add a title above the table
            const title = document.createElement('h3');
            title.textContent = formattedSectionTitle;
            document.getElementById("view-academic-profile").appendChild(title);

            // Add the table to the HTML document
            document.getElementById("view-academic-profile").appendChild(table);
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

async function deleteEntry(section_id) {
    console.log(section_id);
    const array = section_id.split('_');
    const requestData = {
        section: array[0],
        id: array[1]
    }
    console.log(requestData);
    try {
        const response = await fetch("/apr/deleteEntry", {
            method: 'POST',
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        })
        const data = await response.json();
        window.displayMessage(data.message);
    }
    catch (error) {
        console.log(error);
        window.displayError(error);
    }
}

// Event listener for dropdown change
document.getElementById('actionsDropdown').addEventListener('change', function () {
    const selectedOption = this.value;
    const formCreationFunction = formCreationFunctions[selectedOption];
    const formSubmissionFunction = formSubmissionFunctions[selectedOption];

    if (formCreationFunction) {
        const formContainer = document.getElementById('add-entry');
        formContainer.innerHTML = ''; // Clear previous form if any
        const form = formCreationFunction();
        formContainer.appendChild(form);

        // Event listener for form submission
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission
            const formData = new FormData(this);
            if (formSubmissionFunction) {
                const route = this.getAttribute('data-route');
                formSubmissionFunction(formData, route);
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    academicProfileRetrieval();
})