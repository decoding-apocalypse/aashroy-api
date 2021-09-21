const ngoData = require("./ngosData");

const shortestDistanceNGO = (ngoslocation, userLocation) => {
  //Logic
  let index = 1;
  let minDistance = Math.sqrt(
    Math.pow(userLocation.lat - ngoslocation[0].location.lat, 2) +
      Math.pow(userLocation.lng - ngoslocation[0].location.lng, 2)
  );
  for (let i = 1; i < ngoslocation.length; i++) {
    let distance = Math.sqrt(
      Math.pow(userLocation.lat - ngoslocation[i].location.lat, 2) +
        Math.pow(userLocation.lng - ngoslocation[i].location.lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      index = i+1;
    }
  }
  console.log(`${minDistance} and ${index}`);
  // return { minDistance, index };
};

const userLocation = {
  lat: 24.8333,
  lng: 92.7789,
}

shortestDistanceNGO(ngoData.NGO, userLocation);

// module.exports = shortestDistanceNGO;
