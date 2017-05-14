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

var offset = 4000;
var accelerometer = {};
accelerometer.data = {};
accelerometer.stop = {
    x: 3970,
    y: 3970,
    z: 3970
};

var sensivity = {stop: {x: 180, z: 500}};

var old = {};
var dirX = 'stop';
var dirZ = 'stop';
var stop = false;

var stopPointCounterX = 0;
var stopPointCounterZ = 0;
var stopPointCounterMaxX = 100;
var stopPointCounterMaxZ = 100;


router.get('/', function (req, res) {
    res.sendFile('orientation.html', {root: './../public'});
});

router.get('/chart', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    // res.send(JSON.stringify({series:[chart]}));
    res.send(JSON.stringify({
        series: [mx, my, mz, ax, ay, az, gx, gy, gz],
        direction: [dirX, dirZ, accelerometer.stop.x, accelerometer.stop.z]
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
    accelerometer.stop.x = old.x;
    accelerometer.stop.y = old.y;
    accelerometer.stop.z = old.z;
    sendResponse(res);
});

router.post('/', function (req, res) {

    accelerometer.data.x = Number(req.body.ax) + offset;
    accelerometer.data.y = Number(req.body.ay) + offset;
    accelerometer.data.z = Number(req.body.az) + offset;

    // var t = new Date().getTime();
    // ax.push({x: t, y: accelerometer.data.x});
    // ay.push({x: t, y: accelerometer.data.y});
    // az.push({x: t, y: accelerometer.data.z});

    if (accelerometer.data.z > accelerometer.stop.z + sensivity.stop.z) {
        dirZ = 'right'
    } else if (accelerometer.data.z < accelerometer.stop.z - sensivity.stop.z) {
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
    moveX();
    moveZ();

    old.x = accelerometer.data.x;
    old.y = accelerometer.data.y;
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
            accelerometer.stop.z = accelerometer.data.z;
        }
    } else {
        stopPointCounterZ = 0;
    }
    // console.log( + ' ' + Math.round(Number(req.body.y) * 10000)+ ' ' + Math.round(Number(req.body.z) * 10000));
    sendResponse(res);

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