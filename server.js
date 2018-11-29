const schedule = require('node-schedule');
const express = require('express');
const hbs = require('hbs');
const Cache = require('node-cache');

const sun = require('./sun.js');
const hue = require('./hue.js');
const logger = require('./logger.js');
const config = require('./config');

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

//hbs initis
hbs.registerHelper('sayIt', (message) => {
    return message;
});

hbs.registerHelper('sunsetTimeToday', () => {

});

hbs.registerHelper('sunriseTimeToday', () => {
    return message;
});


//routing
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page'
    });
});

app.get('/hue', (req, res) => {
    var sunsetTime = myCache.get('sunsetTime');
    var sunriseTime = myCache.get('sunriseTime');

    if(sunsetTime != undefined && sunriseTime != undefined) {
        console.log('Values taken from cache');
        res.render('hue.hbs', {
            pageTitle: 'Hue Control',
            sunriseTime: sunriseTime,
            sunsetTime: sunsetTime
        });

    } else {

        var sunsetTime;
        var sunriseTime;

        var sunsetPromise = sun.getSunsetTime(config.home_latitude, config.home_longitude, new Date());
        var sunrisePromise = sun.getSunriseTime(config.home_latitude, config.home_longitude, new Date());

        sunsetPromise.then((time) => {
            var sunsetDate = new Date(time);
            sunsetTime = sunsetDate.toString();
            myCache.set('sunsetTime', sunsetTime);

            return sun.getSunriseTime(config.home_latitude, config.home_longitude, new Date());
        }).then((time) => {
            var sunriseDate = new Date(time);
            sunriseTime = sunriseDate.toString();
            myCache.set('sunriseTime', sunriseTime);

            res.render('hue.hbs', {
                pageTitle: 'Hue Control',
                sunriseTime: sunriseTime,
                sunsetTime: sunsetTime
            });

        }).catch((errorMsg) => {
            logger.log(errorMsg);
        });

    }

});


app.listen(3000, () => {
    console.log('Server is up on port 3000');
});






