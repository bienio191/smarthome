const request = require('request');

const config = require('./config');

var getSunriseTimeAsync = function(latitude, longitude, date) {
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

var getSunriseTime = function(latitude, longitude, date) {
    var dateFormatted = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

    request({
        url: `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${dateFormatted}&formatted=0`,
        method: 'GET',
        json: true
    }, (error, response, body) => {
        if(error) {
            reject("Error thrown from getSunsetTime");
        } else {
            return body.results.sunrise;
        }
    });
}

var getSunsetTimeAsync = function(latitude, longitude, date) {
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

var getSunsetTime = function(latitude, longitude, date) {
    var dateFormatted = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

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
}

module.exports = {
    getSunriseTimeAsync,
    getSunsetTimeAsync,
    getSunriseTime,
    getSunsetTime
};