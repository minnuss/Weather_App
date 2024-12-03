const searchInput = document.querySelector('.weather__search')
const cityEl = document.querySelector('.weather__city')
const dayEl = document.querySelector('.weather__day')
const humidityEl = document.querySelector('.weather__indicator--humidity .value')
const windEl = document.querySelector('.weather__indicator--wind .value')
const pressureEl = document.querySelector('.weather__indicator--pressure .value')
const temperatureEl = document.querySelector('.weather__temperature .value')
const feelsLikeEl = document.querySelector('.feels-like')
const weatherImgEl = document.querySelector('.weather__image')
const weatherForecastContainer = document.querySelector('.weather__forecast')
const locateBtn = document.querySelector('.locateBtn')

let defaultCity = 'Belgrade'
let geoLocationCity

// ARRAY OF OBJECTS FOR WEATHER ICONS
// Icons are created by amCharts (https://www.amcharts.com/
// License : https://creativecommons.org/licenses/by/4.0/ 
let iconWeatherIds = [
    {
        id: [212, 221, 230, 231, 232, 'thunder-rain'],
        url: 'img/Thunderstorm.svg'
    },
    {
        id: [210, 211],
        url: 'img/Thunderstorm Light.svg'
    },
    {
        id: [200, 201, 202, 'thunder-showers-day'],
        url: 'img/Thunderstorm Rain.svg'
    },
    {
        id: [300, 301, 310, 311],
        url: 'img/Drizzle.svg'
    },
    {
        id: [302, 312, 313, 314, 321],
        url: 'img/Drizzle Heavy.svg'
    },
    {
        id: [500, 520, 'rain'],
        url: 'img/Rain Light.svg'
    },
    {
        id: [501, 'showers-day'],
        url: 'img/Rain Moderate.svg'
    },
    {
        id: [502, 503, 504],
        url: 'img/Rain Heavy.svg'
    },
    {
        id: [511, 522, 531],
        url: 'img/Rain Heavy Cloudy.svg'
    },
    {
        id: [521],
        url: 'img/Rain Moderate Cloudy.svg'
    },
    {
        id: [600, 601, 612, 'snow'],
        url: 'img/Snow Light.svg'
    },
    {
        id: [611, 613],
        url: 'img/Snow Sleet.svg'
    },
    {
        id: [602],
        url: 'img/Snow Heavy.svg'
    },
    {
        id: [615, 616],
        url: 'img/Snow Rain.svg'
    },
    {
        id: [620],
        url: 'img/Snow Shower Light.svg'
    },
    {
        id: [621],
        url: 'img/Snow Shower.svg'
    },
    {
        id: [622],
        url: 'img/Snow Shower Heavy.svg'
    },
    {
        id: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781, 'fog'],
        url: 'img/Fog.svg'
    },
    {
        id: [800, 'clear-day'],
        url: 'img/Clear Sky.svg'
    },
    {
        id: [801, 'partly-cloudy-day'],
        url: 'img/Clouds Few.svg'
    },
    {
        id: [802, 'cloudy'],
        url: 'img/Clouds Scattered.svg'
    },
    {
        id: [803],
        url: 'img/Clouds Broken.svg'
    },
    {
        id: [804],
        url: 'img/Clouds Overcast.svg'
    }
]

// WEATHER API KEY - (DO NOT USE THIS API KEY) - register for yours !!!
let weatherAPIKey = '08edf2d59374b29aa48f1356d6bb0cc4'
let weatherAPIKey2 = 'ZXXDYL6Y7M3FVGG9N9GA5FYAM'

// URL FOR DAILY WEATHER - CURRENT
let weatherBaseURL = `https://api.openweathermap.org/data/2.5/weather?appid=` + weatherAPIKey
// let weatherBaseURL = `https://api.openweathermap.org/data/2.5/weather?appid=` + weatherAPIKey2


