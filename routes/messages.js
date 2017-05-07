/**
 * Created by r00fi0 on 12/19/16.
 */

var express = require('express');
var robot = require("robotjs");
// var locks = require('locks');

var router = express.Router();

var startCoordinate = {x: 0, y: 0};
var chart = [];
var G = [];
var A = [];
var B = [];
router.get('/', function (req, res) {
    res.sendFile(__dirname + '/achart.html'); // load the single view file (angular will handle the page changes on the front-end)
});

router.get('/chart', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    // res.send(JSON.stringify({series:[chart]}));
    res.send(JSON.stringify({series: [A, B, G]}));
});

router.get('/clear', function (req, res) {
    chart = [];
    A = [];
    B = [];
    G = [];
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

var oldDirectionZ = 'stop';
var oldDirectionX = 'stop';
function stepFrontOrBack(req) {
    console.log(req.body.DZ);

    if (req.body.DZ != oldDirectionZ) {

        if (left) {
            if (req.body.DZ == 'up') {
                robot.keyToggle('up', 'up');
                robot.keyToggle('down', 'down');
            } else if (req.body.DZ == 'down') {
                robot.keyToggle('down', 'up');
                robot.keyToggle('up', 'down');
            } else if (req.body.DZ == 'stop') {
                robot.keyToggle('down', 'up');
                robot.keyToggle('up', 'up');
                stop=true;
            }
        }else{
            if (req.body.DZ == 'down') {
                robot.keyToggle('up', 'up');
                robot.keyToggle('down', 'down');
            } else if (req.body.DZ == 'up') {
                robot.keyToggle('down', 'up');
                robot.keyToggle('up', 'down');
            } else if (req.body.DZ == 'stop') {
                robot.keyToggle('down', 'up');
                robot.keyToggle('up', 'up');
                stop=true;
            }
        }

    }
    oldDirectionZ = req.body.DZ;
}

function stepRight(req) {
    robot.keyToggle('left', 'up');
    robot.keyToggle('right', 'down');
}
function stepLeft(req) {
    robot.keyToggle('right', 'up');
    robot.keyToggle('left', 'down');
}
function stepStop() {
    robot.keyToggle('right', 'up');
    robot.keyToggle('left', 'up');
    stop=true;
}

router.post('/', function (req, res) {
    // req.body.G = req.body.G.substring(0,6)
    // req.body.A = req.body.B.substring(0,6)
    // req.body.B = req.body.A.substring(0,6)
    //G -frontback
    // if (stop) {
    //     return sendResponse(res);
    // }

    // A.push({x: req.body.T, y: Number(req.body.x)});
    // G.push({x: req.body.T, y: Number(req.body.y)});
    // B.push({x: req.body.T, y: Number(req.body.z)});
    var t = new Date().getTime()
    // A.push({x: t, y: Number(req.body.x)});
    // G.push({x: t, y: Number(req.body.y)});
    // B.push({x: t, y: Number(req.body.z)});

    console.log(req.body)
    // stepFrontOrBack(req);
    sendResponse(res);
});
var left = false; // if left leg is detected move - inverse right leg
var stop = true;
var timeoutFinished = true;
router.post('/left', function (req, res) {
    A.push({x: req.body.T, y: Number(req.body.x)});

    if (timeoutFinished) {
        // console.log(req.body)
        timeoutFinished = false;
        left = true;
        setTimeout(function () {
            timeoutFinished = true;
            left = false;
        }, 607)
    }
    sendResponse(res);
});
router.post('/right', function (req, res) {

    if (req.body.DX == 'stop') {
        stepStop();
        console.log('stop');
    }else if (left) {
        console.log('left');
        stepLeft(req)
    } else {
        console.log('right');
        stepRight(req);
    }

    sendResponse(res);
});

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