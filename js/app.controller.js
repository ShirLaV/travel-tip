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
    mapService.initMap(pos)
        .then((map) => {
            const initPos = (!pos.lat || !pos.lng) ? { lat: 32.0749831, lng: 34.9120554 } : pos
            locService.getAddress(initPos, renderLocs)
            map.addListener('click', (mapsMouseEvent) => {
                const location = mapsMouseEvent.latLng.toJSON()
                onAddMarker(location.lat, location.lng)
                locService.getAddress(location, renderLocs)
            })
        })
        .catch(() => console.log('Error: cannot init map'));
}

function renderLocs(locs) {
    if (!locs) locs = locService.getLocs()
    const strHTMLs = locs.map(loc => {
        return `<div class="location-card flex">
        <p>${loc.name}</p>
        <div class="flex">
        <button class="go-btn" onclick="onPanTo(${loc.lat}, ${loc.lng}, '${loc.name}')">Go</button>
        <button class="delete-btn" onclick="onDeleteLoc(${loc.id})">Delete</button>
        </div>
        </div>`
    }).join('')
    const lastLoc = locs[locs.length-1]
    document.querySelector('.locations-container').innerHTML = strHTMLs
    document.querySelector('.user-pos').innerText = (lastLoc.name)
    onAddMarker(lastLoc.lat, lastLoc.lng)
}

function onDeleteLoc(locId) {
    const locs = locService.deleteLoc(locId)
    renderLocs(locs)
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(lat, lng) {
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
            onPanTo(pos.coords.latitude, pos.coords.longitude);
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