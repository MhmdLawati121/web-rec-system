async function getJobsAwaitingApproval() {
    try {
        const response = await fetch("/hr/jobsAwaitingApproval");
        if (!response.ok)
            throw new Error("failed to fetch data");
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}
// Function to dynamically generate the table
function generateTable(data, columns, con) {
    const container = document.getElementById(con);
    const table = document.createElement('table');
    table.id = "myTable";

    // Create thead element and append it to the table
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Create table headers based on specified columns
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });
    const thView = document.createElement('th');
    thView.textContent = "View Details";
    headerRow.appendChild(thView);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create tbody element and append it to the table
    const tbody = document.createElement('tbody');

    // Create table rows and cells for each object
    data.forEach(item => {
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
        viewAnchor.href = `/hr/jobDetailsForApproval?jobId=${item["jobid"]}`; // Assuming each row has an "id" property
        viewCell.appendChild(viewAnchor);
        row.appendChild(viewCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    container.appendChild(table);
}


document.addEventListener('DOMContentLoaded', async () => {

    const data = await getJobsAwaitingApproval();
    const cols = ["jobid", "title", "college", "spec", "email"];
    const con = "view-jobs-container";

    generateTable(data, cols, con);
    console.log("im here");
    $('#myTable').DataTable();


})