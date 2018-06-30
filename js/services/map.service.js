var map;

function initMap(lat, lng) {
  console.log('InitMap');
  return _connectGoogleApi().then(() => {
    console.log('google available');
    map = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15
    });
    console.log('Map!', map);
  });
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: map,
    title: 'Hello World!'
  });
  return marker;
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = 'AIzaSyArwZLwu8qpwO8J1vkedj-qYnK7mdLmhYE';

  var elGoogleApi = document.createElement('script');
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
    elGoogleApi.onerror = reject.bind(null, 'Google script failed to load');
  });

  var elGoogleApi2 = document.createElement('script');
  elGoogleApi2.src = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=${API_KEY}`;
  elGoogleApi2.async = true;
  document.body.append(elGoogleApi2);

  return new Promise((resolve, reject) => {
    elGoogleApi2.onload = resolve;
    elGoogleApi2.onerror = () => reject('Google script failed to load');
    elGoogleApi2.onerror = reject.bind(null, 'Google script failed to load');
  });
}

export default {
  initMap,
  addMarker
};
