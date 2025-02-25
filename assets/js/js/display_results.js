let currentPage = 1; // page numbers 1-indexed
const rowsPerPage = 7;
let allData = []

function displayResults(data) {
    allData = data;
    updateTable();
}

function updateTable() {
    expandedSection.style.display = 'block';
    resultsTable.innerHTML = '';
    
    if (!allData || allData.length === 0) {
        resultsTable.innerHTML = '<tr><td colspan="99">No data found.</td></tr>';
        return;
    }
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = allData.slice(startIndex, endIndex);
    console.log(startIndex + "-" + endIndex);
    pageData.forEach(item => {
        console.log(item.first_name);
        const row = document.createElement('tr');
        row.style.height = '100px';
        
        const fullName = document.createElement('td');
        fullName.innerHTML = `<span style="font-size: 1.2em; font-weight: bold;">${item.first_name} ${item.last_name}, ${item.degree}</span>`;
        fullName.style.padding = '10px';
        row.appendChild(fullName);
        
        const address = document.createElement('td');
        address.innerHTML = `${item.street_address_1}<br>${item.city}, ${item.state} ${item.zip}`;
        address.style.padding = '10px';
        row.appendChild(address);
        
        const topCpts = document.createElement('td');
        topCpts.innerHTML = `<b>Top services</b><br>${item.hcpcs_desc_1}<br>${item.hcpcs_desc_2}<br>${item.hcpcs_desc_3}<br>${item.hcpcs_desc_4}<br>${item.hcpcs_desc_4}<br>${item.hcpcs_desc_5}`;
        topCpts.style.padding = '10px';
        row.appendChild(topCpts);
        
        resultsTable.appendChild(row);
    });
    
    updatePaginationControls();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(allData.length / rowsPerPage);
    const paginationDiv = document.getElementById('pagination');
    
    paginationDiv.innerHTML = '';
    
    // prev buttion
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        currentPage--;
        updateTable();
    });
    paginationDiv.appendChild(prevButton);
    
    // page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.disabled = currentPage === i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            updateTable();
        });
        paginationDiv.appendChild(pageButton);
    }
    
    // next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        currentPage++;
        updateTable();
    });
    paginationDiv.appendChild(nextButton);
}