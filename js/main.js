console.log('Main!');

import locService from './services/loc.service.js';
import mapService from './services/map.service.js';
import weatherService from './services/weather.service.js';

locService.getLocs().then(locs => console.log('locs', locs));

var setMapByCords = () => {
  locService
    .getPosition()
    .then(pos => {
      console.log('posi', pos);
      locService
        .getCityNameByCoords(pos.coords.latitude, pos.coords.longitude)
        .then(function(cityName) {
          renderCurrLocation(cityName.results[0].formatted_address);
        });
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
};

window.onload = setMapByCords();

document.querySelector('.my-loc-btn').addEventListener('click', ev => {
  setMapByCords();
  //   console.log('Aha!', ev.target);
});

document.querySelector('.search-btn').addEventListener('click', ev => {
  //   set Map On Searched City
  let cityName = document.querySelector('#searchBox').value;
  locService
    .getPositionByName(cityName)
    .then(pos => {
      console.log(pos);
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
