let currentPage = 1; // page numbers 1-indexed
const rowsPerPage = 7;
let allData = []

function displayResults(data) {
    allData = data;
    updateTable();
}

// assures red-banner-parent is always below expandedSection
function adjustBannerPosition() {
    const redBannerParent = document.getElementById('red-banner-parent');
    console.log(window.innerWidth);
    if (expandedSection.style.display !== 'none' && window.innerWidth <= 545) {
        console.log('here');
        const expandedHeight = expandedSection.offsetHeight;
        redBannerParent.style.marginTop = expandedHeight + 'px';
    } else {
        redBannerParent.style.marginTop = '0';
    }
}

window.addEventListener('resize', adjustBannerPosition);

function getStarRating(itemMetric) {
    if (!itemMetric || isNaN(itemMetric)) return '';
    const starRating = Math.round(itemMetric / 20);
    return starRating > 0 ? '⭐'.repeat(starRating) : '';
}

function updateTable() {
    expandedSection.style.display = 'block';
    adjustBannerPosition();
    resultsTable.innerHTML = '';
    
    if (!allData || allData.length === 0) {
        resultsTable.innerHTML = '<tr><td colspan="99">No data found.</td></tr>';
        return;
    }
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = allData.slice(startIndex, endIndex);
    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.style.height = '100px';
        
        const cleanDegree = item.degree.replace(/\./g, '');
        const fullName = document.createElement('td');
        fullName.innerHTML = `<span style="font-size: 1.2em; font-weight: bold;">${item.first_name} ${item.last_name}, ${cleanDegree}</span>`;
        fullName.style.padding = '10px';
        row.appendChild(fullName);
        
        const address = document.createElement('td');
        address.innerHTML = `${item.street_address_1}<br>${item.city}, ${item.state} ${item.zip}`;
        if (inputZip.value.trim()) {
            address.innerHTML += `<br>📍${Math.round(item.distance, 2)} miles from you`;
        }
        address.style.padding = '10px';
        row.appendChild(address);
        
        const totInfo = document.createElement('td');
        const stars = getStarRating(item.tot_percentile);
        const totCount = Math.ceil(item.tot_count);
        totInfo.innerHTML = `<b>Total services</b>
        <br>${stars}<br>${totCount} services 2013-2022<br>${Math.round(item.tot_percentile, 2)}th percentile`;
        totInfo.style.padding = '10px';
        row.appendChild(totInfo);
        
        const specInfo = document.createElement('td');
        const cranialStars = getStarRating(item.cranial_percentile);
        const spinalStars = getStarRating(item.spinal_percentile);
        const endovascularStars = getStarRating(item.endovascular_percentile);
        const peripheralStars = getStarRating(item.peripheral_percentile);
        specInfo.innerHTML += `<b>Speciality ratings</b><br>`;
        if (cranialStars) specInfo.innerHTML += `Cranial: ${cranialStars} - ${Math.round(item.cranial_percentile, 2)}th % - ${item.cranial_count} # serv - (${item.cranial_rank} of ${item.total_results})<br>`;
        if (spinalStars) specInfo.innerHTML += `Spinal: ${spinalStars} - ${Math.round(item.spinal_percentile, 2)}<br>`;
        if (endovascularStars) specInfo.innerHTML += `Endovascular: ${endovascularStars} - ${Math.round(item.endovascular_percentile, 2)}<br>`;
        if (peripheralStars) specInfo.innerHTML += `Peripheral: ${peripheralStars} - ${Math.round(item.peripheral_percentile, 2)}<br>`;
        specInfo.style.padding = '10px';
        row.appendChild(specInfo);
        
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