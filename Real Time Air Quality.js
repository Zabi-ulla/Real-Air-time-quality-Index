// Get references to DOM elements
const locationInput = document.getElementById('locationInput');
const fetchButton = document.getElementById('fetchButton');
const statusLabel = document.getElementById('statusLabel');
const aqiLabel = document.getElementById('aqiLabel');
const adviceOutput = document.getElementById('adviceOutput');

// Event listener for the fetch button
fetchButton.addEventListener('click', async () => {
    // Get the location entered by the user, trim whitespace
    const location = locationInput.value.trim();

    // Input validation: Check if location is empty
    if (location === '') {
        statusLabel.textContent = 'Please enter a location.';
        statusLabel.style.color = 'red'; // Set text color to red for error
        aqiLabel.textContent = '---'; // Reset AQI display
        adviceOutput.textContent = ''; // Clear advice
        return; // Stop function execution
    }

    // Disable the button and update status to indicate fetching
    fetchButton.disabled = true; // Disable button to prevent multiple clicks
    statusLabel.textContent = `Fetching AQI for ${location}...`;
    statusLabel.style.color = 'blue'; // Set text color to blue for pending state

    // Clear previous AQI and advice
    aqiLabel.textContent = '---';
    adviceOutput.textContent = '';
    // Remove any previous AQI color classes
    aqiLabel.classList.remove('aqi-good', 'aqi-moderate', 'aqi-unhealthy-sensitive', 'aqi-unhealthy', 'aqi-very-unhealthy', 'aqi-hazardous');


    try {
        // Simulate fetching AQI data asynchronously
        // In a real application, this would be a fetch() call to a real AQI API.
        const aqi = await simulateAqiDataFetch(location);

        // If data is successfully fetched:
        statusLabel.textContent = 'AQI fetched successfully!';
        statusLabel.style.color = 'green'; // Set text color to green for success

        aqiLabel.textContent = aqi; // Display the fetched AQI
        setAqiColor(aqi); // Set AQI color based on value
        adviceOutput.textContent = getAdviceBasedOnAqi(aqi); // Display health advice

    } catch (error) {
        // If an error occurs during fetching:
        statusLabel.textContent = `Error fetching AQI: ${error.message}. Make sure the server is running.`;
        statusLabel.style.color = 'red'; // Set text color to red for error
        aqiLabel.textContent = '---'; // Reset AQI display
        adviceOutput.textContent = 'Could not retrieve health advice due to data fetching error.';
    } finally {
        // Re-enable the fetch button regardless of success or failure
        fetchButton.disabled = false;
    }
});

/**
 * Simulates fetching AQI data from a server.
 * In a real application, this would be an actual API call (e.g., using `fetch()`).
 * This simulation introduces a random delay and a chance of throwing an error.
 * @param {string} location - The location for which to fetch AQI. (Not used in simulation logic, only for context)
 * @returns {Promise<number>} A Promise that resolves with a simulated AQI value (0-300) or rejects with an error.
 */
async function simulateAqiDataFetch(location) {
    return new Promise((resolve, reject) => {
        // Simulate network delay between 1 and 3 seconds
        const delay = Math.floor(Math.random() * 3000) + 1000;
        setTimeout(() => {
            // Simulate a 20% chance of a server error
            if (Math.random() < 0.20) {
                reject(new Error('Simulated server error or no data for this location.'));
            } else {
                // Simulate AQI value between 0 and 300
                const aqi = Math.floor(Math.random() * 301);
                resolve(aqi);
            }
        }, delay);
    });
}

/**
 * Provides health advice based on the given AQI value.
 * This logic is based on standard AQI categories and general health recommendations.
 * @param {number} aqi - The Air Quality Index value.
 * @returns {string} A string containing health advice.
 */
function getAdviceBasedOnAqi(aqi) {
    if (aqi >= 0 && aqi <= 50) {
        return "Air quality is good. It's a great day for outdoor activities for everyone. " +
               "No specific precautions are needed.";
    } else if (aqi > 50 && aqi <= 100) {
        return "Air quality is acceptable. However, individuals unusually sensitive to air pollution " +
               "should consider limiting prolonged outdoor exertion. Most people are not likely to be affected.";
    } else if (aqi > 100 && aqi <= 150) {
        return "Air quality is unhealthy for sensitive groups (e.g., people with lung disease, older adults, children). " +
               "These groups should reduce prolonged or heavy outdoor exertion. Everyone else should be fine.";
    } else if (aqi > 150 && aqi <= 200) {
        return "Air quality is unhealthy. Sensitive groups should avoid all outdoor exertion. " +
               "Everyone else should reduce prolonged or heavy outdoor exertion. Consider staying indoors.";
    } else if (aqi > 200 && aqi <= 300) {
        return "Air quality is very unhealthy. Sensitive groups should remain indoors and keep activity levels low. " +
               "Everyone else should avoid all outdoor exertion. Wear a mask if you must go outside.";
    } else {
        // Covers AQI > 300 or unexpected negative values
        return "Air quality is hazardous. Everyone should avoid all outdoor physical activity. " +
               "Sensitive groups should remain indoors and keep activity levels low. Consider evacuating if advised by authorities.";
    }
}

/**
 * Sets the text color of the AQI label based on its value.
 * This function also adds a CSS class for more complex styling if desired.
 * @param {number} aqi - The Air Quality Index value.
 */
function setAqiColor(aqi) {
    // Remove any previous color classes before applying a new one
    aqiLabel.classList.remove('aqi-good', 'aqi-moderate', 'aqi-unhealthy-sensitive', 'aqi-unhealthy', 'aqi-very-unhealthy', 'aqi-hazardous');

    if (aqi >= 0 && aqi <= 50) {
        aqiLabel.style.color = '#28a745'; // Green
        aqiLabel.classList.add('aqi-good');
    } else if (aqi > 50 && aqi <= 100) {
        aqiLabel.style.color = '#ffc107'; // Yellow
        aqiLabel.classList.add('aqi-moderate');
    } else if (aqi > 100 && aqi <= 150) {
        aqiLabel.style.color = '#fd7e14'; // Orange
        aqiLabel.classList.add('aqi-unhealthy-sensitive');
    } else if (aqi > 150 && aqi <= 200) {
        aqiLabel.style.color = '#dc3545'; // Red
        aqiLabel.classList.add('aqi-unhealthy');
    } else if (aqi > 200 && aqi <= 300) {
        aqiLabel.style.color = '#6f42c1'; // Purple
        aqiLabel.classList.add('aqi-very-unhealthy');
    } else { // AQI > 300 (Hazardous)
        aqiLabel.style.color = '#212529'; // Dark Gray/Black
        aqiLabel.classList.add('aqi-hazardous');
    }
}
