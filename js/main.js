// https://openweathermap.org/current

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


// API KEY - Registrated to Ponjevic Goran
let weatherAPIKey = 'e9aec69d0b91591d02c0e671ad034e19'
// URL FOR DAILY WEATHER - CURRENT
let weatherBaseURL = `https://api.openweathermap.org/data/2.5/weather?appid=` + weatherAPIKey

// GET THE DAILY WEATHER DATA
async function getWeatherByCityName(city = 'Belgrade') {
    let endpoint = weatherBaseURL + '&q=' + city + '&units=metric'

    let response = await fetch(endpoint)
    let data = await response.json()
    // console.log(data)

    getWeatherToDOM(data)
}
// Default Belgrade
getWeatherByCityName('Belgrade')

// PUT DATA TO THE DOM, DAILY CURRENT WEATHER
function getWeatherToDOM(data) {
    // console.log(data)

    let { name, main, weather, wind, sys } = data
    let { humidity, pressure, temp } = main
    // console.log(name, humidity, pressure, temp)

    // Get the day name in character
    let date = new Date()
    let options = { weekday: 'long' }
    let dayName = date.toLocaleString('sr-RS', options)

    // Get the wind direction in character
    let windDirection = wind.deg
    windDirection = windDirection < 45 ? "Sever" : windDirection < 135 ? "Istok" : windDirection < 225 ? 'Jug' : windDirection < 315 ? 'Zapad' : 'Sever'

    cityEl.innerHTML = `${name}, ${sys.country}`
    dayEl.innerHTML = dayName
    humidityEl.innerHTML = humidity + '%'
    windEl.innerHTML = `${windDirection}, ${wind.speed}`
    pressureEl.innerHTML = pressure
    temperatureEl.innerHTML = temp > 0 ? '+' + temp.toFixed(1) : temp.toFixed(1)

    // Failsafe code for weather icons, if image is not recognised, pull icon from API
    let imgDescription = weather[0].description
    let imageIcon = `http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`
    let imagePath = `img/${imgDescription}.png`

    // FUNCTION TO CHECK IF IMAGE EXIST !!!
    let myImg = new Image;
    myImg.src = imagePath
    myImg.onerror = function () {
        weatherImgEl.src = imageIcon
    }
    myImg.onload = function () {
        weatherImgEl.src = imagePath
    }

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

        // Failsafe code for weather icons, if image is not recognised, pull icon from API
        let imgDescription = weather[0].main
        let imageIcon = `http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`
        let imagePath = `img/${imgDescription}.png`
        let imgSrc

        // Getting the day names for every future day
        const today = new Date()
        const tomorrow = new Date()
        tomorrow.setDate(today.getDate() + (i + 1))
        let options = { weekday: 'long' }
        let dayName = tomorrow.toLocaleString('sr-RS', options)
        dayName = dayName[0].toUpperCase() + dayName.slice(1)
        // console.log(dayName)

        // Creating Article element, like in HTML
        const articleEl = document.createElement('article')
        articleEl.className = 'weather__forecast__item'

        articleEl.innerHTML = `
            <img src="${imagePath}" alt="${imagePath}" class="weather__forecast__icon">
            <h3 class="weather__forecast__day">${dayName}</h3>
            <p class="weather__forecast__temperature"><span class="value">${day > 0 ? '+' + day.toFixed(1) : day.toFixed(1)}</span> &deg;C</p>
            <span class="minTemp">Min: ${Math.round(min)}</span>
            <span class="maxTemp">Max: ${Math.round(max)}</span>
            `

        weatherForecastContainer.appendChild(articleEl)
    }
}

// SEARCH INPUT EVENT
searchInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        getWeatherByCityName(searchInput.value)
        searchInput.value = ''
    }
})


