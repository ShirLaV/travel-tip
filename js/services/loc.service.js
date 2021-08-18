export const locService = {
    getLocs,
    getSearchPos,
    getAddress
}

const API_KEY = 'AIzaSyBZ9rdVSQnQ_VgaChu60lkDetLhzHoqCCg'

const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function getAddress(location) {
    console.log(location);
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=${API_KEY}`)
        .then(res => {
            console.log(res.data);
        })
}


function getSearchPos(adress) {
    const API_KEY = 'AIzaSyBZ9rdVSQnQ_VgaChu60lkDetLhzHoqCCg'
    const adressSTR = adress.replace(/\s/g, '+');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${adressSTR}&key=${API_KEY}`

    return axios.get(url)
        .then(res => {
            console.log(res.data);
            return res.data.results[0].geometry.location
        })

}