const fs = require('fs');

var logFileName = 'server.log';

var log = function(msg) {
    fs.appendFile(logFileName, `${msg}: ${new Date().toString()} \n`, (err) => {
        if(err) throw err;
    })
};

module.exports = {
    log
}
