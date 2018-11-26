const schedule = require('node-schedule');
const sun = require('./sun.js');
const hue = require('./hue.js');

const longitude = '20.701697';
const latitude = '52.447591';

// var j = schedule.scheduleJob(' * * * *', function(){
//     console.log('JOB: ' + new Date().toString());
//   });

var promise = sun.getSunsetTime(latitude, longitude, new Date());
promise.then((time) => {
    var date = new Date(time);
    console.log(date);
}, (errorMsg) => {
    console.log(errorMsg);
});

var promise2 = hue.setState(4, true);

promise2.then((successMsg) => {
    console.log(successMsg);
    return hue.getState(4);
}).then((state) => {
    console.log('State after change', state);
}).catch((errorMsg) => {
    console.log(errorMsg);
});






