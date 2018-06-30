var W_KEY = `15f09ab9c206f8a7e1fa8aa371e6ca08`;

function getWeatherByPos(currLat, currLng) {
  var lat = currLat;
  var lon = currLng;
  console.log('Getting weather by pos');
  var prm = axios.get(
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${W_KEY}`
  );
  return prm.then(function(res) {
    return res.data;
  });
}

export default {
  getWeatherByPos
};
