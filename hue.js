const request = require('request');

const username = 'EZNBevLPlA12Y7g9-sXTzvi8qPV2M02PJqvfxG5O';
const host = 'http://192.168.1.251';

var setState = function(id, state) {
    return new Promise((resolve, reject) => {
        request({
            url: `${host}/api/${username}/lights/${id}/state`,
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
            url: `${host}/api/${username}/lights/${id}`,
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