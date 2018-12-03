var formatDate = (date) => {
    if(date != undefined && date != null) {
        return new Date(date).toLocaleTimeString();
    } else {
        return 'Never';
    }
};

var detectChange = (divId, newValue) => {
    var oldValue = $("#" + divId).text();
    if (newValue != oldValue) {
        return true;
    }
    return false;
};

var animate = (element, blinksNb) => {
    for (var i = 0; i < blinksNb; i++) { 
        $(element).fadeIn(300).fadeOut(300);
    }
    $(element).fadeIn(300);
};


$(function worker(){
    $.ajax({
        url: '/cache', 
        success: function(data) {

            var newLastSeen = data.pigBulbState ? '(Last seen Off:' + formatDate(data.pigBulbLastSeenOff) + ')' 
                : '(Last seen On: ' + formatDate(data.pigBulbLastSeenOn) + ')';
            var newSunriseTime = formatDate(data.sunriseTime);
            var newSunsetTime = formatDate(data.sunsetTime);
            var newBulbState = data.pigBulbState ? 'On' : 'Off';
            var newBulbBri = data.pigBulbBrightness;

            if(detectChange('lastSeen', newLastSeen)) {
                animate($("#lastSeen"), 6);
                $("#lastSeen").html(newLastSeen);
            }

            if(detectChange('sunriseTime', newSunriseTime)) {
                animate($("#sunriseTime"), 6);
                $("#sunriseTime").html(formatDate(newSunriseTime));
            }

            if(detectChange('sunsetTime', newSunsetTime)) {
                animate($("#sunsetTime"), 6);
                $("#sunsetTime").html(formatDate(newSunsetTime));
            }

            if(detectChange('pigBulbState', newBulbState)) {
                animate($("#pigBulbState"), 6);
                $("#pigBulbState").html(newBulbState);
            }

            if(detectChange('pigBulbBrightness', newBulbBri)) {
                animate($("#pigBulbBrightness"), 6);
                $("#pigBulbBrightness").html(newBulbState);
            }

            $("#lastRefresh").html(formatDate(new Date()));

        },  
        complete: function() {
            setTimeout(worker, 5*1000);
        }
    });
});