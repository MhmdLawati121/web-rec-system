function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
const jobId = getQueryParam("jobId");
const container = document.getElementById("table-container");
const button = document.getElementById("score-candidates");

document.addEventListener('DOMContentLoaded', async () => {
    getData();
    let weights = [];
    button.addEventListener('click', async (event) => {
        event.preventDefault();
        weights = [];
        for (let input of inputs) {
            if (input.value)
                weights.push(input.value);
            else
                weights.push(0);
        }
        const timer = await rankApp(jobId, weights);
        container.removeChild(container.lastChild);
        getData();
    })
})

document.getElementById("table-container").addEventListener('change', function (event) {
    if (event.target.type === 'checkbox') {
        updateCount();
    }
});

document.getElementById("delegate-btn").addEventListener('click', async (event) => {
    event.preventDefault();
    const assigned = document.getElementById('delegate-to').value;
    const description = document.getElementById('delegate-comment').value;
    const ids = countSelected();
    const data = {
        assigned_to: assigned,
        task_description: description,
        appids: ids
    }
    const response = await fetch(`/admin/delegate?jobId=${jobId}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/JSON"
        },
        body: JSON.stringify(data)
    })
    const confirmation = await response.json()
    if (response.ok) {
        window.displayMessage(confirmation.message);
    }
    else {
        window.displayError(confirmation.error);
    }
})

async function getData() {
    const appPersonalData = await fetch(`/getData/appPersonalData?jobId=${jobId}`, {
        method: 'GET',
        credentials: 'include'
    })
    const personalData = await appPersonalData.json()
    container.appendChild(generateTable(personalData.appPersonalData));
    $('#myTable').DataTable();
    const table = document.getElementById('myTable');
    addExportButtons(table);
}

function generateTable(data) {
    const table = document.createElement("table");
    const header = table.createTHead();
    const row = header.insertRow();

    // Create header cells
    for (let i = 1; i < Object.keys(data[0]).length; i++) {
        const key = Object.keys(data[0])[i];
        const th = document.createElement("th");
        const text = document.createTextNode(key.split("_")[0].toUpperCase());
        th.appendChild(text);
        row.appendChild(th);
    }

    // Add "Details" header cell
    const viewHeader = document.createElement("th");
    const checkHeader = document.createElement("th");
    const viewHeaderText = document.createTextNode("DETAILS");
    const checkHeaderText = document.createTextNode("SELECT");
    viewHeader.appendChild(viewHeaderText);
    checkHeader.appendChild(checkHeaderText);
    row.appendChild(viewHeader);
    row.appendChild(checkHeader);

    // Create table body
    const tbody = table.createTBody();
    // Populate table rows
    for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        const row = tbody.insertRow();

        if (obj["hr_approval"] === false) {
            row.style.backgroundColor = "lightgray";
        }

        // Populate cells with data
        for (let j = 1; j < Object.keys(obj).length; j++) {
            const key = Object.keys(obj)[j];
            const cell = row.insertCell();
            const text = document.createTextNode(obj[key]);
            cell.appendChild(text);
        }

        // Add "View" anchor cell
        const viewCell = row.insertCell();
        const viewAnchor = document.createElement("a");
        viewAnchor.setAttribute("href", `/detailedappview?appId=${obj.appid}`);
        const viewText = document.createTextNode("View");
        viewAnchor.appendChild(viewText);
        viewCell.appendChild(viewAnchor);


        // Add "Check" anchor cell
        const checkCell = row.insertCell();
        const checkAnchor = document.createElement("input");
        checkAnchor.type = "checkbox";
        const idKey = Object.keys(obj)[0];
        checkAnchor.id = obj[idKey];
        console.log(idKey);
        checkCell.appendChild(checkAnchor);
    }
    table.id = "myTable";
    return table;
}

function addExportButtons(table) {
    // Create export buttons
    const csvButton = document.createElement("button");
    csvButton.textContent = "Export CSV";
    csvButton.addEventListener("click", function () {
        exportToCSV(table);
    });
    // Append buttons to container
    container.appendChild(csvButton);
}

function exportToCSV(table) {
    // Select all table rows except the header
    const rows = table.querySelectorAll('tbody > tr');

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header row
    const headerRow = [];
    table.querySelectorAll('thead th').forEach(th => {
        headerRow.push(th.textContent);
    });
    csvContent += headerRow.join(",") + "\n";

    // Add data rows
    rows.forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(cell => {
            rowData.push(cell.textContent);
        });
        csvContent += rowData.join(",") + "\n";
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const currentDate = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `applications_${currentDate}.csv`);
    document.body.appendChild(link); // Required for Firefox
    link.click();
}

// Get all input elements
const inputs = document.querySelectorAll("#set-weights input");

// Attach event listener to each input element
inputs.forEach(input => {
    input.addEventListener("input", findWeightSum);
});

function findWeightSum() {
    const sum_section = document.getElementById("weight_sum");
    let sum = 0;
    for (let input of inputs) {
        sum += Number(input.value);
    }
    if (sum === 100) {
        sum_section.style.color = 'green';
        sum_section.textContent = `${sum}% - Ready to submit`;
        button.disabled = false;
    }
    else {
        sum_section.style.color = 'black';
        sum_section.textContent = `${sum}%`;
        button.disabled = true;

    }
}

async function rankApp(jobId, values) {
    try {
        showLoadingPopup();
        const appData = await fetch(`/getData/appData?jobId=${jobId}`, {
            method: 'GET',
            credentials: 'include'
        })
        const data = await appData.json()
        data.weights = values;
        console.log(data);
        const response = await fetch('http://localhost:5000/rankApp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        hideLoadingPopup();
        location.reload();
        return responseData;
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        hideLoadingPopup();
    }
}

function showLoadingPopup() {
    document.getElementById("loading-message").classList = 'showLoading';
}

function hideLoadingPopup() {
    document.getElementById("loading-message").classList = 'hideLoading';

}


const toggleWeights = document.getElementById('toggle-weights');
const options = document.querySelector('#options');
toggleWeights.addEventListener('click', (event) => {
    event.preventDefault();
    options.classList.toggle("showOptions");
    options.classList.toggle("hideOptions");
})

function countSelected() {
    const table = document.getElementById("myTable");
    const checkboxes = table.querySelectorAll("INPUT");
    const selectedBoxes = [];
    for (elem of checkboxes) {
        if (elem.checked) {
            selectedBoxes.push(elem.id);
        }
    }
    return selectedBoxes;
}


function countAll() {
    const table = document.getElementById("myTable");
    const checkboxes = table.querySelectorAll("INPUT");
    const selectedBoxes = [];
    for (elem of checkboxes) {
        selectedBoxes.push(elem.id);
    }
    return selectedBoxes;
}

async function changeStatus(state) {
    const ids = countSelected();
    if (ids.length > 0) {
        try {
            console.log("HERE PLEASE")
            const idsList = ids.join(', ');
            const requestData = {
                ids: idsList,
                status: state
            }
            const response = await fetch("/updateStatus", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            if (!response.ok) {
                throw new Error('Failed to update status. Please try again later.');
            }

            const data = await response.json();
            console.log('Server response:', data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById("error-message").innerHTML = "An error occurred while updating status.";
            setTimeout(() => {
                document.getElementById("error-message").innerHTML = "";
            }, 3000);
        }
    } else {
        document.getElementById("error-message").innerHTML = "Please select at least one candidate";
        setTimeout(() => {
            document.getElementById("error-message").innerHTML = "";
        }, 3000);
    }
}

async function downloadCv() {
    const appids = countSelected(); // Assuming countSelected returns an array of appids

    for (let appid of appids) {
        try {
            console.log(appid);
            const response = await fetch(`/getData/appToUserId`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ appid })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);


            const url = `/download?userId=${data.userId}`;
            const downloadResponse = await fetch(url);

            if (!downloadResponse.ok) {
                throw new Error('Network response for download was not ok');
            }

            const blob = await downloadResponse.blob();
            const fileUrl = window.URL.createObjectURL(blob);

            // Simulate click on link to trigger download
            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = `${data.userId}.pdf`;
            a.click();
            window.URL.revokeObjectURL(fileUrl);

        } catch (error) {
            console.error('Error:', error);
        }
    }
}

async function sendStatusUpdates() {
    const appids = countAll(); // Assuming countSelected returns an array of appids
    const confirmation = prompt("All applications that have been accepted/rejected will be emailed (pending applications won't be contacted). Please type 'Yes' to confirm");

    if (confirmation.toLowerCase() !== "yes") {
        alert("Emails have not been sent. Please confirm by typing 'Yes'.");
        return;
    }

    else {
        let emailConfirmation = "All statuses have been emailed successfully";
        for (let appid of appids) {
            try {
                console.log(appid);
                const response = await fetch(`/getData/appToEmail`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ appid })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
            }
            catch (error) {
                console.error('Error:', error);
                emailConfirmation = "Unknown error occurred - emails cannot be sent, contact support before resending";
            }

        }
        alert(emailConfirmation);
    }
}


function updateCount() {
    const count = document.getElementById("selected-count");
    count.innerHTML = `selected: ${countSelected().length}`;
}

document.getElementById("update-status-button").addEventListener("click", async (e) => {
    e.preventDefault();
    await changeStatus(document.getElementById("status-options").value);
    location.reload();
})