
const weatherGallery = document.getElementById('weatherGallery');

function fetchProducts() {
    const apiKey = '3eeeb9eff3a20ebbbbace7cdbd9023df';
    const apiUrl = 'http://api.openweathermap.org/data/2.5/weather';
    const apiRequest = `${apiUrl}?q=${city}&appid=${apiKey}`;
    fetch(apiRequest)

        .then(res => {
            if (!res.ok) {
                throw new Error(`Fehler beim Abrufen der ${category || 'Produkte'}`);
            } else {
                return res.json();
            }
        })
        .then(data => {
            data.forEach((data) => {
                const weatherContainer = document.createElement('div');
                weatherContainer.appendChild('weather-container');

                const cityElement = document.createElement('p');
                cityElement.textContent = `Stadt: ${data.name}`;
                weatherContainer.appendChild(cityElement);

                const temperatureElement = document.createElement('p');
                temperatureElement.textContent = `Temperatur: ${data.temp} °C`;
                weatherContainer.appendChild(temperatureElement);

                const descriptionElement = document.createElement('p');
                descriptionElement.textContent = `Wetter: ${data.description}`;
                weatherContainer.appendChild(descriptionElement);

                const sunsetElement = document.createElement('p');
                sunsetElement.textContent = `Sonnenuntergang: ${data.sunset}`;
                weatherContainer.appendChild(sunsetElement);

                document.getElementById('weatherData').appendChild(weatherContainer);
            })
            const temperatureCelsius = parseFloat((data.main.temp - 273.15).toFixed(2));
            const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            addWeatherContainer(data.name, temperatureCelsius, data.weather[0].description, sunsetTime);
        })
        .catch(error => {
            console.error('Fehler beim Abrufen der Wetterdaten:', error);
        });
}