var locs = [{ lat: 11.22, lng: 22.11 }];

function getLocs1() {
  return Promise.resolve(locs);
}

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs);
    }, 2000);
  });
}

function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function getPositionByName(cityName) {
  console.log('Getting Pos by name');
  var prm = axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${cityName}&key=AIzaSyArwZLwu8qpwO8J1vkedj-qYnK7mdLmhYE`
  );
  return prm.then(function(res) {
    return res.data;
  });
}

function gePosByCoords(currLat, currLng) {
  var latlng = '' + currLat + ', ' + currLng;
  var prm = axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=` +
      latlng +
      `&sensor=false`
  );
  return prm.then(function(res) {
    return res.data;
  });
}

export default {
  getLocs,
  getPosition,
  getPositionByName,
  gePosByCoords
};
