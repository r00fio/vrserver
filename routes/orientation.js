/**
 * Created by r00fi0 on 12/30/16.
 */

var express = require('express');
var robot = require("robotjs");
var router = express.Router();

var chart = [];
var mx = [];
var my = [];
var mz = [];
var ax = [];
var ay = [];
var az = [];
var gx = [];
var gy = [];
var gz = [];
var reverseX = false;
var reverseZ = false;


var accelerometer = {};
accelerometer.data = {};
accelerometer.stop = {
    x: 900,
    y: 900,
    z: 900
};
accelerometer.sensivity = {
    x: 40000, y: 40000, z: 40000
};

var sensivity = {stop: {x: 600, z: 900}};

var old = {};
var dirX = 'stop';
var dirZ = 'stop';
var stop = false;

var stopPointCounterX = 0;
var stopPointCounterZ = 0;
var stopPointCounterMaxX = 20;
var stopPointCounterMaxZ = 45;


router.get('/', function (req, res) {
    res.sendFile('orientation.html', {root: './../public'});
});

router.get('/chart', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    // res.send(JSON.stringify({series:[chart]}));
    res.send(JSON.stringify({
        series: [mx, my, mz, ax, ay, az, gx, gy, gz],
        direction: [dirX, dirZ, reverseX, reverseZ, stopPointX, stopPointZ, accelerometer.stop.y]
    }));
});

router.get('/clear', function (req, res) {
    chart = [];
    mx = [];
    my = [];
    mz = [];
    ax = [];
    ay = [];
    az = [];
    gx = [];
    gy = [];
    gz = [];
    reverseX = false;
    reverseZ = false;
    sendResponse(res);
});

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
    accelerometer.stop.x = old.ax;
    accelerometer.stop.y = old.ay;
    accelerometer.stop.z = old.az;
    sendResponse(res);
});

router.post('/', function (req, res) {
    sendResponse(res);

    var t = new Date().getTime();

    accelerometer.data.x = Number(req.body.ax);
    accelerometer.data.y = Number(req.body.ay);
    accelerometer.data.z = Number(req.body.az);

    ax.push({x: t, y: accelerometer.data.x * 100});
    ay.push({x: t, y: accelerometer.data.y * 100});
    az.push({x: t, y: accelerometer.data.z * 100});

    if (accelerometer.data.z > stopPointZ + sensivity.stop.z) {
        dirZ = 'right'
    } else if (accelerometer.data.z < stopPointZ - sensivity.stop.z) {
        dirZ = 'left'
    } else {
        dirZ = 'stop';
    }

    if (accelerometer.data.x > accelerometer.stop.x + sensivity.stop.x) {
        dirX = 'up'
    } else if (accelerometer.data.x < accelerometer.stop.x - sensivity.stop.x) {
        dirX = 'down'
    } else {
        dirX = 'stop';
    }
    // moveX();
    // moveZ();

    old.x = accelerometer.data.x;
    old.z = accelerometer.data.z;

    if (dirX === 'stop') {
        if (++stopPointCounterX > stopPointCounterMaxX) {
            stopPointCounterX = 0;
            accelerometer.stop.x = accelerometer.data.x;
        }
    } else {
        stopPointCounterX = 0;
    }
    if (dirZ === 'stop') {
        if (++stopPointCounterZ > stopPointCounterMaxZ) {
            stopPointCounterZ = 0;
            accelerometer.stop.z = accelerometer.data.z
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