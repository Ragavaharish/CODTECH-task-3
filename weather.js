document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    if (city) {
        getWeather(city);
    }
});

async function getWeather(city) {
    const apiKey = '9505fd1df737e20152fbd78cdb289b6a'; 
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();

        if (currentWeatherData.cod === 200 && forecastData.cod === '200') {
            // Update current weather
            document.getElementById('cityName').textContent = currentWeatherData.name;
            document.getElementById('temperature').textContent = `${currentWeatherData.main.temp} °C`;
            document.getElementById('description').textContent = currentWeatherData.weather[0].description;
            document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}.png`;

            // Update forecast
            const forecastContainer = document.getElementById('forecastContainer');
            forecastContainer.innerHTML = ''; 

            const dailyForecasts = forecastData.list.filter((reading) => reading.dt_txt.includes("12:00:00"));
            
            dailyForecasts.forEach(day => {
                const forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');

                const date = new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
                const icon = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
                const temp = `${day.main.temp} °C`;

                forecastItem.innerHTML = `
                    <h3>${date}</h3>
                    <img src="${icon}" alt="Weather Icon">
                    <p>${temp}</p>
                `;
                
                forecastContainer.appendChild(forecastItem);
            });

            document.querySelector('.current-weather').style.display = 'block';
            document.querySelector('.forecast').style.display = 'block';
        } else {
            alert('City not found!');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}
