// ============================================
//   WEATHER APP — script.js
// ============================================

const cityInput       = document.getElementById('city-input');
const suggestionsList = document.getElementById('suggestions-list');
const apiKey          = '8618de74569f4a8c828172540260805';

// ---------- DOM References ----------
const cityName        = document.getElementById('city-name');
const temperature     = document.getElementById('temperature');
const condition       = document.getElementById('condition');
const feelsLike       = document.getElementById('feels-like');
const humidityValue   = document.getElementById('humidity-value');
const windSpeedValue  = document.getElementById('wind-speed-value');
const pressureValue   = document.getElementById('pressure-value');
const visibilityValue = document.getElementById('visibility-value');
const weatherIcon     = document.getElementById('weather-icon');

// ---------- STEP 1: Suggestions ----------
cityInput.addEventListener('input', async () => {
    const query = cityInput.value.trim();
    if (query.length < 2) {
        suggestionsList.style.display = 'none';
        return;
    }
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`
        );
        const data = await response.json();
        suggestionsList.innerHTML = '';
        if (data.length > 0) {
            suggestionsList.style.display = 'block';
            data.forEach(city => {
                const li = document.createElement('li');
                li.className = 'suggestion-item';
                li.textContent = `${city.name}, ${city.country}`;
                li.onclick = () => {
                    cityInput.value = city.name;
                    suggestionsList.style.display = 'none';
                    getWeather();
                };
                suggestionsList.appendChild(li);
            });
        } else {
            suggestionsList.style.display = 'none';
        }
    } catch (error) {
        console.error("Suggestion Fetch Error:", error);
    }
});

// ---------- STEP 2: Fetch Weather ----------
async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return alert("Please enter a city name!");
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
        );
        const data = await response.json();
        if (data.error) {
            alert("City not found! Please try again.");
            return;
        }
        updateWeatherUI(data);
    } catch (error) {
        console.error("Weather Fetch Error:", error);
    }
}

// ---------- STEP 3: Update UI ----------
function updateWeatherUI(data) {
    cityName.textContent = `${data.location.name}, ${data.location.country}`;

    // Temperature with gradient fix
    temperature.textContent = `${data.current.temp_c}°C`;
    temperature.style.background = 'linear-gradient(135deg, #ffffff, #a8d8ff)';
    temperature.style.webkitBackgroundClip = 'text';
    temperature.style.webkitTextFillColor = 'transparent';
    temperature.style.backgroundClip = 'text';

    condition.textContent       = data.current.condition.text;
    feelsLike.textContent       = `Feels like ${data.current.feelslike_c}°C`;
    humidityValue.textContent   = `${data.current.humidity}%`;
    windSpeedValue.textContent  = `${data.current.wind_kph} km/h`;
    pressureValue.textContent   = `${data.current.pressure_mb} hPa`;
    visibilityValue.textContent = `${data.current.vis_km} km`;

    weatherIcon.src = `https:${data.current.condition.icon}`;
    weatherIcon.style.display = 'block';

    // Dynamic background
    const conditionText = data.current.condition.text.toLowerCase();
    const isDay = data.current.is_day;
    changeBackground(conditionText, isDay);
}

// ---------- STEP 4: Dynamic Background ----------
function changeBackground(conditionText, isDay) {
    let bgImage = '';

    // 🌙 Night — always check first
    if (isDay === 0) {
        bgImage = 'night.jpg';
    }
    // ❄️ Snow
    else if (conditionText.includes('snow') || conditionText.includes('sleet') ||
             conditionText.includes('blizzard') || conditionText.includes('ice')) {
        bgImage = 'snow.jpg';
    }
    // ⛈️ Thunder
    else if (conditionText.includes('thunder') || conditionText.includes('storm')) {
        bgImage = 'thunder.jpg';
    }
    // 🌧️ Rain
    else if (conditionText.includes('rain') || conditionText.includes('drizzle') ||
             conditionText.includes('shower') || conditionText.includes('mist') ||
             conditionText.includes('fog') || conditionText.includes('freezing')) {
        bgImage = 'rainy.jpg';
    }
    // ⛅ Cloudy
    else if (conditionText.includes('cloud') || conditionText.includes('overcast') ||
             conditionText.includes('partly')) {
        bgImage = 'cloudy.jpg';
    }
    // ☀️ Sunny
    else if (conditionText.includes('sunny') || conditionText.includes('clear')) {
        bgImage = 'sunny.avif';
    }
    // 🌤️ Default
    else {
        bgImage = 'bl.png';
    }

    // Smooth background transition
    document.body.style.transition = 'background-image 1s ease';
    document.body.style.backgroundImage = `url('${bgImage}')`;
}