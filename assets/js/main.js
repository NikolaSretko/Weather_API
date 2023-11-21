const weatherGallery = document.getElementById('weatherGallery');

const apiKey = '3eeeb9eff3a20ebbbbace7cdbd9023df';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

function fetchWeather(city) {
    const apiRequest = `${apiUrl}?q=${city}&appid=${apiKey}`;

    fetch(apiRequest)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Fehler beim Abrufen der Wetterdaten für ${city}`);
            } else {
                return res.json();
            }
        })
        .then(data => {
            const temperatureCelsius = parseFloat((data.main.temp - 273.15).toFixed(2));
            const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            addWeatherContainer(data.name, temperatureCelsius, data.weather[0].description, sunsetTime);

            // Hier die Wettervorhersage für die eingegebene Stadt abrufen
            fetchForecast(city);
        })
        .catch(error => {
            console.error(`Fehler beim Abrufen der Wetterdaten für ${city}:`, error);
        });
}

function fetchForecast(city) {
    const forecastRequest = `${forecastUrl}?q=${city}&appid=${apiKey}`;

    fetch(forecastRequest)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Fehler beim Abrufen der Wettervorhersage für ${city}`);
            } else {
                return res.json();
            }
        })
        .then(data => {
            const forecastData = data.list;

            for (let i = 0; i < forecastData.length; i += 8) {
                const forecastDate = new Date(forecastData[i].dt * 1000).toLocaleDateString();
                const forecastTemperature = parseFloat((forecastData[i].main.temp - 273.15).toFixed(2));
                const forecastDescription = forecastData[i].weather[0].description;

                addForecastContainer(forecastDate, forecastTemperature, forecastDescription);
            }
        })
        .catch(error => {
            console.error(`Fehler beim Abrufen der Wettervorhersage für ${city}:`, error);
        });
}


function addWeatherContainer(name, temp, description, sunset) {
    weatherGallery.innerHTML = " ";

    const weatherContainer = document.createElement('div');
    weatherContainer.classList.add('weather-container');

    const cityElement = document.createElement('p');
    cityElement.textContent = `${name}`;
    weatherContainer.appendChild(cityElement);

    const temperatureElement = document.createElement('p');
    temperatureElement.textContent = `${temp} °C`;
    weatherContainer.appendChild(temperatureElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = `Wetter: ${description}`;
    weatherContainer.appendChild(descriptionElement);

    const sunsetElement = document.createElement('p');
    sunsetElement.textContent = `Sonnenuntergang: ${sunset} Uhr`;
    weatherContainer.appendChild(sunsetElement);

    weatherGallery.appendChild(weatherContainer);
}

function addForecastContainer(date, temp, description) {
    const forecastContainer = document.createElement('div');
    forecastContainer.classList.add('forecast-container');

    const dateElement = document.createElement('p');
    dateElement.textContent = `Datum: ${date}`;
    forecastContainer.appendChild(dateElement);

    const temperatureElement = document.createElement('p');
    temperatureElement.textContent = `Temperatur: ${temp} °C`;
    forecastContainer.appendChild(temperatureElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = `Wetter: ${description}`;
    forecastContainer.appendChild(descriptionElement);

    weatherGallery.appendChild(forecastContainer);
}

function getLocationOnLoad() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather, handleLocationError);
    } else {
        alert('Geolocation wird nicht unterstützt.');
    }
}

function showWeather(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const apiRequest = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(apiRequest)
        .then(response => response.json())
        .then(data => {
            const temperatureCelsius = parseFloat((data.main.temp - 273.15).toFixed(2));
            const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            addWeatherContainer(data.name, temperatureCelsius, data.weather[0].description, sunsetTime);

            // Hier die Wettervorhersage für den aktuellen Standort abrufen
            fetchForecast(data.name);
        })
        .catch(error => {
            console.error('Fehler beim Abrufen der Wetterdaten:', error);
        });
}

function handleLocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('Zugriff auf Standort verweigert.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Standortinformation nicht verfügbar.');
            break;
        case error.TIMEOUT:
            alert('Zeitüberschreitung bei der Standortabfrage.');
            break;
        case error.UNKNOWN_ERROR:
        default:
            alert('Unbekannter Fehler bei der Standortabfrage.');
            break;
    }
}
