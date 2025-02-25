function fetchByZip() {
    const zip = inputZip.value;
    if (!/^\d{5}$/.test(zip)) {
        expandedSection.style.display = 'block';
        resultsTable.innerHTML = '<tr><td colspan="99">Please enter a valid 5-digit ZIP code.</td></tr>';
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
                expandedSection.style.display = 'block';
                resultTable.innerHTML = '<tr><td colspan="99">${data.error}</td></tr>';
            } else {
                displayResults(data);
            }
        } else {
            console.error("Error: " + this.status);
            expandedSection.style.display = 'block';
            resultsTable.innerHTML = '<tr><td colspan="99">Error fetching data.</td></tr>';
            }
      };

    xhr.onerror = function() {
        console.error('Network Error');
        expandedSection.style.display = 'block'
        resultsTable.innerHTML = '<tr><td colspan="99">Network error.</td></tr>';
    }
    
    xhr.send();
}