/**
 * Created by r00fi0 on 12/30/16.
 */

var express = require('express');
var robot = require("robotjs");
// var locks = require('locks');

var router = express.Router();


var chart = [];
var G = [];
var A = [];
var B = [];
router.get('/', function (req, res) {
    res.sendfile('./public/orientation.html'); // load the single view file (angular will handle the page changes on the front-end)
});

router.get('/chart', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    // res.send(JSON.stringify({series:[chart]}));
    res.send(JSON.stringify({series: [A, B, G], direction: [dirX, dirZ, reverseX, reverseZ]}));
});

router.get('/clear', function (req, res) {
    chart = [];
    A = [];
    B = [];
    G = [];
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


var stopPointX = 0;
var stopPointZ = 0;

var accelerometer = {};
accelerometer.stop = {};
accelerometer.sensivity = {};
accelerometer.sensivity.x = 35000;
accelerometer.sensivity.y = 35000;
accelerometer.sensivity.z = 35000;
accelerometer.timeoutDone = true;
var reverseX = false;
var reverseZ = false;

var sensivity = {};
sensivity.stopPointX = 350;
sensivity.stopPointZ = 450;
var old = {};
var dirX = 'stop';
var dirZ = 'stop';

router.post('/accelerometer', function (req, res) {
    old.ax = Number(req.body.ax);
    old.ay = Number(req.body.ay);
    old.az = Number(req.body.az);

    // if (old.ax > accelerometer.stop.x + accelerometer.sensivity.x ||
    //     old.ax < accelerometer.stop.x - accelerometer.sensivity.x ||
    //     old.ay > accelerometer.stop.y + accelerometer.sensivity.y ||
    //     old.ay < accelerometer.stop.y - accelerometer.sensivity.y ||
    //     old.az > accelerometer.stop.z + accelerometer.sensivity.z ||
    //     old.az < accelerometer.stop.z - accelerometer.sensivity.z
    // ) {
    reverseZ = true;
    reverseX = true;
    if (accelerometer.timeoutDone) {
        accelerometer.timeoutDone = false;
        setTimeout(function () {
            accelerometer.timeoutDone = true;
        }, 300)
    }
     
    // }
    // G.push({x: Number(req.body.aT), y: Number(req.body.ax)});
    // B.push({x: Number(req.body.aT), y: Number(req.body.ay)});
    // A.push({x: Number(req.body.aT), y: Number(req.body.az)});
    sendResponse(res);
})

router.post('/', function (req, res) {
    sendResponse(res);

    var x = Number(req.body.x);
    var z = Number(req.body.z);

    if (z > stopPointZ + sensivity.stopPointZ) {
        if (reverseZ) {
            dirZ = 'right'
        } else {
            dirZ = 'left'
        }
    } else if (z < stopPointZ - sensivity.stopPointZ) {
        if (reverseZ) {
            dirZ = 'left'
        } else {
            dirZ = 'right'
        }
    } else {
        // if ((x - z < 300 && x - z > 0) || (z - x < 300 && z - x > 0)) {
        //     stopPointX = x;
        //     stopPointZ = z;
        // }
        dirZ = 'stop'
        if (accelerometer.timeoutDone) {
            reverseZ = false;    
        }
    }

    if (x > stopPointX + sensivity.stopPointX) {
        if (reverseX) {
            dirX = 'up'
        }else {
            dirX = 'down'
        }

    } else if (x < stopPointX - sensivity.stopPointX) {
        if (reverseX) {
            dirX = 'down'
        }else{
            dirX = 'up'
        }
    } else {
        // if ((x - z < 300 && x - z > 0) || (z - x < 300 && z - x > 0)) {
        //     stopPointX = x;
        //     stopPointZ = z;
        // }
        dirX = 'stop';
        if (accelerometer.timeoutDone) {
            reverseX = false;    
        }
    }
    moveX();
    moveZ();

    old.x = x;
    old.z = z;
    var t = new Date().getTime()
    // G.push({x: t, y: Number(req.body.x)});
    // B.push({x: t, y: Number(req.body.y)});
    // A.push({x: t, y: Number(req.body.z)});
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