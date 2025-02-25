const inputZip = document.getElementById('inputZip')
const zipResult = document.getElementById('zipResult')

function fetchZipResults() {
    const zip = inputZip.value;
    surgeonResult.classList.add('d-none');
    if (!/^\d{5}$/.test(zip)) {
        zipResult.style.display = 'block';
        zipResult.innerHTML = '<p>Please enter a valid 5-digit ZIP code.</p>';
        return;
    }
    
    // AJAX request to PHP
    var xhr = new XMLHttpRequest();
    console.log('URL:', `php/find_by_zip.php?search=${zip}`);
    xhr.open('GET', `php/find_by_zip.php?search=${zip}`, true);

    xhr.onload = function() {
        if (this.status == 200) {
            // Process the data returned from the PHP script
            const data = JSON.parse(this.responseText);
            if (data.error) {
                zipResult.style.display = 'block';
                zipResult.innerHTML = `<p>${data.error}</p>`;
            } else {
                displayZipResults(data);
            }
        } else {
            console.error("Error: " + this.status);
            zipResult.style.display = 'block';
            zipResult.innerHTML = "<p>Error fetching data.</p>";
            }
      };

    xhr.onerror = function() {
        console.error('Network Error');
        zipResult.style.display = 'block'
        zipResult.innerHTML = '<p>Network error. Please try again later.</p>';
    }
    
    xhr.send();
}

function displayZipResults(data) {
    zipResult.style.display = 'block'
    zipResult.innerHTML = '';
    
    if (!data || data.length === 0) {
        zipResult.innerHTML = '<tr><td colspan="99">No data found.</td></tr>';
        return;
    }
    
    // column header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headerNPI = document.createElement('th');
    headerNPI.textContent = 'NPI';
    headerRow.appendChild(headerNPI);

    const headerFirstName = document.createElement('th');
    headerFirstName.textContent = 'First Name';
    headerRow.appendChild(headerFirstName);

    const headerLastName = document.createElement('th');
    headerLastName.textContent = 'Last Name';
    headerRow.appendChild(headerLastName);
    
    const headerStreetAddress1 = document.createElement('th');
    headerStreetAddress1.textContent = 'Address'
    headerRow.appendChild(headerStreetAddress1);
    
    const headerCity = document.createElement('th');
    headerCity.textContent = 'City'
    headerRow.appendChild(headerCity);
    
    const headerState = document.createElement('th');
    headerState.textContent = 'State'
    headerRow.appendChild(headerState);
    
    const headerZip = document.createElement('th');
    headerZip.textContent = 'ZIP'
    headerRow.appendChild(headerZip);

    thead.appendChild(headerRow);
    zipResult.appendChild(thead);
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        const npi = document.createElement('td');
        npi.textContent = item.NPI
        row.appendChild(npi);
        
        const firstName = document.createElement('td');
        firstName.textContent = item.first_name
        row.appendChild(firstName);
        
        const lastName = document.createElement('td');
        lastName.textContent = item.last_name
        row.appendChild(lastName)
        
        const streetAddress1 = document.createElement('td');
        streetAddress1.textContent = item.street_address_1
        row.appendChild(streetAddress1)
        
        const city = document.createElement('td');
        city.textContent = item.city
        row.appendChild(city)
        
        const state = document.createElement('td');
        state.textContent = item.state
        row.appendChild(state)
        
        const zip = document.createElement('td');
        zip.textContent = item.zip
        row.appendChild(zip)
        
        zipResult.appendChild(row);
    });
}

inputZip.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        console.log('User pressed enter. Input:', inputZip.value);
        fetchZipResults();
    }
});