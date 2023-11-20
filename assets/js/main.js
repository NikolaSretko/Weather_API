// Funktion, um das Wetter abzurufen
function fetchWeather() {
    // Ersetze "DEIN_API_KEY" durch deinen tatsächlichen API-Schlüssel
    const apiKey = "3eeeb9eff3a20ebbbbace7cdbd9023df";
    const apiUrl = "http://api.openweathermap.org/data/2.5/weather";

    // Beispielstadt (kann später durch Benutzereingabe ersetzt werden)
    const city = "Korb,DE";

    // API-Anfrage erstellen
    const apiRequest = `${apiUrl}?q=${city}&appid=${apiKey}`;

    // API-Anfrage senden
    fetch(apiRequest)
        .then((response) => response.json())
        .then((data) => {
            // Verarbeite die Antwort und zeige die relevanten Informationen an
            const temperatureCelsius = parseFloat(
                (data.main.temp - 273.15).toFixed(2)
            );

            const weatherData = `
            <p>Stadt: ${data.name}</p>
            <p>Temperatur: ${temperatureCelsius} °C</p>
            <p>Wetter: ${data.weather[0].description}</p>
            `;

            // Zeige die Wetterdaten auf der Seite an
            document.getElementById("weatherData").innerHTML = weatherData;
        })
        .catch((error) => {
            console.error("Fehler beim Abrufen der Wetterdaten:", error);
        });
}

// Rufe die Funktion beim Laden der Seite auf
window.onload = fetchWeather;