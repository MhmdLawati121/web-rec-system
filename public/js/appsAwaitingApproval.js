async function getAppsAwaitingApproval() {
    try {
        const response = await fetch(`/hr/nonAcademicOmani`);
        if (!response.ok)
            throw new Error("Failed to fetch data");
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

async function approveApplication(id) {
    const response = await fetch(`/hr/approveApplication?appId=${id}`, {
        method: 'POST'
    })
    if (response.ok)
        console.log("Successfully Approved");
    else
        console.log("Error has occured - application was not approved")
}

// Function to dynamically generate the table
function generateTable(data, columns, con) {
    const container = document.getElementById(con);

    // Group data by jobid
    const groupedData = {};
    data.forEach(item => {
        if (!groupedData[item.jobid]) {
            groupedData[item.jobid] = [];
        }
        groupedData[item.jobid].push(item);
    });

    // Create a table for each jobid
    Object.keys(groupedData).forEach(jobid => {
        const jobTitle = groupedData[jobid][0].title;
        const jobCollege = groupedData[jobid][0].college;

        // Create header row with job title and college
        const headerRowAboveTable = document.createElement('div');
        headerRowAboveTable.classList.add("jobHeader");
        headerRowAboveTable.textContent = `Job Title: ${jobTitle}, College: ${jobCollege}`;
        container.appendChild(headerRowAboveTable);

        const table = document.createElement('table');
        table.classList.add("jobTable");
        table.dataset.jobid = jobid;

        // Create thead element and append it to the table
        const thead = document.createElement('thead');
        const theadHeaderRow = document.createElement('tr');

        // Create table headers based on specified columns
        columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column.split("_")[0];
            theadHeaderRow.appendChild(th);
        });
        const thView = document.createElement('th');
        thView.textContent = "View Details";
        theadHeaderRow.appendChild(thView);

        thead.appendChild(theadHeaderRow);
        table.appendChild(thead);

        // Create tbody element and append it to the table
        const tbody = document.createElement('tbody');

        // Create table rows and cells for each object
        groupedData[jobid].forEach(item => {
            const row = document.createElement('tr');
            columns.forEach(column => {
                const cell = document.createElement('td');
                cell.textContent = item[column] || ''; // Display empty string if value is null or undefined
                row.appendChild(cell);
            });
            // Add "View" anchor tag to each row
            const viewCell = document.createElement('td');
            const viewAnchor = document.createElement('a');
            viewAnchor.textContent = "View";
            viewAnchor.href = `/detailedappview?appId=${item["appid"]}`; // Assuming each row has an "id" property
            viewCell.appendChild(viewAnchor);
            row.appendChild(viewCell);

            // Add "Approve" button
            const approveCell = document.createElement('td');
            const approveButton = document.createElement("button");
            approveButton.classList.add("approve-btn")
            approveButton.textContent = "approve";
            approveButton.onclick = () => approveApplication(item["appid"]);
            approveCell.appendChild(approveButton);
            row.appendChild(approveCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        const spaceBetween = document.createElement('br');

        container.appendChild(table);
        container.appendChild(spaceBetween);
    });
}



document.addEventListener('DOMContentLoaded', async () => {

    const appData = await getAppsAwaitingApproval();
    const appDataCols = ["first_name", "last_name", "email", "civil_id", "phone"]
    generateTable(appData, appDataCols, 'apps-container');

    generateTable(data, cols, con);
    $('#myTable').DataTable();


})