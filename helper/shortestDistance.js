const shortestDistanceNGO = (ngosData, userLocation) => {
  //Logic
  let index = 0;
  let minDistance = Math.sqrt(
    Math.pow(userLocation.lat - ngosData[0].location.lat, 2) +
      Math.pow(userLocation.lng - ngosData[0].location.lng, 2)
  );
  for (let i = 1; i < ngosData.length; i++) {
    let distance = Math.sqrt(
      Math.pow(userLocation.lat - ngosData[i].location.lat, 2) +
        Math.pow(userLocation.lng - ngosData[i].location.lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      index = i;
    }
  }
  return ngosData[index];
};

module.exports = shortestDistanceNGO;
