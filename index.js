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

var httpServer = require('http').createServer(app);
var httpsServer = https.createServer(credentials, app);
var io = require('socket.io')(httpServer);

var controller = new Controller(io, app);

controller.initialize(httpServer, process.env.PORT || 5000);


