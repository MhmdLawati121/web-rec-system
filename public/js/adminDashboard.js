
//------------------//
// Global Variables //
//------------------//

const myListingsDiv = document.getElementById('my-listings');
const errorMessage = document.getElementById('error-message');

//-------------------//
// Functions Section //
//-------------------//


/**
 * purpose: generate random integer to be used for dashboard colors
 * 
 * @param {number} max 
 * @returns {number} random number
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * purpose: creates trash can icon
 * 
 * @returns {HTMLAnchorElement}
 */
function createTrashIcon(id) {
    const link = document.createElement('a');
    link.innerHTML = '<i class="fa-solid fa-trash"></i>';
    link.id = id;
    link.style.height = "fit-content";
    link.onclick = async () => { await deleteJobPost(id) }
    return link;
    // TODO: add delete functionality
}

async function deleteJobPost(id) {
    const confirmation = prompt("Are you sure you want to delete this posting? Type 'Yes' to confirm");
    if (confirmation.toLowerCase() === "yes") {
        const response = await fetch(`/admin/deleteJobPost?jobId=${id}`)
        if (response.ok)
            window.displayMessageTimed("Successfully deleted")
        else
            window.displayError("Job post cannot be deleted")

    }
    else {
        window.displayErrorTimed("Job post deletion was cancelled")
    }
}

/**
 * purpose: create button to view job applications
 * 
 * @param {number} id 
 * @returns {HTMLDivElement} flex
 */
function createViewAppsBtn(id) {
    const flex = document.createElement('div'); // corrected typo 'division' to 'div'
    flex.classList = "btn-flex";
    const viewBtn = document.createElement('a');
    viewBtn.innerHTML = 'View applications';
    viewBtn.onclick = function () { viewApps(id) };
    flex.appendChild(viewBtn);
    return flex;
}

function viewApps(id) {
    window.location.href = `/viewApps?jobId=${id}`;
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

async function createSharedContent() {
    try {
        const response = await fetch("/delegation/getSharedApps");

        if (!response.ok)
            window.displayError("Shared content cannot be reached")
        else {
            const data = await response.json();
            console.log(data)
        }
    }
    catch (error) {
        window.displayError("Server error has occured")
    }
}

//-------------------------//
// Event Listeners Section //
//-------------------------//

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // fetch request to get jobs by recruiter id
        const response = await fetch("/getData/myJobs", {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        console.log(data);

        if (!data || !data['myJobs']) {
            throw new Error('Invalid data received');
        }

        // create division to show recruiter's posted jobs
        for (let i = 0; i < data['myJobs'].length; i++) {
            const slot = document.createElement('div');
            slot.classList = "jobPost";
            const randColors = ["#ffebcd", "#ffd699", "#ebcb9c", "#c8ad85", "#f6c67f", "#f1b45a"]
            slot.style.backgroundColor = randColors[getRandomInt(randColors.length)];
            slot.innerHTML = `<div class="title-div"><p class="title">${data['myJobs'][i].title}</p></div>
            <p class="college">${data['myJobs'][i].college}</p>`;
            const id = data['myJobs'][i].jobid;
            // slot.firstChild.appendChild(createTrashIcon(id));
            slot.appendChild(createViewAppsBtn(data['myJobs'][i].jobid));
            myListingsDiv.appendChild(slot);
        }

        const totalJobs = document.getElementById('circle1');
        const appsToday = document.getElementById('circle2');
        const totalApps = document.getElementById('circle3');
        totalJobs.innerHTML = data['myJobs'].length;
        totalApps.innerHTML = data['totalApps'];
        appsToday.innerHTML = data['appsToday'];

        createSharedContent();
        const taskData = await getDelegatedTasks();
        taskData ? displayUniqueCombinations(taskData, 'shared-content', 'viewDelegatedTasks') : null;


    } catch (error) {
        window.displayError(error);
    }
});
