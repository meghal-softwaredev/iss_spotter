const { func } = require('assert-plus');
const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};
const fetchCoordsByIP = function(ip, callback) {
  request("https://freegeoip.app/json/", (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    let latitude = JSON.parse(body).latitude;
    let longitude = JSON.parse(body).longitude;
   
    callback(null, {latitude, longitude});
  });
};
const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching fly over times for coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, JSON.parse(body).response);
  });
};
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coordinator) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coordinator, (error, nextTimes) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, nextTimes);
      });
    });
  });
};
module.exports = { nextISSTimesForMyLocation };