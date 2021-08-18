import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onGetSearchPos = onGetSearchPos;

function onInit() {
    mapService.initMap()
        .then((map) => {
            console.log('Map is ready');
            map.addListener('click', (mapsMouseEvent) => {
                console.log('Map clicked!')
                const location = mapsMouseEvent.latLng.toJSON()
                console.log(location);
                // const locationLat = location.lat
                // const locationLng = location.lng
                locService.getAddress(location)
                    // console.log(locationLat);
                    // getAddressFromCoords(locationLat, locationLng)
            })

        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    // console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(lat, lng) {
    // console.log('Adding a marker');
    mapService.addMarker({ lat, lng });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            // console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            onPanTo(pos.coords.latitude, pos.coords.longitude);
            // document.querySelector('.user-pos').innerText =
            //     `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onGetSearchPos() {
    const adress = document.querySelector('[type=search]').value;
    locService.getSearchPos(adress)
        .then(pos => {
            onPanTo(pos.lat, pos.lng);
            document.querySelector('.user-pos').innerText = adress;
        })
}

function onPanTo(lat, lng) {
    // console.log('Panning the Map');
    mapService.panTo(lat, lng);
    onAddMarker(lat, lng)
}