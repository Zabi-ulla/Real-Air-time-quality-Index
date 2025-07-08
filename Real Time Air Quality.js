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
                adviceOutput.textContent = 'Enter a location to see health advice.'; // Clear advice
                aqiLabel.style.color = '#9ca3af'; // Reset color to default gray
                adviceOutput.className = 'text-center text-gray-700 p-4 rounded-lg min-h-[100px] border-l-4';
                return; // Stop function execution
            }

            // Disable the button and update status to indicate fetching
            fetchButton.disabled = true; // Disable button to prevent multiple clicks
            statusLabel.textContent = `Fetching AQI for ${location}...`;
            statusLabel.style.color = 'blue'; // Set text color to blue for pending state

            // Clear previous AQI and advice
            aqiLabel.textContent = '---';
            aqiLabel.style.color = '#9ca3af';
            adviceOutput.textContent = '';
            // Remove any previous AQI color classes
            adviceOutput.className = 'text-center text-gray-700 p-4 rounded-lg min-h-[100px] border-l-4';


            try {
                // Simulate fetching AQI data asynchronously
                const aqi = await simulateAqiDataFetch(location);

                // If data is successfully fetched:
                statusLabel.textContent = 'AQI fetched successfully!';
                statusLabel.style.color = 'green'; // Set text color to green for success

                aqiLabel.textContent = aqi; // Display the fetched AQI
                setAqiPresentation(aqi); // Set AQI color and advice based on value

            } catch (error) {
                // If an error occurs during fetching:
                statusLabel.textContent = `Error: ${error.message}`;
                statusLabel.style.color = 'red'; // Set text color to red for error
                aqiLabel.textContent = '---'; // Reset AQI display
                adviceOutput.textContent = 'Could not retrieve health advice due to a data fetching error.';
            } finally {
                // Re-enable the fetch button regardless of success or failure
                fetchButton.disabled = false;
            }
        });

        /**
         * Simulates fetching AQI data from a server.
         * In a real application, this would be an actual API call (e.g., using `fetch()`).
         * This simulation introduces a random delay and a chance of throwing an error.
         * It also includes specific logic to always fail for certain cities.
         * @param {string} location - The location for which to fetch AQI.
         * @returns {Promise<number>} A Promise that resolves with a simulated AQI value (0-300) or rejects with an error.
         */
        async function simulateAqiDataFetch(location) {
            const citiesWithNoData = ['london', 'paris', 'tokyo'];

            return new Promise((resolve, reject) => {
                // Simulate network delay between 1 and 2 seconds
                const delay = Math.floor(Math.random() * 1000) + 1000;
                
                setTimeout(() => {
                    // *** MODIFIED LOGIC ***
                    // Check if the entered location (case-insensitive) is one of the hardcoded error cities.
                    if (citiesWithNoData.includes(location.toLowerCase())) {
                        reject(new Error(`Simulated error: No data is available for ${location}.`));
                        return; // Important to stop execution here
                    }

                    // Original logic: Simulate a 20% chance of a generic server error for other locations
                    if (Math.random() < 0.20) {
                        reject(new Error('Simulated random server error. Please try again.'));
                    } else {
                        // Simulate a successful response with an AQI value between 0 and 300
                        const aqi = Math.floor(Math.random() * 301);
                        resolve(aqi);
                    }
                }, delay);
            });
        }

        // Define a common configuration for AQI categories,
        // which can be used by both setAqiPresentation and getAdviceBasedOnAqi
        const aqiCategoriesConfig = [
            {
                threshold: 50,
                color: '#28a745', // Green
                className: 'aqi-good',
                advice: "Air quality is good. It's a great day for outdoor activities. No precautions are needed."
            },
            {
                threshold: 100,
                color: '#ffc107', // Yellow
                className: 'aqi-moderate',
                advice: "Air quality is acceptable. Unusually sensitive individuals should consider limiting prolonged outdoor exertion."
            },
            {
                threshold: 150,
                color: '#fd7e14', // Orange
                className: 'aqi-unhealthy-sensitive',
                advice: "Unhealthy for sensitive groups (e.g., people with lung disease, older adults, children). These groups should reduce prolonged outdoor exertion."
            },
            {
                threshold: 200,
                color: '#dc3545', // Red
                className: 'aqi-unhealthy',
                advice: "Unhealthy for everyone. Sensitive groups should avoid all outdoor exertion. Everyone else should reduce prolonged or heavy outdoor exertion."
            },
            {
                threshold: 300,
                color: '#6f42c1', // Purple
                className: 'aqi-very-unhealthy',
                advice: "Very unhealthy. Sensitive groups should remain indoors. Everyone else should avoid all outdoor exertion. Wear a mask if you must go outside."
            },
            {
                threshold: Infinity, // For values > 300
                color: '#701a28', // Maroon
                className: 'aqi-hazardous',
                advice: "Hazardous. Everyone should avoid all outdoor physical activity. Remain indoors and keep activity levels low."
            }
        ];

        /**
         * Sets the color and advice text based on the AQI value.
         * @param {number} aqi - The Air Quality Index value.
         */
        function setAqiPresentation(aqi) {
            // Find the appropriate category using the common config
            const category = aqiCategoriesConfig.find(cat => aqi <= cat.threshold);

            if (category) {
                // Set the color of the AQI number
                aqiLabel.style.color = category.color;
                
                // Set the advice text
                adviceOutput.textContent = category.advice;

                // Set the border color on the advice box
                adviceOutput.className = `text-center text-gray-700 p-4 rounded-lg min-h-[100px] border-l-4 ${category.className}`;
            } else {
                // Fallback for unexpected AQI values
                aqiLabel.style.color = '#6b7280'; // Default gray color
                adviceOutput.textContent = "Could not determine health advice for this AQI value.";
                adviceOutput.className = 'text-center text-gray-700 p-4 rounded-lg min-h-[100px] border-l-4';
            }
        }
