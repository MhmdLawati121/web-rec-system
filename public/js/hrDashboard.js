async function getAppsAwaitingApproval() {
    try {
        const response = await fetch("/hr/nonAcademicOmani");
        if (!response.ok)
            throw new Error("Failed to fetch data");
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching apps data:", error);
        window.displayError(error + " (applications for approval)");
        return null;
    }
}

async function getJobsAwaitingApproval() {
    try {
        const response = await fetch("/hr/jobsAwaitingApproval");
        if (!response.ok)
            throw new Error("Failed to fetch data");
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching jobs data:", error);
        window.displayError(error + " (jobs for approval)");
        return null;
    }
}

async function getDelegatedTasks() {
    try {
        const response = await fetch("/hr/delegatedTasks");
        if (!response.ok)
            throw new Error("Failed to fetch data");
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching tasks data:", error);
        window.displayError(error + " (delegated tasks)");
        return null;
    }
}

// Function to dynamically generate the table
function generateTable(data, columns, con, url) {
    const container = document.getElementById(con);
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Create table headers based on specified columns
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Display only the first 10 entries
    for (let i = 0; i < Math.min(10, data.length); i++) {
        const row = document.createElement('tr');
        columns.forEach(column => {
            const cell = document.createElement('td');
            cell.textContent = data[i][column] || ''; // Display empty string if value is null or undefined
            row.appendChild(cell);
        });
        table.appendChild(row);
    }

    const button = document.createElement('button');
    button.innerHTML = "view more"
    const buttonDiv = document.createElement('div');
    buttonDiv.className = "button-right"
    button.addEventListener('click', () => {
        window.location.href = `/hr/${url}`
    })
    buttonDiv.appendChild(button);
    container.appendChild(table);
    container.appendChild(buttonDiv);
}

function displayUniqueCombinations(data, containerId, url) {
    const container = document.getElementById(containerId);

    // Create a set to store unique combinations of task_description and assigned_by
    const uniqueCombinations = new Set();

    // Extract unique combinations from the data
    data.forEach(item => {
        const combination = `${item.task_description}_${item.assigned_by}`;
        uniqueCombinations.add(combination);
    });

    // Create a paragraph for each unique combination
    uniqueCombinations.forEach(combination => {
        const paragraph = document.createElement('p');
        const description = document.createElement('p');
        const taskDiv = document.createElement('div');
        taskDiv.className = "task-div";
        paragraph.innerHTML = `<strong>Task Description</strong>: ${combination.split('_')[0]}`;
        description.textContent = `Assigned by: ${combination.split('_')[1]}`;
        taskDiv.appendChild(paragraph);
        taskDiv.appendChild(description);
        container.appendChild(taskDiv);
    });

    const button = document.createElement('button');
    const buttonDiv = document.createElement('div');
    buttonDiv.className = "button-right"
    button.innerHTML = "view more"
    button.addEventListener('click', () => {
        window.location.href = `/hr/${url}`
    })
    buttonDiv.appendChild(button);
    container.appendChild(buttonDiv);
}


document.addEventListener("DOMContentLoaded", async () => {
    const appData = await getAppsAwaitingApproval();
    const appDataCols = ["first_name", "last_name", "civil_id", "phone"]
    appData ? generateTable(appData, appDataCols, 'apps-container', 'viewAppsAwaitingApproval') : null;

    const jobData = await getJobsAwaitingApproval();
    const jobDataCols = ["title", "college", "spec", "recruiter"]
    jobData ? generateTable(jobData, jobDataCols, 'jobs-container', 'viewJobsAwaitingApproval') : null;

    const taskData = await getDelegatedTasks();
    taskData ? displayUniqueCombinations(taskData, 'tasks-container', 'viewDelegatedTasks') : null;

})
