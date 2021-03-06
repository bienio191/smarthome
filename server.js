const schedule = require('node-schedule');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const Cache = require('node-cache');

const sun = require('./sun.js');
const hue = require('./hue.js');
const logger = require('./logger.js');
const config = require('./config.js');
const utils = require('./utils.js');

//cache inits
const myCache = new Cache();

//express inits
var app = express();; 
var router = express.Router(); 
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    next();
});

app.use(express.static(__dirname + '/public'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(bodyParser.json());
app.use('/api', router);

//standard routing
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page'
    });
});

app.get('/hue', (req, res) => {

    if(myCache.get('sunriseTime') == null || myCache.get('sunriseTime') == undefined || 
        myCache.get('sunsetTime') == null || myCache.get('sunsetTime') == undefined ||
        myCache.get('pigBulbState') == null || myCache.get('pigBulbState') == undefined ||
        myCache.get('pigBulbBrightness') == null || myCache.get('pigBulbBrightness') == undefined) {

        cacheReoload();
    }

    res.render('hue.hbs', {
        pageTitle: 'Hue Control',
        sunriseTime: myCache.get('sunriseTime').toLocaleTimeString(),
        sunsetTime: myCache.get('sunsetTime').toLocaleTimeString(),
        pigBulbState: myCache.get('pigBulbState'),
        pigBulbBrightness: myCache.get('pigBulbBrightness'),
        pigRoomTemperature: myCache.get('pigRoomTemperature')
    });   

});

app.get('/cache', (req, res) => {
    var keys =  myCache.keys();
    var myMap = new Map();
    for(var i=0; i<keys.length; i++) {
        myMap.set(keys[i], myCache.get(keys[i]));
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(utils.strMapToObj(myMap)));
});

router.route('/temperatures').post( (req, res) => {
    logger.log(req.body.roomName + ":" + req.body.temperature);
    myCache.set('pigRoomTemperature', req.body.temperature);
    res.sendStatus(200);
});


/////////////
//cache logic
/////////////

//run every day 12 am
var dailyCacheJob = schedule.scheduleJob('0 0 0 * * *', () => {

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

var cacheReoload = () => {
    dailyCacheJob.invoke();
    freqCacheJob.invoke();
}

//run every 5 sec
var freqCacheJob = schedule.scheduleJob('*/5 * * * * *', () => {

    //bulb state
    var pigBulbStatePromise = hue.getStateAsync(config.pig_bulb_id);

    pigBulbStatePromise.then((state) => {
        myCache.set('pigBulbState', state);
        if(state) {
            myCache.set('pigBulbLastSeenOn', new Date());
        } else {
            myCache.set('pigBulbLastSeenOff', new Date());
        }
    }).catch((errorMsg) => {
        logger.log(errorMsg);
    });


    //bulb brightness
    var pigBulbBrightnessPromise = hue.getBrightnessAsync(config.pig_bulb_id);

    pigBulbBrightnessPromise.then((bri) => {
        myCache.set('pigBulbBrightness', bri);
    }).catch((errorMsg) => {
        logger.log(errorMsg);
    });
    
});

/////////////
//job
/////////////

var pigBulbJob = schedule.scheduleJob('*/10 * * * * *', () => {
    var now = new Date();
    if(myCache.get('sunsetTime') < now && config.sleep_hour > now.getHours()) {

        if(myCache.get('pigBulbState') == false) {
            logger.log(`pigBulbJob checked, bulb turned on`);
            hue.setStateAsync(config.pig_bulb_id, true);
        } 

        if(myCache.get('pigBulbBrightness') != config.pig_bulb_brightness) {


            var promise = hue.setBrightnessAsync(config.pig_bulb_id, config.pig_bulb_brightness);

            promise.then((successMsg) => {
                logger.log(successMsg);
            }, (errorMsg) => {
                logger.log(errorMsg);
            });

            logger.log(`pigBulbJob checked, bulb bri re-set to default value`);
            logger.log(myCache.get('pigBulbBrightness'));
            logger.log(config.pig_bulb_brightness);
        }
        
    } else {
        if (myCache.get('pigBulbState') == true) {
            logger.log(`pigBulbJob checked, bulb turned off`);
            hue.setStateAsync(config.pig_bulb_id, false);
        } 
    }
    
});


/////////////
//run server
/////////////

app.listen(3000, () => {
    logger.log('Server is up on port 3000');
    cacheReoload();

});






