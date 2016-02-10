var Controller = require('./SocketController');

var fs = require('fs');
var jade = require('jade');
var url = require('url');

function handler (req, res) {
    var path = url.parse(req.url).pathname;
    if(path === '/socketMazeClient.js') { 
        fs.readFile(__dirname + '/public/socketMazeClient.js',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading socketMazeClient.js');
            }

            res.writeHead(200);
            res.end(data);
        });
    } else if(path === '/maze.css') {
        fs.readFile(__dirname + '/public/maze.css',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading maze.css');
            }

            res.writeHead(200);
            res.end(data);
        });
    } else if(path !== '/socket.io/socket.io.js') { 
        fs.readFile(__dirname + '/public/view.jade',
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
    
}

var app = require('http').createServer(handler)
var io = require('socket.io')(app);

var controller = new Controller(io, app);

controller.initialize();



