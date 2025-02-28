const inputSurgeon = document.getElementById('inputSurgeon')
const getInsightsButton = document.getElementById('getInsightsButton')
const surgeonResult = document.getElementById('surgeonResult')

function fetchSurgeonResults() {
    const npi = inputSurgeon.value;
    // AJAX request to PHP
    var xhr = new XMLHttpRequest();
    console.log('URL:', 'php/find_surgeon.php?search=' + encodeURIComponent(npi));
    xhr.open('GET', 'php/find_surgeon.php?search=' + encodeURIComponent(npi), true);

    xhr.onload = function() {
    zipResult.style.display = 'none';
    if (this.status == 200) {
        // Process the data returned from the PHP script
        var data = JSON.parse(this.responseText);
        surgeonResult.classList.remove('d-none');
        surgeonResult.innerHTML = '';
        data.forEach(function(item) {
            surgeonResult.innerHTML += '<p>NPI: ' + item['COL 1'] + ', Dr. ' + item['COL 2'] + item['COL 3'] + '</p>';
        });

    } else {
        console.error("Error: " + this.status);
        surgeonResult.innerHTML = "<p>Error fetching data.</p>";
        }
      };

    xhr.onerror = function() {
        console.error('Network Error');
        surgeonResult.innerHTML = '<p>Network error. Please try again later.</p>';
    }
    
    xhr.send();
}

inputSurgeon.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        console.log('User pressed enter. Input:', inputSurgeon.value);
        fetchSurgeonResults();
    }
});
    
if (getInsightsButton) {
    getInsightsButton.addEventListener('click', function() {
        console.log("Button clicked.");
        if (inputSurgeon.value.trim()) {
            console.log('User entered surgeon. Input:', inputSurgeon.value);
            fetchSurgeonResults();
        } else if (inputZip.value.trim()) {
            console.log('User entered ZIP. Input:', inputZip.value);
            fetchZipResults();
        } else {
            console.log("Both inputs are empty.");
            alert("Please enter a search info.");
        }
    });
}