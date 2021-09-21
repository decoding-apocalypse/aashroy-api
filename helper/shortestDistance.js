const shortestDistanceNGO = (ngoslocation, userLocation) => {
  let index = 0;
  let minDistance = Math.abs(
    Math.sqrt(Math.pow(userLocation.lat, 2) + Math.pow(userLocation.lng, 2)) -
      Math.sqrt(
        Math.pow(ngoslocation[0].lat, 2) + Math.pow(ngoslocation[0].lng, 2)
      )
  );
  for (let i = 1; i < ngoslocation.length; i++) {
    let distance = Math.abs(
      Math.sqrt(Math.pow(userLocation.lat, 2) + Math.pow(userLocation.lng, 2)) -
        Math.sqrt(
          Math.pow(ngoslocation[i].lat, 2) + Math.pow(ngoslocation[i].lng, 2)
        )
    );
    if (distance < minDistance) {
      minDistance = distance;
      index = i;
    }
  }
  return {minDistance, index};
};

module.exports = shortestDistanceNGO;
