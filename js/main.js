console.log('Main!');

import locService from './services/loc.service.js';
import mapService from './services/map.service.js';
import weatherService from './services/weather.service.js';
import utilsService from './utils.js';

locService.getLocs().then(locs => console.log('locs', locs));

var setMapByCurrPos = () => {
  locService
    .getPosition()
    .then(pos => {
      console.log('posi', pos);
      locService
        .gePosByCoords(pos.coords.latitude, pos.coords.longitude)
        .then(function(cityName) {
          renderCurrLocation(cityName.results[0].formatted_address);
        });
      utilsService.saveToStorage('location', [
        pos.coords.latitude,
        pos.coords.longitude
      ]);
      renderWeatherBox(pos.coords.latitude, pos.coords.longitude);
      mapService
        .initMap(pos.coords.latitude, pos.coords.longitude)
        .then(() => {
          mapService.addMarker({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        })
        .catch(console.warn);
    })
    .catch(err => {
      console.log('err!!!', err);
    });
  document.querySelector('#searchBox').value = 'Your Location';
};
// window.onload = checkForCopyLocURL();
window.onload = checkForCopyLocURL2();

document.querySelector('.my-loc-btn').addEventListener('click', ev => {
  setMapByCurrPos();
  //   console.log('Aha!', ev.target);
});

document.querySelector('.search-btn').addEventListener('click', ev => {
  //   set Map On Searched City
  let cityName = document.querySelector('#searchBox').value;
  locService
    .getPositionByName(cityName)
    .then(pos => {
      console.log(pos);
      renderWeatherBox(
        pos.results[0].geometry.location.lat,
        pos.results[0].geometry.location.lng
      );
      utilsService.saveToStorage('location', [
        pos.results[0].geometry.location.lat,
        pos.results[0].geometry.location.lng
      ]);
      mapService
        .initMap(
          pos.results[0].geometry.location.lat,
          pos.results[0].geometry.location.lng
        )
        .then(() => {
          mapService.addMarker({
            lat: pos.results[0].geometry.location.lat,
            lng: pos.results[0].geometry.location.lng
          });
        })
        .then(renderCurrLocation(pos.results[0].formatted_address))
        .catch(console.warn);
    })
    .catch(err => {
      console.log('err!!!', err);
    });
});

var searchBox = document.querySelector('#searchBox');
searchBox.addEventListener('keyup', function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.querySelector('.search-btn').click();
  }
});

function renderCurrLocation(CityName) {
  document.querySelector('.location-name').innerHTML = CityName;
}

function renderWeatherBox(lat, lng) {
  console.log('lat, lng', lat, lng);

  weatherService.getWeatherByPos(lat, lng).then(weather => {
    console.log('weather', weather);
    let strHTML = `current temp :` + weather.main.temp;
    strHTML += ` humidity :` + weather.main.humidity;

    document.querySelector('.weather').innerHTML = strHTML;
  });
}

document.querySelector('.copt-btn').addEventListener('click', ev => {
  //   copy lan/lng location and share app
  let location = utilsService.loadFromStorage('location');
  let tmpCopyArea = document.createElement('textarea');
  document.body.appendChild(tmpCopyArea);
  tmpCopyArea.value =
    'https://nuritlh.github.io/Travel-Tip/?lat=' +
    location[0] +
    '&lng=' +
    location[1];
  tmpCopyArea.select();
  document.execCommand('copy');
  document.body.removeChild(tmpCopyArea);
  utilsService.saveToStorage('copyLocation', tmpCopyArea.value);
  utilsService.saveToStorage('copyLocationLocal', [location[0], location[1]]);
});

function checkForCopyLocURL() {
  if (utilsService.loadFromStorage('copyLocationLocal') !== null) {
    let location = utilsService.loadFromStorage('copyLocationLocal');
    console.log('onloadloc', location);

    locService.gePosByCoords(location[0], location[1]).then(function(cityName) {
      renderCurrLocation(cityName.results[0].formatted_address);
    });
    utilsService.saveToStorage('location', [location[0], location[1]]);
    renderWeatherBox(location[0], location[1]);
    mapService
      .initMap(location[0], location[1])
      .then(() => {
        mapService.addMarker({
          lat: location[0],
          lng: location[1]
        });
      })
      .catch(console.warn);
    window.localStorage.removeItem('copyLocationLocal');
    window.localStorage.removeItem('copyLocation');
  } else {
    setMapByCurrPos();
  }
}

function checkForCopyLocURL2() {
  if (utilsService.loadFromStorage('copyLocation') !== null) {
    let locationurl = utilsService.loadFromStorage('copyLocation');
    console.log('onloadloc', locationurl);
    var lat = +getParameterByName('lat', locationurl);
    var lng = +getParameterByName('lng', locationurl);

    locService.gePosByCoords(lat, lng).then(function(cityName) {
      renderCurrLocation(cityName.results[0].formatted_address);
    });
    utilsService.saveToStorage('location', lat, lng);
    renderWeatherBox(lat, lng);
    mapService
      .initMap(lat, lng)
      .then(() => {
        mapService.addMarker({
          lat: lat,
          lng: lng
        });
      })
      .catch(console.warn);
    window.localStorage.removeItem('copyLocationLocal');
    window.localStorage.removeItem('copyLocation');
  } else {
    setMapByCurrPos();
  }
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
