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

var D = [];
var E = [];
var F = [];
router.get('/', function (req, res) {
    res.sendfile('./public/orientation.html'); // load the single view file (angular will handle the page changes on the front-end)
});

router.get('/chart', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    // res.send(JSON.stringify({series:[chart]}));
    res.send(JSON.stringify({
        series: [A, B, G, D, E, F],
        direction: [dirX, dirZ, reverseX, reverseZ, stopPointX, stopPointZ, dif,accelerometer.stop.y]
    }));
});

router.get('/clear', function (req, res) {
    chart = [];
    A = [];
    B = [];
    G = [];
    D = [];
    E = [];
    F = [];
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
accelerometer.sensivity.y = 90;
accelerometer.sensivity.z = 35000;
accelerometer.timeoutDone = true;
accelerometer.jumpTimeoutDone = true;
accelerometer.stop.y = 900;

var reverseX = false;
var reverseZ = false;

var sensivity = {};
sensivity.stopPointX = 700;
sensivity.stopPointZ = 600;
var old = {};
var dirX = 'stop';
var dirZ = 'stop';


router.post('/accelerometer', function (req, res) {
    old.ax = Number(req.body.ax);
    old.ay = Number(req.body.ay);
    old.az = Number(req.body.az);
    // if (!accelerometer.jumpTimeoutDone) {
    //     if (accelerometer.side && req.body.side != accelerometer.side) {
    //         // robot.keyToggle('space', 'down');
    //         dirX = 'jump'
    //         dirZ = 'jump'
    //     }
    // }
    // if (accelerometer.jumpTimeoutDone) {
    //     accelerometer.jumpTimeoutDone = false;
    //     setTimeout(function () {
    //         accelerometer.jumpTimeoutDone = true;
    //         accelerometer.side = undefined;
    //     }, 300)
    // }

    if (req.body.side == 'left') {
        // accelerometer.side = 'left';

        reverseZ = true;
        reverseX = true;
        if (accelerometer.timeoutDone) {
            accelerometer.timeoutDone = false;
            setTimeout(function () {
                accelerometer.timeoutDone = true;
            }, 100)
        }
    }
    // }
    // G.push({x: Number(req.body.aT), y: Number(req.body.ax)});
    // B.push({x: Number(req.body.aT), y: Number(req.body.ay)});
    // A.push({x: Number(req.body.aT), y: Number(req.body.az)});
    sendResponse(res);
})
var dif = 0;
var cntr = 0;
router.post('/', function (req, res) {
    sendResponse(res);

    var x = Number(req.body.mx);
    var z = Number(req.body.mz);
    var accY = Number(req.body.y);
    dif = Number((Number(req.body.z) + 1000) - (Number(req.body.x) + 1000));

    if (dif > 0 && dif < 120) {
        if (++cntr > 17) {
            cntr = 0;
            stopPointZ = z;
            stopPointX = x;
            accelerometer.stop.y = accY;


        }
    }

    if (accY > accelerometer.stop.y + accelerometer.sensivity.y ||
        accY < accelerometer.stop.y - accelerometer.sensivity.y) {
        reverseZ = true;
        reverseX = true;
        if (accelerometer.timeoutDone) {
            accelerometer.timeoutDone = false;
            setTimeout(function () {
                accelerometer.timeoutDone = true;
            }, 500)
        }
    }

    if (z > stopPointZ + sensivity.stopPointZ) {
        if (reverseZ) {
            dirZ = 'left'
        } else {
            dirZ = 'right'
        }
    } else if (z < stopPointZ - sensivity.stopPointZ) {
        if (reverseZ) {
            dirZ = 'right'
        } else {
            dirZ = 'left'
        }
    } else {
        dirZ = 'stop'
        if (accelerometer.timeoutDone) {
            reverseZ = false;
        }
    }

    if (x > stopPointX + sensivity.stopPointX) {
        if (reverseX) {
            dirX = 'down'
        } else {
            dirX = 'up'
        }
    } else if (x < stopPointX - sensivity.stopPointX) {
        if (reverseX) {
            dirX = 'up'
        } else {
            dirX = 'down'
        }
    } else {
        dirX = 'stop';
        if (accelerometer.timeoutDone) {
            reverseX = false;
        }
    }
    // moveX();
    // moveZ();
//x-kor
    //z-blue
    old.x = x;
    old.z = z;
    var t = new Date().getTime()
    G.push({x: t, y: Number(req.body.mx)});
    A.push({x: t, y: Number(req.body.mz)});
    B.push({x: t, y: Number(req.body.my)});
    D.push({x: t, y: Number(req.body.x)});
    E.push({x: t, y: Number(req.body.z)});
    F.push({x: t, y: Number(req.body.y)});

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