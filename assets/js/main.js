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
            const temperatureCelsius = parseFloat((data.main.temp - 273.15).toFixed(0));
            const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            addWeatherContainer(data.name, temperatureCelsius, data.weather[0].description, sunsetTime);

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
                const forecastTemperature = parseFloat((forecastData[i].main.temp - 273.15).toFixed(0));
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

    // Datum im Format "21.11.2023" aufteilen und umwandeln
    const dateParts = dateString.split('.');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Monate in JavaScript sind 0-basiert
    const year = parseInt(dateParts[2]);

    // Hier wird das Datum manuell erstellt
    const dateObject = new Date(year, month, day);

    // Hier formatierst du das Datum
    const formattedDate = dateObject.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

    const weatherImageMap = {
        'mist': 'url(./assets/img/bewolkt.jpg)',
        'rain': 'url(./assets/img/raegen.jpg)',
        'sun': 'url(./assets/img/klarer%20himmel.jpg)',
        'snow': 'url(./assets/img/schnee.jpg)'
    };

    let backgroundUrl = '';
    for (const keyword in weatherImageMap) {
        if (description.toLowerCase().includes(keyword)) {
            backgroundUrl = weatherImageMap[keyword];
            console.log(keyword);
        }
    }

    document.body.style.background = backgroundUrl;
    console.log(backgroundUrl);
    document.body.style.background = backgroundUrl;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';

    dateCell.textContent = `Day ${formattedDate}`;
    tempCell.textContent = ` ${temp}°C`;
    descCell.textContent = `Wetter: ${description}`;

    forecastContainer.appendChild(table);
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
            const temperatureCelsius = parseFloat((data.main.temp - 273.15).toFixed(0));
            const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            addWeatherContainer(data.name, temperatureCelsius, data.weather[0].description, sunsetTime);

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
