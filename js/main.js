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
        id: [212, 221, 230, 231, 232],
        url: 'img/Thunderstorm.svg'
    },
    {
        id: [210, 211],
        url: 'img/Thunderstorm Light.svg'
    },
    {
        id: [200, 201, 202],
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
        id: [500, 520],
        url: 'img/Rain Light.svg'
    },
    {
        id: [501],
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
        id: [600, 601, 612],
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
        id: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
        url: 'img/Fog.svg'
    },
    {
        id: [800],
        url: 'img/Clear Sky.svg'
    },
    {
        id: [801],
        url: 'img/Clouds Few.svg'
    },
    {
        id: [802],
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
let weatherAPIKey = 'e9aec69d0b91591d02c0e671ad034e19'
// URL FOR DAILY WEATHER - CURRENT
let weatherBaseURL = `https://api.openweathermap.org/data/2.5/weather?appid=` + weatherAPIKey


// AUTO GEOLOCATION BY CLICKING ON A BUTTON
locateBtn.addEventListener('click', () => {

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;

        console.log('Your current position is:', `Latitude : ${crd.latitude}`, `Longitude: ${crd.longitude}`);
        // console.log(`Latitude : ${crd.latitude}`);
        // console.log(`Longitude: ${crd.longitude}`);

        // GEOLOCATION API - (DO NOT USE THIS API KEY) - register for yours !!!
        let geoLocationURL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${crd.latitude}&lon=${crd.longitude}&limit=1&appid=e9aec69d0b91591d02c0e671ad034e19`

        // console.log('geoLocationURL', geoLocationURL)

        async function getGeoLocationCity() {
            const res = await fetch(geoLocationURL);
            const data = await res.json();

            // console.log(data)
            console.log('Recognized city', data[0].name)

            if (data) {
                geoLocationCity = data[0].name
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
    let { humidity, pressure, temp } = main
    // console.log(name, humidity, pressure, temp)

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
    // console.log(lat, lon)
    weatherForecastContainer.innerHTML = ''
    // API url for 8 days forecast, needs LAT and LON to work
    let futureForecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${weatherAPIKey}&units=metric`

    const res = await fetch(futureForecastURL)
    const data = await res.json()
    // console.log(data)

    // Feels like element
    let feelsLike = data.current.feels_like.toFixed(1)
    feelsLikeEl.innerHTML = `Feels Like: ${feelsLike}°C`

    // Creating 8 new future forecasts days
    for (let i = 0; i < 8; i++) {

        let { temp, weather } = data.daily[i]
        let { day, max, min } = temp

        // Weather description, a title for every card day
        let weatherDescription = weather[0].description
        weatherDescription = weatherDescription[0].toUpperCase() + weatherDescription.slice(1)

        // Getting weather icon id from api, and checking in iconWeatherIds array for img url
        let imgSrc
        let imageId = weather[0].id

        iconWeatherIds.forEach(object => {
            if (object.id.includes(imageId)) {
                imgSrc = object.url
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
            <p class="weather__forecast__temperature"><span class="value">${day > 0 ? '+' + day.toFixed(1) : day.toFixed(1)}</span> &deg;C</p>
            <span class="minTemp">Min: ${Math.round(min)}</span>
            <span class="maxTemp">Max: ${Math.round(max)}</span>
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

// WORLD CITY SUGGESTIONS API - BY TYPING INTO INPUT
let citySuggestionURL = 'https://api.teleport.org/api/cities/?search='
const dataListEl = document.getElementById('suggestion-cities')

searchInput.addEventListener('input', async () => {
    let userSearchType = citySuggestionURL + searchInput.value
    let res = await fetch(userSearchType)
    let data = await res.json()
    // console.log(data._embedded['city:search-results'][0])
    console.log(data)

    // Clear the option elements every time user types new character
    dataListEl.innerHTML = ''

    // Get max 5 city results, or less then 5
    let citiesResult = data._embedded['city:search-results']
    let length = citiesResult.length > 5 ? 5 : citiesResult.length

    for (let i = 0; i < length; i++) {
        // console.log(data._embedded['city:search-results'][i]['matching_full_name'])

        const cityName = data._embedded['city:search-results'][i]['matching_full_name']
        // console.log(cityName)

        // Split the result in to City Name and Country, removing middle Region option, so that Weather API understand the search input
        let split = cityName.split(',')
        // console.log(split[0], split[2])
        let cityNameCountryName = `${split[0]},${split[2]}`

        let optionEl = document.createElement('option')
        // Pass the attribute value to option element
        optionEl.setAttribute('value', cityNameCountryName)
        dataListEl.appendChild(optionEl)
    }
})
