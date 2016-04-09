var Controller = require('./SocketController');

var fs = require('fs');
var jade = require('jade');
var url = require('url');

var https = require('https');
var express = require('express');
var app = express();
var credentials = {
    key: fs.readFileSync('sslcert/server.key'),
    cert: fs.readFileSync('sslcert/server.crt')
};

app.use(express.static('dist'));

// function handler (req, res) {
//     var path = url.parse(req.url).pathname;
//     if(path === '/socketMazeClient.js') { 
//         fs.readFile(__dirname + '/public/socketMazeClient.js',
//         function (err, data) {
//             if (err) {
//                 res.writeHead(500);
//                 return res.end('Error loading socketMazeClient.js');
//             }

//             res.writeHead(200);
//             res.end(data);
//         });
//     } else if(path === '/maze.css') {
//         fs.readFile(__dirname + '/public/maze.css',
//         function (err, data) {
//             if (err) {
//                 res.writeHead(500);
//                 return res.end('Error loading maze.css');
//             }

//             res.writeHead(200);
//             res.end(data);
//         });
//     } else if(path !== '/socket.io/socket.io.js') { 
//         fs.readFile(__dirname + '/public/view.jade',
//         function (err, data) {
//             if (err) {
//                 res.writeHead(500);
//                 return res.end('Error loading view.jade');
//             }

//             res.writeHead(200);
//             var fn = jade.compile(data);
//             var html = fn();
//             res.end(html);
//         });
//     } 
    
// }

// var app = require('http').createServer(handler)
var httpsServer = https.createServer(credentials, app);
var io = require('socket.io')(httpsServer);

var controller = new Controller(io, app);

controller.initialize(httpsServer, 443);


