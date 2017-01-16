/**
 * Created by r00fi0 on 12/30/16.
 */

var express = require('express');
var robot = require("robotjs");
// var locks = require('locks');

var router = express.Router();


var chart = [];
var mx = []
var my = []
var mz = []

var ax = []
var ay = []
var az = []

var gx = []
var gy = []
var gz = []

router.get('/', function (req, res) {
    res.sendfile('./public/orientation.html'); // load the single view file (angular will handle the page changes on the front-end)
});

router.get('/chart', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    // res.send(JSON.stringify({series:[chart]}));
    res.send(JSON.stringify({
        series: [mx,my,mz, ax,ay,az, gx,gy,gz],
        direction: [dirX, dirZ, reverseX, reverseZ, stopPointX, stopPointZ,accelerometer.stop.y]
    }));
});

router.get('/clear', function (req, res) {
    chart = [];
    mx = []
    my = []
    mz = []

    ax = []
    ay = []
    az = []

    gx = []
    gy = []
    gz = []
    reverseX = false
    reverseZ = false
    sendResponse(res);
});
var stop = false;
router.get('/stop', function (req, res) {
    stop = true;
    sendResponse(res);
});
router.get('/resume', function (req, res) {
    stop = false;
    sendResponse(res);
});

router.get('/resume', function (req, res) {
    stop = false;
    sendResponse(res);
});
router.get('/calibrate', function (req, res) {
    stopPointX = old.x;
    stopPointZ = old.z;
    accelerometer.stop.x = old.ax;
    accelerometer.stop.y = old.ay;
    accelerometer.stop.z = old.az;
    sendResponse(res);
});


var stopPointX = 3900;
var stopPointZ = 8100;
var accelerometer = {};
accelerometer.stop = {};
accelerometer.sensivity = {};
accelerometer.sensivity.x = 40000;
accelerometer.sensivity.y = 40000;
accelerometer.sensivity.z = 40000;

accelerometer.timeoutDone = true;
accelerometer.jumpTimeoutDone = true;
accelerometer.stop.y = 900;

var reverseX = false;
var reverseZ = false;

var sensivity = {};
sensivity.stopPointX = 600;
sensivity.stopPointZ = 900;
var old = {};
var dirX = 'stop';
var dirZ = 'stop';


router.post('/accelerometer', function (req, res) {
    old.ax = Number(req.body.ax);
    old.ay = Number(req.body.ay);
    old.az = Number(req.body.az);
    // var t = new Date().getTime()
    // ax.push({x: t, y: old.ax});
    // ay.push({x: t, y: old.ay});
    // az.push({x: t, y: old.az});

    if (req.body.ax > accelerometer.stop.x + accelerometer.sensivity.x ||
        req.body.ax < accelerometer.stop.x - accelerometer.sensivity.x ||
        req.body.ay > accelerometer.stop.y + accelerometer.sensivity.y ||
        req.body.ay < accelerometer.stop.y - accelerometer.sensivity.y ||
        req.body.az > accelerometer.stop.z + accelerometer.sensivity.z ||
        req.body.az < accelerometer.stop.z - accelerometer.sensivity.z
    ) {
        reverseZ = true;
        reverseX = true;
        if (accelerometer.timeoutDone) {
            accelerometer.timeoutDone = false;
            setTimeout(function () {
                accelerometer.timeoutDone = true;
            }, 300)
        }
    }


    // }
    // G.push({x: Number(req.body.aT), y: Number(req.body.ax)});
    // B.push({x: Number(req.body.aT), y: Number(req.body.ay)});
    // A.push({x: Number(req.body.aT), y: Number(req.body.az)});
    sendResponse(res);
})

var fXg = 0;
var fYg = 0;
var fZg = 0;
var alpha = 0.5;

var valuesX = []
var valuesY = []
var smaMax = 1;
var smaMaY = 3;
var posX = 0;
var posY = 0;
var stopPointCounterX = 0;
var stopPointCounterZ = 0;
var stopPointCounterMaxX = 20;
var stopPointCounterMaxZ = 45;

function smaX(newValue) {
    if (++posX > smaMax) {
        posX = 0;
    }
    valuesX[posX] = newValue;
    var result = 0;
    valuesX.forEach(function (val, index) {
        result += val;
    });
    return result / valuesX.length;
}

function smaY(newValue) {
    if (++posY > smaMaY) {
        posY = 0;
    }
    valuesY[posY] = newValue;
    var result = 0;
    valuesY.forEach(function (val, index) {
        result += val;
    });
    return result / valuesY.length;
}

