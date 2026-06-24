const apiKey = '892044fd709e2d8ab5d30b9346cd126b';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');
const forecastRow = document.getElementById('forecast-row');

async function checkWeather(city) {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    
    try {
        // 1. Current Weather Handshake
        const response = await fetch(currentUrl);
        if (!response.ok) {
            errorMessage.innerText = `Error: ${response.status} (${response.statusText})`;
            errorMessage.style.display = "block";
            weatherInfo.style.display = "none";
            return;
        }
        const data = await response.json();

        // Update main interface
        document.getElementById('city').innerText = data.name;
        document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
        document.getElementById('description').innerText = data.weather[0].description;
        document.getElementById('humidity').innerText = `${data.main.humidity}%`;

        // 2. Future 5-Day Forecast Handshake
        const forecastResponse = await fetch(forecastUrl);
        if (forecastResponse.ok) {
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData.list);
        }

        weatherInfo.style.display = "block";
        errorMessage.style.display = "none";

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayForecast(forecastList) {
    forecastRow.innerHTML = ''; // Previous clean up

    // Filter to extract midday timestamps (12:00 PM) for consistency
    const dailyData = forecastList.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        let iconClass = "fa-sun";
        let colorClass = "icon-clear"; 
        
        const cond = day.weather[0].main.toLowerCase();
        
        if (cond.includes("cloud")) {
            iconClass = "fa-cloud";
            colorClass = "icon-cloudy"; 
        } 
        else if (cond.includes("rain") || cond.includes("drizzle")) {
            iconClass = "fa-cloud-showers-heavy";
            colorClass = "icon-rainy"; 
        } 
        else if (cond.includes("thunder")) {
            iconClass = "fa-cloud-bolt";
            colorClass = "icon-thunder"; 
        }

        const forecastHTML = `
            <div class="forecast-item">
                <p class="forecast-day">${dayName}</p>
                <i class="fa-solid ${iconClass} ${colorClass}"></i>
                <p class="forecast-temp">${Math.round(day.main.temp)}°C</p>
            </div>
        `;
        forecastRow.innerHTML += forecastHTML;
    });
}

// Global Triggers
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== "") checkWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && cityInput.value.trim() !== "") checkWeather(cityInput.value);
});