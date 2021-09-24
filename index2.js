const { nextISSTimesForMyLocation } = require('./iss_promised');

nextISSTimesForMyLocation()
  .then((passTimes) => {
    for (const time of passTimes) {
      const datetime = new Date(0);
      datetime.setUTCSeconds(time.risetime);
      const duration = time.duration;
      console.log(`Next pass at ${datetime} for ${duration} seconds!`);
    }
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
