// OpenWeatherMap API configuration
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API Key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const errorMsg = document.getElementById('error-msg');
const loadingSpinner = document.getElementById('loading-spinner');
const weatherCard = document.getElementById('weather-card');

const cityName = document.getElementById('city-name');
const weatherDesc = document.getElementById('weather-desc');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

// Fetch weather data using async/await
async function fetchWeatherData(city) {
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  showLoading();
  hideError();

  try {
    const response = await fetch(url);

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found. Please check the spelling.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key provided.');
      } else {
        throw new Error(`Failed to retrieve data (${response.status})`);
      }
    }

    const data = await response.json();
    renderWeatherData(data);
  } catch (error) {
    showError(error.message || 'Network error occurred. Please try again.');
  } finally {
    hideLoading();
  }
}

// Parse dynamic JSON response and update DOM elements
function renderWeatherData(data) {
  // Extracting nested JSON properties safely
  const name = data.name;
  const country = data.sys?.country ? `, ${data.sys.country}` : '';
  const temp = Math.round(data.main.temp);
  const hum = data.main.humidity;
  const wind = data.wind.speed;
  const description = data.weather[0]?.description || 'N/A';
  const iconCode = data.weather[0]?.icon;

  cityName.textContent = `${name}${country}`;
  weatherDesc.textContent = description;
  temperature.textContent = `${temp}°C`;
  humidity.textContent = `${hum}%`;
  windSpeed.textContent = `${wind} m/s`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = description;

  weatherCard.style.display = 'block';
}

// UI State Management Helpers
function showLoading() {
  loadingSpinner.style.display = 'block';
  weatherCard.style.display = 'none';
}

function hideLoading() {
  loadingSpinner.style.display = 'none';
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.display = 'block';
  weatherCard.style.display = 'none';
}

function hideError() {
  errorMsg.style.display = 'none';
}

// Search Event Handler
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
  }
});