// AUTO GEOLOCATION BY CLICKING ON A BUTTON
locateBtn.addEventListener('click', () => {

    if ('geolocation' in navigator) {
        console.log('Device support geolocation')
    } else {
        alert('Your device does not support geolocation')
        return
    }

    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(position) {
        let coordinates = position.coords;

        console.log('Your current position is:', `Latitude : ${coordinates.latitude}`, `Longitude: ${coordinates.longitude}`);
        // console.log(`Latitude : ${coordinates.latitude}`);
        // console.log(`Longitude: ${coordinates.longitude}`);

        // GEOLOCATION API - (DO NOT USE THIS API KEY) - register for yours !!!
        let geoLocationWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${weatherAPIKey}`
        // let geoLocationWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${weatherAPIKey}`
        // let geoLocationWeatherURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${weatherAPIKey2}`


        // console.log('geoLocationURL', geoLocationURL)

        async function getGeoLocationCity() {
            const res = await fetch(geoLocationWeatherURL);
            const data = await res.json();

            // console.log(data)
            // console.log('Recognized city', data.name)
            // console.log('Recognized city', data[0].name)

            if (data) {
                geoLocationCity = data.name
            }

            console.log('GeoLocation City recognized: ', geoLocationCity);
            // alert(geoLocationCity)
        }
        // getGeoLocationCity()

        // console.log(defaultCity);
        setTimeout(() => {
            getGeoLocationCity()

            setTimeout(() => {
                getWeatherByCityName(geoLocationCity)
            }, 2000)
        }, 300)
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
})


// GET THE DAILY WEATHER DATA
async function getWeatherByCityName(defaultCity) {
    let endpoint = weatherBaseURL + '&q=' + defaultCity + '&units=metric'
// console.log(endpoint)
    let response = await fetch(endpoint)

    let data = await response.json()
    // console.log(data)

    getWeatherToDOM(data)
}
// Default Belgrade
getWeatherByCityName(defaultCity)

// PUT DATA TO THE DOM, DAILY CURRENT WEATHER
function getWeatherToDOM(data) {
    // console.log(data)

    let { name, main, weather, wind, sys } = data
    let { humidity, pressure, temp, feels_like } = main
    // console.log(name, humidity, pressure, temp, feels_like)

    // Get the day name in character
    let date = new Date()
    let options = { weekday: 'long' }
    let dayName = date.toLocaleString('sr-Latn-RS', options)

    // Get the wind direction in character
    let windDirection = wind.deg
    windDirection = windDirection < 45 ? "Sever" : windDirection < 135 ? "Istok" : windDirection < 225 ? 'Jug' : windDirection < 315 ? 'Zapad' : 'Sever'


    cityEl.innerHTML = `${name}, ${sys.country}`
    dayEl.innerHTML = dayName
    humidityEl.innerHTML = humidity + '%'
    windEl.innerHTML = `${windDirection}, ${wind.speed}`
    pressureEl.innerHTML = pressure
    temperatureEl.innerHTML = temp > 0 ? '+' + temp.toFixed(1) : temp.toFixed(1)
    // Feels like element
    let feelsLike = data.main.feels_like.toFixed(1)
    feelsLikeEl.innerHTML = `Feels Like: ${feelsLike}°C`

    // Getting weather icon id from api, and checking in iconWeatherIds array for img url
    let imageId = data.weather[0].id
    iconWeatherIds.forEach(object => {
        if (object.id.includes(imageId)) {
            weatherImgEl.src = object.url
        }
    })

    // VARIABLES FOR FUTURE FORECAST, Latitude and Longitude
    let lat = data.coord.lat
    let lon = data.coord.lon
    // console.log(lat, lon)

    futureForecast(lat, lon)
    // console.log(lat, lon)
}

// GETTING FUTURE FORECAST AND CREATING ALL DAY CARDS ELEMENTS
async function futureForecast(lat, lon) {
    let weatherAPIKey2 = 'ZXXDYL6Y7M3FVGG9N9GA5FYAM'
    // console.log(lat, lon)
    weatherForecastContainer.innerHTML = ''
    // API url for 8 days forecast, needs LAT and LON to work
    // let futureForecastURL = `https://https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${weatherAPIKey}&units=metric`
    let futureForecastURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${weatherAPIKey2}`

    const res = await fetch(futureForecastURL)
    const data = await res.json()
    // console.log(data)
    
    // Creating 8 new future forecasts days
    for (let i = 0; i < 8; i++) {

        // let { temp, weather } = data.daily[i]
        let { temp, tempmax, tempmin } = data.days[i]
        // let { tempmax, tempmin } = days[i]

        // Weather description, a title for every card day
        let weatherDescription = data.days[i].description
        weatherDescription = weatherDescription[0].toUpperCase() + weatherDescription.slice(1)
        
        // Getting weather icon id from api, and checking in iconWeatherIds array for img url
        let imgSrc
        let imageId = data.days[i].icon
        
        iconWeatherIds.forEach(object => {
            if (object.id.includes(imageId)) {
                imgSrc = object.url
                // console.log(imgSrc)
            }
        })

        // Getting the day names for every future day
        const today = new Date()
        const tomorrow = new Date()
        tomorrow.setDate(today.getDate() + (i + 1))
        let options = { weekday: 'long', setScript: 'Latn' }
        // let dayName = tomorrow.toLocaleString('sr-RS', options)
        let dayName = tomorrow.toLocaleDateString('sr-Latn-RS', options)
        dayName = dayName[0].toUpperCase() + dayName.slice(1)
        // console.log(dayName)

        // Creating Article element, like in HTML
        const articleEl = document.createElement('article')
        articleEl.className = 'weather__forecast__item'

        articleEl.innerHTML = `
            <p class="weather-description">${weatherDescription}</p>
            <img src="${imgSrc}" alt="${imgSrc}" class="weather__forecast__icon">
            <h3 class="weather__forecast__day">${dayName}</h3>
            <p class="weather__forecast__temperature"><span class="value">${temp > 0 ? '+' + temp.toFixed(1) : temp.toFixed(1)}</span> &deg;C</p>
            <div class="minMax">
            <span class="minTemp">Min: ${Math.round(tempmin)}</span>
            <span class="maxTemp">Max: ${Math.round(tempmax)}</span>
            </div>
            `
        weatherForecastContainer.appendChild(articleEl)
    }
}

// SEARCH INPUT EVENT - CONFIRM BY ENTER KEY
searchInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        getWeatherByCityName(searchInput.value)
        searchInput.value = ''

        // Loose focus on input after enter
        setTimeout(() => {
            searchInput.blur()
        }, 100);
    }
})

// API NINJAS' CITY API - CITY SUGGESTIONS
const citySuggestionURL = 'https://api.api-ninjas.com/v1/city'
const dataListEl = document.getElementById('suggestion-cities')
const apiKey = 'n6CWCUNp+YpqEWCLoRdhQg==64VVMsLsocRwAELv' // Replace with your API Ninjas key

searchInput.addEventListener('input', async () => {
    const query = searchInput.value
    if (query.trim().length === 0) return; // Prevent unnecessary requests on empty input

    try {
        const res = await fetch(`${citySuggestionURL}?name=${query}&limit=5`, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const cities = await res.json();

        // Clear the option elements every time user types a new character
        dataListEl.innerHTML = '';

        // Populate suggestions
        cities.forEach((city) => {
            const cityNameCountryName = `${city.name}, ${city.country}`;
            const optionEl = document.createElement('option');
            optionEl.setAttribute('value', cityNameCountryName);
            dataListEl.appendChild(optionEl);
        });

    } catch (error) {
        console.error('Error fetching city suggestions:', error);
    }
});

