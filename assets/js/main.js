const apiKey = '3eeeb9eff3a20ebbbbace7cdbd9023df';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

const weatherGallery = document.getElementById('weatherGallery');

function fetchWeather(city) {
    const apiRequest = `${apiUrl}?q=${city}&appid=${apiKey}`;

    fetch(apiRequest)
        .then(res => res.ok ? res.json() : Promise.reject(`Fehler beim Abrufen der Wetterdaten für ${city}`))
        .then(data => {
            const { name, main, sys, weather } = data;
            const temperatureCelsius = parseFloat((main.temp - 273.15).toFixed(0));
            const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString();
            const description = weather[0].description;

            addWeatherContainer(name, temperatureCelsius, description, sunsetTime);
            applyBackgroundStyling(description);
            fetchForecast(name);
        })
        .catch(error => console.error(error));
}

function fetchForecast(city) {
    const forecastRequest = `${forecastUrl}?q=${city}&appid=${apiKey}`;

    fetch(forecastRequest)
        .then(res => res.ok ? res.json() : Promise.reject(`Fehler beim Abrufen der Wettervorhersage für ${city}`))
        .then(data => {
            const forecastData = data.list;

            for (let i = 0; i < forecastData.length; i += 8) {
                const { dt, main, weather } = forecastData[i];
                const forecastDate = new Date(dt * 1000).toLocaleDateString();
                const forecastTemperature = parseFloat((main.temp - 273.15).toFixed(0));
                const forecastDescription = weather[0].description;

                addForecastContainer(forecastDate, forecastTemperature, forecastDescription);
            }
        })
        .catch(error => console.error(error));
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
    sunsetElement.textContent = `Sunset: ${sunset} Uhr`;
    weatherContainer.appendChild(sunsetElement);

    weatherGallery.appendChild(weatherContainer);
}

function addForecastContainer(dateString, temp, description) {
    const forecastContainer = document.createElement('div');
    forecastContainer.classList.add('forecast-container');

    const table = document.createElement('table');


    const row = table.insertRow();
    const dateCell = row.insertCell(0);
    const tempCell = row.insertCell(1);
    const descCell = row.insertCell(2);


    const dateParts = dateString.split('.');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const year = parseInt(dateParts[2]);

    const dateObject = new Date(year, month, day);


    const formattedDate = dateObject.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

    dateCell.textContent = `Day ${formattedDate}`;
    tempCell.textContent = ` ${temp}°C`;
    descCell.textContent = `${description}`;

    forecastContainer.appendChild(table);
    weatherGallery.appendChild(forecastContainer);
}

function getLocationOnLoad() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const apiRequest = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

                fetch(apiRequest)
                    .then(response => response.json())
                    .then(data => {
                        const temperatureCelsius = parseFloat((data.main.temp - 273.15).toFixed(0));
                        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
                        const description = data.weather[0].description;

                        addWeatherContainer(data.name, temperatureCelsius, description, sunsetTime);
                        applyBackgroundStyling(description);
                        fetchForecast(data.name);
                    })
                    .catch(error => console.error('Fehler beim Abrufen der Wetterdaten:', error));
            },
            handleLocationError
        );
    } else {
        alert('Geolocation wird nicht unterstützt.');
    }
}

// Rufe getLocationOnLoad direkt nach dem Laden der Seite auf
document.addEventListener('DOMContentLoaded', getLocationOnLoad);


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
const weatherVideoMap = {
    'overcast clouds': './assets/video/overcastClouds.mp4',
    'rain': './assets/video/rain.mp4',
    'clear sky': './assets/video/clearSky.mp4',
    'few clouds': './assets/video/fewClouds.mp4'
};

function applyBackgroundStyling(description) {
    const videoUrl = weatherVideoMap[description.toLowerCase()];

    if (videoUrl) {
        // Erstelle ein Videoelement
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.muted = true;

        // Füge das Videoelement zum Body hinzu
        document.body.appendChild(videoElement);

        // Verstecke andere Hintergrundbilder
        document.body.style.background = 'none';
    } else {
        // Fallback-Styling mit einem Bild, wenn die Beschreibung nicht übereinstimmt
        document.body.style.background = 'url(./assets/img/default-background.jpg)';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'cover';
    }
}



