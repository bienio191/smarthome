const request = require('request');

var getSunriseTime = function(latitude, longitude, date) {
    var dateFormatted = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

    return new Promise((resolve, reject) => {
        request({
            url: `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${dateFormatted}&formatted=0`,
            method: 'GET',
            json: true
        }, (error, response, body) => {
            if(error) {
               reject("Error thrown from getSunsetTime");
            } else {
                resolve(body.results.sunrise);
            }
        });
    });
}

var getSunsetTime = function(latitude, longitude, date) {
    var dateFormatted = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

    return new Promise((resolve, reject) => {
        request({
            url: `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${dateFormatted}&formatted=0`,
            method: 'GET',
            json: true
        }, (error, response, body) => {
            if(error) {
               reject("Error thrown from getSunsetTime");
            } else {
                resolve(body.results.sunset);
            }
        });
    });
}

module.exports = {
    getSunriseTime,
    getSunsetTime
};