export const locService = {
    getLocs,
    getSearchPos,
    getAddress,
    deleteLoc
}

import { storageService } from './storage.service.js'

const API_KEY = 'AIzaSyBZ9rdVSQnQ_VgaChu60lkDetLhzHoqCCg'
let gCurrId = 101
const gLocations = storageService.load('locationsDB') || []


function getLocs() {
    return gLocations
}

function deleteLoc(locId) {
    const idx = gLocations.findIndex(loc => loc.id === locId)
    gLocations.splice(idx, 1)
    storageService.save('locationsDB', gLocations)
    return gLocations
}

function getAddress(location, cb) {
    if (gLocations) {
        if (gLocations.find(loc => loc.lat === location.lat && loc.lng === location.lng)) {
            cb(gLocations)
            return
        }
    }
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${API_KEY}`)
        .then(res => {
            return res.data.results[0].formatted_address
        })
        .then(res => {
            gLocations.push({
                id: gCurrId++,
                name: res,
                lat: location.lat,
                lng: location.lng
            })
            storageService.save('locationsDB', gLocations)
            cb(gLocations)
        })

}

function getSearchPos(adress) {
    const API_KEY = 'AIzaSyBZ9rdVSQnQ_VgaChu60lkDetLhzHoqCCg'
    const adressSTR = adress.replace(/\s/g, '+');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${adressSTR}&key=${API_KEY}`

    return axios.get(url)
        .then(res => {
            return res.data.results[0].geometry.location
        })

}