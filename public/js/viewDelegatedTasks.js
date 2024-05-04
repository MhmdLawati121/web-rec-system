function generateDelegationsTable(data, columns, con) {
    const container = document.getElementById(con);

    // Group delegations by task_description and jobid
    const groupedDelegations = {};
    data.forEach(delegation => {
        const key = `${delegation.task_description}_${delegation.jobid}`;
        if (!groupedDelegations[key]) {
            groupedDelegations[key] = [];
        }
        groupedDelegations[key].push(delegation);
    });

    // Create table for each group, displaying only the first 10 delegations
    for (const key in groupedDelegations) {
        const delegations = groupedDelegations[key].slice(0, 10); // Limit to the first 10 delegations

        // Create a paragraph element with assigned_by and task_description
        const assigned_by = document.createElement('p');
        const description = document.createElement('p');
        assigned_by.textContent = `Assigned by: ${delegations[0].assigned_by}`;
        description.textContent = `Task Description: ${delegations[0].task_description}`
        container.appendChild(assigned_by);
        container.appendChild(description);

        const table = document.createElement('table');
        const headerRow = document.createElement('tr');

        // Create table headers based on specified columns
        columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Create table rows and cells for each delegation
        delegations.forEach(delegation => {
            const row = document.createElement('tr');
            columns.forEach(column => {
                const cell = document.createElement('td');
                cell.textContent = delegation[column] || ''; // Display empty string if value is null or undefined
                row.appendChild(cell);
            });
            table.appendChild(row);
        });

        container.appendChild(table);

    }
}
