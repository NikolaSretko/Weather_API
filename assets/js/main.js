const weatherGallery = document.getElementById('weatherGallery');

function fetchProducts(city) {
    const apiKey = '3eeeb9eff3a20ebbbbace7cdbd9023df';
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
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
        })
        .catch(error => {
            console.error(`Fehler beim Abrufen der Wetterdaten für ${city}:`, error);
        });
}

function addWeatherContainer(name, temp, description, sunset) {
    const weatherContainer = document.createElement('div');
    weatherContainer.classList.add('weather-container');

    const cityElement = document.createElement('p');
    cityElement.textContent = `Stadt: ${name}`;
    weatherContainer.appendChild(cityElement);

    const temperatureElement = document.createElement('p');
    temperatureElement.textContent = `Temperatur: ${temp} °C`;
    weatherContainer.appendChild(temperatureElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = `Wetter: ${description}`;
    weatherContainer.appendChild(descriptionElement);

    const sunsetElement = document.createElement('p');
    sunsetElement.textContent = `Sonnenuntergang: ${sunset}`;
    weatherContainer.appendChild(sunsetElement);

    weatherGallery.appendChild(weatherContainer);

    // Optional: Lösche den Inhalt des Eingabefelds nach dem Hinzufügen
    document.getElementById('city').value = '';
}

function getLocationOnLoad() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather, handleLocationError);
    } else {
        alert('Geolocation wird nicht unterstützt.');
    }
}

function showWeather(position) {
    const apiKey = '3eeeb9eff3a20ebbbbace7cdbd9023df';
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const apiRequest = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(apiRequest)
        .then(response => response.json())
        .then(data => {
            const temperatureCelsius = parseFloat((data.main.temp - 273.15).toFixed(2));
            const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            addWeatherContainer(data.name, temperatureCelsius, data.weather[0].description, sunsetTime);
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
