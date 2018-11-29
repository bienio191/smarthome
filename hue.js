const request = require('request');

const config = require('./config');

var setState = function(id, state) {
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

var getState = function(id) {
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

module.exports = {
    setState,
    getState
};