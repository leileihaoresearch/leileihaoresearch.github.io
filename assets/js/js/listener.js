const inputZip = document.getElementById('inputZip')
const inputSurgeon = document.getElementById('inputSurgeon')

const expandedSection = document.getElementById('expandedSection')
const resultsTable = document.getElementById('resultsTable')

if (getInsightsButton) {
    getInsightsButton.addEventListener('click', function() {
        console.log("Button clicked.");
        if (inputSurgeon.value.trim()) {
            console.log('User entered surgeon. Input:', inputSurgeon.value);
            fetchBySurgeon();
        } else if (inputZip.value.trim()) {
            console.log('User entered ZIP. Input:', inputZip.value);
            fetchByZip();
        } else {
            console.log("Both inputs are empty.");
            alert("Please enter a search info.");
        }
    });
}

inputSurgeon.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        console.log('User pressed enter. Input:', inputSurgeon.value);
        fetchBySurgeon();
    }
});

inputZip.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        console.log('User pressed enter. Input:', inputZip.value);
        fetchByZip();
    }
});