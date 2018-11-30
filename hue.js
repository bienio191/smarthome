const request = require('request');

const config = require('./config');
const logger = require('./logger.js');

var setStateAsync = function(id, state) {
    return new Promise((resolve, reject) => {
        request({
            url: `${config.hue_host}/api/${config.hue_user_id}/lights/${id}/state`,
            method: 'PUT',
            json: {on: state}
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
            json: {bri: bri}
        }, (error, response, body) => {
            if(error) {
               reject('Error thrown from setBrightnessAsync');
            } else {
                resolve('Brightness changed successfully');
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

var getState = function(id) {
    request({
        url: `${config.hue_host}/api/${config.hue_user_id}/lights/${id}`,
        method: 'GET',
        json: true
    }, (error, response, body) => {
        if(error) {
            logger.log('Error thrown from getState');
        } else {
            return body.state.on;
        }
    });
};

module.exports = {
    setStateAsync,
    getStateAsync,
    getState,
    setBrightnessAsync
};