async function getDelegatedTasks() {
    try {
        const response = await fetch("/hr/delegatedTasks");
        if (!response.ok)
            throw new Error("Failed to fetch data");
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching tasks data:", error);
        return null;
    }
}

async function displayUniqueCombinations(data, containerId) {
    const container = document.getElementById(containerId);

    // Create an object to store unique combinations of task_description and assigned_by
    const uniqueCombinations = {};

    // Extract unique combinations from the data
    data.forEach(item => {
        const combination = `${item.task_description}_${item.assigned_by}`;
        // Check if the combination already exists in the object
        if (!uniqueCombinations.hasOwnProperty(combination)) {
            // If not, initialize an empty array for appids
            uniqueCombinations[combination] = {
                rowData: [],
                appids: [],
                taskids: []
            };
        }
        // Add the appid to the array for this combination
        uniqueCombinations[combination].appids.push(item.appid);
        uniqueCombinations[combination].taskids.push(item.taskid);
        // Add the row data to the array for this combination
        uniqueCombinations[combination].rowData.push(item);
    });

    // Create a paragraph for each unique combination
    for (const combination in uniqueCombinations) {
        if (uniqueCombinations.hasOwnProperty(combination)) {
            const completedBtnDiv = document.createElement('div');
            const completedBtn = document.createElement('button');
            completedBtn.textContent = "Complete Task";
            completedBtnDiv.appendChild(completedBtn);
            const paragraph = document.createElement('p');
            const description = document.createElement('p');
            const appIds = document.createElement('p');
            const taskDiv = document.createElement('div');
            taskDiv.className = "task-div";
            paragraph.innerHTML = `<strong>Task Description</strong>: ${combination.split('_')[0]}`;
            description.textContent = `Assigned by: ${combination.split('_')[1]}`;
            appIds.textContent = `AppIDs: ${uniqueCombinations[combination].appids.join(', ')}`;
            taskDiv.appendChild(paragraph);
            taskDiv.appendChild(description);
            taskDiv.appendChild(appIds);
            taskDiv.appendChild(completedBtnDiv);
            container.appendChild(taskDiv);

            // Pass the row data for this combination to the generateTable function
            const rowData = uniqueCombinations[combination].rowData;
            completedBtn.onclick = async () => {
                await completeTask(uniqueCombinations[combination].taskids);
            };
            const rowDataCols = ["taskid", "appid"]; // Define the columns needed for generateTable
            generateTable(rowData, rowDataCols, containerId); // Call generateTable function
        }
    }
}

async function completeTask(ids) {
    try {
        console.log(ids);
        for (let taskid of ids) {
            const response = await fetch(`/hr/completeTask?taskId=${taskid}`)
            const data = await response.json()
            console.log(data);
        }
    } catch (error) {
        console.log("Error in task completion: ", error);
    }
}

function generateTable(data, columns, con) {
    console.log("Entered generateTable")
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

    for (let i = 0; i < data.length; i++) {
        const row = document.createElement('tr');
        columns.forEach(column => {
            const cell = document.createElement('td');
            cell.textContent = data[i][column] || ''; // Display empty string if value is null or undefined
            row.appendChild(cell);
        });
        // Add "View" anchor tag to each row
        const viewCell = document.createElement('td');
        const viewAnchor = document.createElement('a');
        viewAnchor.textContent = "View";
        viewAnchor.href = `/detailedappview?appId=${data[i]["appid"]}`; // Assuming each row has an "id" property
        viewCell.appendChild(viewAnchor);
        row.appendChild(viewCell);
        table.appendChild(row);
    }
    container.appendChild(table);
}



document.addEventListener("DOMContentLoaded", async () => {
    const allTasks = await getDelegatedTasks();
    console.log(allTasks);

    displayUniqueCombinations(allTasks, "task-heading")
})