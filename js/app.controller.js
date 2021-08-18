import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onGetSearchPos = onGetSearchPos;
window.onCopyLink = onCopyLink;
window.onDeleteLoc = onDeleteLoc;

function onInit() {
    const pos = getUrlPosition()
    console.log(pos)
    mapService.initMap(pos)
        .then((map) => {
            console.log('Map is ready');
            map.addListener('click', (mapsMouseEvent) => {
                console.log('Map clicked!')
                const location = mapsMouseEvent.latLng.toJSON()
                onAddMarker(location.lat, location.lng)
                locService.getAddress(location, renderLocs)
            })
        })
        .catch(() => console.log('Error: cannot init map'));
}

function renderLocs(locs) {
    const strHTMLs = locs.map(loc => {
        return `<tr>
        <td>${loc.name}</td>
        <td><button onclick="onPanTo(${loc.lat}, ${loc.lng}, '${loc.name}')">Go</button></td>
        <td><button onclick="onDeleteLoc(${loc.id})">Delete</button></td>
        </tr>`
    }).join('')
    document.querySelector('tbody').innerHTML = strHTMLs
}

function onDeleteLoc(locId) {
    const locs = locService.deleteLoc(locId)
    renderLocs(locs)
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

function onPanTo(lat, lng, location) {
    // console.log('Panning the Map');
    mapService.panTo(lat, lng)
    onAddMarker(lat, lng)
    if (location) document.querySelector('.user-pos').innerText = location
}

function onCopyLink(elBtn) {
    getPosition()
        .then(pos => {
            const link = `https://shirlav.github.io/travel-tip/index.html?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
            const inputc = document.body.appendChild(document.createElement("input"));
            inputc.value = link;
            inputc.focus();
            inputc.select();
            document.execCommand('copy');
            inputc.parentNode.removeChild(inputc);
            elBtn.innerText = 'Link copied!'
            setTimeout(() => { elBtn.innerText = 'Copy Location' }, 2000)
        })
}

function getUrlPosition() {
    const lat = +getQueryVariable('lat');
    const lng = +getQueryVariable('lng');
    return { lat, lng }
}

function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}