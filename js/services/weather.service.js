export const weatherService = {
    getWeather
}

const API_KEY = '0a205aa22a63dd7951f612e763838e59'

function getWeather(location, cb) {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&units=metric&appid=${API_KEY}`
    axios.get(url)
        .then(res => cb(location, res.data));
}