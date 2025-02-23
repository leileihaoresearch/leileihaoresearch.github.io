const inputSurgeon = document.getElementById('inputSurgeon')
const getInsightsButton = document.getElementById('getInsightsButton')
const surgeonResult = document.getElementById('surgeonResult')

function fetchResults() {
    var searchTerm = document.getElementById('inputSurgeon').value;
    // AJAX request to PHP
    var xhr = new XMLHttpRequest();
    console.log('URL:', 'php/sql_query.php?search=' + encodeURIComponent(searchTerm));
    xhr.open('GET', 'php/sql_query.php?search=' + encodeURIComponent(searchTerm), true);

    xhr.onload = function() {
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

inputSurgeon.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        console.log('User pressed enter. Input:', inputSurgeon.value);
        fetchResults();
    }
});
    
if(getInsightsButton){
    getInsightsButton.addEventListener('click', function() {
        console.log('User clicked get insights button. Input:', inputSurgeon.value);
        fetchResults();
    });
 }