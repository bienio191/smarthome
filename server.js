const schedule = require('node-schedule');
const express = require('express');
const hbs = require('hbs');
const Cache = require('node-cache');

const sun = require('./sun.js');
const hue = require('./hue.js');
const logger = require('./logger.js');
const config = require('./config.json');

//cache inits
const myCache = new Cache( { stdTTL: 86400 } );

//express inits
var app = express();
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    next();
});

app.use(express.static(__dirname + '/public'));


//routinga
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page'
    });
});

app.get('/hue', (req, res) => {

    res.render('hue.hbs', {
        pageTitle: 'Hue Control',
        sunriseTime: myCache.get('sunriseTime').toLocaleTimeString(),
        sunsetTime: myCache.get('sunsetTime').toLocaleTimeString(),
        pigBulbState: myCache.get('pigBulbState')
    });   

});



/////////////
//cache logic
/////////////

//run every day 2 am
var dailyCacheJob = schedule.scheduleJob('0 2 * * *', () => {

    var sunsetPromise = sun.getSunsetTimeAsync(config.home_latitude, config.home_longitude, new Date());
    var sunrisePromise = sun.getSunriseTimeAsync(config.home_latitude, config.home_longitude, new Date());

    sunsetPromise.then((time) => {
        var sunsetDate = new Date(time);
        myCache.set('sunsetTime', sunsetDate);
        logger.log(`sunsetTime in cache reloaded, new value: ${sunsetDate}`);
    }).catch((errorMsg) => {
        logger.log(errorMsg);
    });

    sunrisePromise.then((time) => {
        var sunriseDate = new Date(time);
        myCache.set('sunriseTime', sunriseDate);
        logger.log(`sunsetTime in cache reloaded, new value: ${sunriseDate}`);
    }).catch((errorMsg) => {
        logger.log(errorMsg);
    });

});

//run every 5 min
var freqCacheJob = schedule.scheduleJob('*/5 * * * *', () => {
    var pigBulbStatePromise = hue.getStateAsync(config.pig_bulb_id);

    pigBulbStatePromise.then((state) => {
        myCache.set('pigBulbState', state);
        logger.log(`pigBulbState in cache reloaded, new value: ${state}`);
    }).catch((errorMsg) => {
        logger.log(errorMsg);
    });
    
});

/////////////
//jobs
/////////////

var pigBulbJob = schedule.scheduleJob('*/5 * * * *', () => {
    var now = new Date();
    if(myCache.get('sunsetTime') < now && config.sleep_hour > now.getHours()) {
        if(myCache.get('pigBulbState') == false) {
            logger.log(`pigBulbJob checked, bulb turned on`);
            hue.setStateAsync(config.pig_bulb_id, true);
            hue.setBrightnessAsync(config.pig_bulb_id, config.pig_bulb_brightness);
        }
    } else {
        if (myCache.get('pigBulbState') == true) {
            logger.log(`pigBulbJob checked, bulb turned off`);
            hue.setStateAsync(config.pig_bulb_id, false);
        } 
    }
    
});



/////////////
//run serverr
/////////////


app.listen(3000, () => {
    console.log('Server is up on port 3000');
    dailyCacheJob.invoke();
    freqCacheJob.invoke();

});






