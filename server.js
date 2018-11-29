const schedule = require('node-schedule');

const sun = require('./sun.js');
const hue = require('./hue.js');
const logger = require('./logger.js');
const config = require('./config');


var promise = sun.getSunsetTime(config.home_latitude, config.home_longitude, new Date());
promise.then((time) => {
    var date = new Date(time);
    console.log(date);
}, (errorMsg) => {
    console.log(errorMsg);
});

var promise2 = hue.setState(4, false);

promise2.then((successMsg) => {
    console.log(successMsg);
    return hue.getState(4);
}).then((state) => {
    console.log('State after change', state);
}).catch((errorMsg) => {
    console.log(errorMsg);
});

var task = schedule.scheduleJob(' * * * *', function(){
    logger.log('Job started');

});






