const request = require('request');

const config = require('./config.js');
const logger = require('./logger.js');

var setStateAsync = function(id, state) {
    return new Promise((resolve, reject) => {
        request({
            url: `${config.hue_host}/api/${config.hue_user_id}/lights/${id}/state`,
            method: 'PUT',
            json: {"on": state}
        }, (error, response, body) => {
            if(error) {
               reject('Error thrown from setState');
            } else {
                resolve('State changed successfully');
            }
        });
    });
}

var setBrightnessAsync = function(id, bri) {
    return new Promise((resolve, reject) => {
        request({
            url: `${config.hue_host}/api/${config.hue_user_id}/lights/${id}/state`,
            method: 'PUT',
            json: {"bri": "s"} //parseInt(bri)
        }, (error, response, body) => {
            logger.log(JSON.stringify(body));
            if(error || JSON.stringify(body).includes('error')) {
               reject('Error thrown from setBrightnessAsync');
            } else {
                resolve(`Brightness changed successfully to ${bri}`);
            }
        });
    });
}

var getStateAsync = function(id) {
    return new Promise((resolve, reject) => {
        request({
            url: `${config.hue_host}/api/${config.hue_user_id}/lights/${id}`,
            method: 'GET',
            json: true
        }, (error, response, body) => {
            if(error) {
               reject('Error thrown from getState');
            } else {
                resolve(body.state.on);
            }
        });
    });
}

var getBrightnessAsync = function(id) {
    return new Promise((resolve, reject) => {
        request({
            url: `${config.hue_host}/api/${config.hue_user_id}/lights/${id}`,
            method: 'GET',
            json: true
        }, (error, response, body) => {
            if(error) {
               reject('Error thrown from getState');
            } else {
                resolve(body.state.bri);
            }
        });
    });
}

module.exports = {
    setStateAsync,
    getStateAsync,
    setBrightnessAsync,
    getBrightnessAsync
};