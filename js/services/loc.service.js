export const locService = {
    getLocs,
    getSearchPos,
    getAddress,
    deleteLoc
}

import { storageService } from './storage.service.js'

const API_KEY = 'AIzaSyBZ9rdVSQnQ_VgaChu60lkDetLhzHoqCCg'
const gLocations = storageService.load('locationsDB') || []
let gCurrId = 101

const locs = [
    { id: gCurrId++, name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { id: gCurrId++, name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function deleteLoc(locId) {
    const idx = locs.findIndex(loc => loc.id === locId)
    locs.splice(idx, 1)
    storageService.save('locationsDB', locs)
    return locs
}

function getAddress(location, cb) {
    console.log(location);
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${API_KEY}`)
        .then(res => {
            // console.log(res.data.results[0].formatted_address);
            return res.data.results[0].formatted_address
        })
        .then(res => {
            console.log(res, location);
            locs.push({
                id: gCurrId++,
                name: res,
                lat: location.lat,
                lng: location.lng
            })
            storageService.save('locationsDB', locs)
            return locs
        })
        .then(res => {
            cb(res)
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