router.post('/', function (req, res) {
    sendResponse(res);


    var t = new Date().getTime()
    // ax.push({x: t, y: Number(req.body.ax)});
    // ay.push({x: t, y: Number(req.body.ay)});
    // az.push({x: t, y: Number(req.body.az)});
    
    // mx.push({x: t, y: Number(req.body.mx)});
    // my.push({x: t, y: Number(req.body.my)});
    // mz.push({x: t, y: Number(req.body.mz)});
    //
    // gx.push({x: t, y: Number(req.body.gx)});
    // gy.push({x: t, y: Number(req.body.gy)});
    // gz.push({x: t, y: Number(req.body.gz)});

    // var gx = Number(req.body.gx)/100;
    // var gx = Number(req.body.gx)/100;
    var Ax = Number(req.body.ax)/100;
    var Ay = Number(req.body.ay)/100;
    var Az = Number(req.body.az)/100;

    fXg = Ax * alpha + (fXg * (1.0 - alpha));
    fYg = Ay * alpha + (fYg * (1.0 - alpha));
    fZg = Az * alpha + (fZg * (1.0 - alpha));

    var roll  = Math.round(((Math.atan2(-fYg, fZg)*180.0)/Math.PI)*100);
    var pitch = Math.round(((Math.atan2(fXg, Math.sqrt(fYg*fYg + fZg*fZg))*180.0)/Math.PI)*100);
    var z = roll+18000;
    var x = pitch+4500;



    // ax.push({x: t, y: x});
    // az.push({x: t, y: z});
    // ax.push({x: t, y: Ax*100});
    // ay.push({x: t, y: Ay*100});
    // az.push({x: t, y: Az*100});
    if (x < 0 || x - old.x > 800 || old.x - x > 800 ) {
        old.x = x;
        dirX = 'stop'
        moveX();
        old.z = z;
        dirZ = 'stop'
        moveZ();
        return;
    }

    if (z > stopPointZ + sensivity.stopPointZ) {
        if (reverseZ) {
            dirZ = 'left'
        }else {
            dirZ = 'right'
        }
    } else if (z < stopPointZ - sensivity.stopPointZ) {
        if (reverseZ) {
            dirZ = 'right'
        }else {
            dirZ = 'left'
        }
    } else {
        dirZ = 'stop';
        if (accelerometer.timeoutDone) {
            reverseZ = false;
        }
    }

    if (x > stopPointX + sensivity.stopPointX) {
        if (reverseX) {
            dirX = 'down'
        }else{
            dirX = 'up'
        }
    } else if (x < stopPointX - sensivity.stopPointX) {
        if (reverseX) {
            dirX = 'up'
        }else{
            dirX = 'down'
        }

    } else {
        dirX = 'stop';
        if (accelerometer.timeoutDone) {
            reverseX = false;
        }
    }
    moveX();
    moveZ();

    old.x = x;
    old.z = z;
    if (dirX == 'stop') {
        if (++stopPointCounterX > stopPointCounterMaxX) {
            stopPointCounterX = 0;
            stopPointX = x;
        }
    }else {
        stopPointCounterX = 0;
    }
    if (dirZ == 'stop') {
        if (++stopPointCounterZ > stopPointCounterMaxZ) {
            stopPointCounterZ = 0;
            stopPointZ = z;
        }
    } else {
        stopPointCounterZ = 0;
    }



    // console.log( + ' ' + Math.round(Number(req.body.y) * 10000)+ ' ' + Math.round(Number(req.body.z) * 10000));
});

function moveX() {
    if (dirX == 'up') {
        robot.keyToggle('down', 'up');
        robot.keyToggle('up', 'down');
    } else if (dirX == 'down') {
        robot.keyToggle('up', 'up');
        robot.keyToggle('down', 'down');
    } else {
        robot.keyToggle('up', 'up');
        robot.keyToggle('down', 'up');
    }
}
function moveZ() {
    if (dirZ == 'left') {
        robot.keyToggle('right', 'up');
        robot.keyToggle('left', 'down');
    } else if (dirZ == 'right') {
        robot.keyToggle('left', 'up');
        robot.keyToggle('right', 'down');
    } else {
        robot.keyToggle('left', 'up');
        robot.keyToggle('right', 'up');
    }
}

function sendResponse(res) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.sendStatus(200)
}
module.exports = router;