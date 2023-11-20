function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather, handleLocationError);
    } else {
        alert('Geolocation wird nicht unterstützt.');
    }
}

function showWeather(position) {
    // Ersetze "DEIN_API_KEY" durch deinen tatsächlichen API-Schlüssel
    const apiKey = '3eeeb9eff3a20ebbbbace7cdbd9023df';
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

    // Koordinaten abrufen
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // API-Anfrage erstellen
    const apiRequest = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    // API-Anfrage senden
    fetch(apiRequest)
        .then(response => response.json())
        .then(data => {
            // Verarbeite die Antwort und zeige die relevanten Informationen an
            const temperatureCelsius = parseFloat((data.main.temp - 273.15).toFixed(2));

            const weatherData = `
                <p>Stadt: ${data.name}</p>
                <p>Temperatur: ${temperatureCelsius} °C</p>
                <p>Wetter: ${data.weather[0].description}</p>
            `;

            // Zeige die Wetterdaten auf der Seite an
            document.getElementById('weatherData').innerHTML = weatherData;
        })
        .catch(error => {
            console.error('Fehler beim Abrufen der Wetterdaten:', error);
        });
}

// Funktion, die aufgerufen wird, wenn die Positionsabfrage fehlschlägt
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