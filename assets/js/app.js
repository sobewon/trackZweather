// OpenWeatherMap API key
const apiKey = '7f371e4052b1c98d236355c1a3d79224'

let recentSearches = JSON.parse(localStorage.getItem('savedCities')) || [];
console.log(recentSearches)

// form sub
$('#searchForm').submit(async function(event) {
    event.preventDefault();
    const city = $('#cityInput').val();

    recentSearches.push(city);
    // recentSearches array to last 5 cities
    recentSearches = recentSearches.slice(-5);
    // recentSearches array to local storage
    localStorage.setItem('savedCities', JSON.stringify(recentSearches));

    // weather data from API
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=40&appid=${apiKey}&units=metric`);
    const weatherData = await response.json();
    //console.log('weatherData\n\n', weatherData)
    
    // weather data
    if (weatherData.cod === '404') {
        // City not found
        $('#weatherContainer').html(`<p class="text-danger">City not found</p>`);
    } else {
        //  weather information
        const weatherList = weatherData.list;
        let weatherHtml = '';
        //console.log('weatherList\n\n', weatherList)

        weatherList.forEach((weather, index) => {
          if (index === 0) {
            const firstDate = new Date(weather.dt * 1000);
            const firstIcon = weather.weather[0].icon;
            const firstTemp = weather.main.temp;
            const firstHum = weather.main.humidity;
            const firstWind = weather.wind.speed;
          
            //console.log(date, icon, temperature, humidity, windSpeed)
            
            weatherHtml += `
                <div class="card mb-3 d-flex justify-content-center align-items-center">
                        <h5 class="card-title"> Today's Forecast: ${city} - ${firstDate.toLocaleDateString()}</h5>
                        <img src="https://openweathermap.org/img/w/${firstIcon}.png" alt="Weather Icon" class="img-fluid" style="max-width: 150px;>
                        <p class="card-text text-xl">Temperature: ${firstTemp} &deg;C</p>
                        <p class="card-text">Humidity: ${firstHum}%</p>
                        <p class="card-text">Wind Speed: ${firstWind} m/s</p>
                </div>
            `;
            }
          })

        weatherList.forEach((weather, index) => {
          if ((index + 1) % 8 === 0) {
            const date = new Date(weather.dt * 1000);
            const icon = weather.weather[0].icon;
            const temperature = weather.main.temp;
            const humidity = weather.main.humidity;
            const windSpeed = weather.wind.speed;
            //console.log(date, icon, temperature, humidity, windSpeed)
            
            weatherHtml += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${city} - ${date.toLocaleDateString()}</h5>
                        <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
                        <p class="card-text">Temperature: ${temperature} &deg;C</p>
                        <p class="card-text">Humidity: ${humidity}%</p>
                        <p class="card-text">Wind Speed: ${windSpeed} m/s</p>
                    </div>
                </div>
            `;
          }
        });

        let recentList = ``
        recentSearches.forEach((cities) => {
          const city = cities
          recentList += `
          <li>
            <button class="btn btn-link recent-search-btn">${city}</button>
          </li>
          `
        })
        $('#cityList').html(recentList);
        $('#weatherContainer').html(weatherHtml);
    }
});



// search weather for a city
function searchWeather(cityName) {
  $('#cityInput').val(cityName);
  $('#searchForm').submit();
}

//  event listener for form submit
$('#searchForm').on('submit', function(event) {
  event.preventDefault();
  var cityInput = $('#cityInput');
})

//event listener for recent
$('#cityList').on('click', '.recent-search-btn', function(event) {
  event.preventDefault();
  const cityName = $(this).text();
  searchWeather(cityName);
});

