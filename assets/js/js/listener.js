const inputZip = document.getElementById('inputZip')
const distanceSlider = document.getElementById('distanceSlider');
const inputSurgeon = document.getElementById('inputSurgeon')

const expandedSection = document.getElementById('expanded-section')
const resultsTable = document.getElementById('resultsTable')

if (getInsightsButton) {
    getInsightsButton.addEventListener('click', function() {
        console.log("Button clicked.");
        if (inputSurgeon.value.trim()) {
            console.log('User entered surgeon. Input:', inputSurgeon.value);
            fetchBySurgeon();
        } else if (inputZip.value.trim() || (inputType.value && inputType.value !== 'Select a surgical type')) {
            console.log('User entered ZIP. Input zip:', inputZip.value, 
                       'User entered distance radius:', distanceSlider.value);
            //fetchByZip();
            fetch();
        } else {
            console.log("All input fields are empty.");
            alert("Please enter search info.");
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
        console.log('User pressed enter. Input zip: ', inputZip.value, 'User entered distance radius: ', distanceSlider.value);
        fetchByZip();
    }
});