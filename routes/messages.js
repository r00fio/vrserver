/**
 * Created by r00fi0 on 12/19/16.
 */

var express = require('express');
var robot = require("robotjs");

var router = express.Router();

var startCoordinate = {x:0, y:0};

router.post('/touches', function (req, res) {
    var newCoord = {};
    newCoord.x = Number(req.body.x);
    newCoord.y = Number(req.body.y);
    var step = 4;
    if (newCoord.y > startCoordinate.y + step) {
        //move back
        robot.keyToggle('down', 'up');
        robot.keyToggle('up', 'down');
        startCoordinate.y = newCoord.y;
    } else if (newCoord.y < startCoordinate.y - step) {
        //move forward
        robot.keyToggle('up', 'up');
        robot.keyToggle('down', 'down');
        startCoordinate.y = newCoord.y;
    }

    //x handle
    if (newCoord.x > startCoordinate.x + step) {
        //move back
        robot.keyToggle('right', 'up');
        robot.keyToggle('left', 'down');
        startCoordinate.x = newCoord.x;
    } else if (newCoord.x < startCoordinate.x - step) {
        //move forward
        robot.keyToggle('left', 'up');
        robot.keyToggle('right', 'down');
        startCoordinate.x = newCoord.x;
    }
    setCORS(res);
    res.sendStatus(200)
});
router.post('/mouseclick', function (req, res) {
    if (req.body.button=='left') {
        robot.mouseClick(req.body.button, false);
    }
    if (req.body.button=='right') {
        robot.keyTap('space');      
    }
    setCORS(res);
    res.sendStatus(200)
});
router.post('/touchstart', function (req, res) {
    console.log(req.body);
    console.log("touchStart");
    robot.keyToggle('down', 'up');
    robot.keyToggle('up', 'up');
    robot.keyToggle('left', 'up');
    robot.keyToggle('right', 'up');
    startCoordinate.x = Number(req.body.x);
    startCoordinate.y = Number(req.body.y);
    setCORS(res);
    res.sendStatus(200)
});

router.post('/touchend', function (req, res) {
    console.log(req.body);
    console.log("touchEnd");
    startCoordinate.x = Number(req.body.x);
    startCoordinate.y = Number(req.body.y);
    robot.keyToggle('down', 'up');
    robot.keyToggle('up', 'up');
    robot.keyToggle('left', 'up');
    robot.keyToggle('right', 'up');

    
    setCORS(res);
    res.sendStatus(200)
});

function setCORS(res) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

}
module.exports = router;