import Controller from 'SocketController';
var fs = require('fs');
var jade = require('jade');
var url = require('url');

function handler (req, res) {
    fs.readFile(__dirname + '/view.jade',
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading view.jade');
        }

        res.writeHead(200);
        var fn = jade.compile(data);
        var html = fn();
        res.end(html);
    });
}

var app = require('http').createServer(handler)
var io = require('socket.io')(app);

var controller = new Controller(io);

controller.initialize();



