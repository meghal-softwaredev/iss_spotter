const { date } = require('assert-plus');
const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  for (const time of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(time.risetime);
    const duration = time.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
});