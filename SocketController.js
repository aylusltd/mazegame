var Model = require('./Model');
// var redis = require('redis').createClient();
// var mongoose = require('mongoose');
var webRTC = require('webrtc.io').listen(8001);

var model = new Model();

module.exports = function Controller(io, app){

    model.members = [];
    model.rooms = {};
    model.players = {};

    io.on('connection', function(socket) {
        var id = model.members.length;
        var exits = {
            n: {
                name : 'North'
            },
            e:{
                name: 'East'
            },
            w:{
                name: 'West'
            },
            s:{
                name: 'South'
            }
        }
        model.members.push(socket);
        socket.game={
            history : [],
            state: {}
        }

        socket.on('enter', function(data){
            console.log('enter received');
            var bounds,
                x,
                y;

            if(model.players[data.userName]) {
                console.log('Bad User Name')
                socket.emit('error', 'Username taken');
            } else {
                
                socket.game.name = data.userName;
                model.players[data.userName] = socket;

                bounds = model.getBounds();
                x = Math.floor(Math.random()*bounds.x);
                y = Math.floor(Math.random()*bounds.y);
                console.log('Accepting player '+ data.userName + ' into room at ' + x + ', ' + y);
                socket.game.state.currentRoom = model.getRoom({x:x, y: y}) || model.generate({x:x, y: y});
                socket.emit('renderRoom', socket.game.state.currentRoom);
                socket.emit('message', {global:false, system: true, message:'Welcome to the maze'});
            }
        });
    
        socket.on('move', function move(data){
            var currentRoom = socket.game.state.currentRoom;
            var x = currentRoom.x;
            var y = currentRoom.y;
            var direction = data.direction;
            var newX, newY;
            var opts = {};
            switch(direction) {
                case 'n':
                    newY = y+1;
                    newX = x;
                    break;
                case 'e':
                    newY = y;
                    newX = x+1;
                    break;
                case 'w':
                    newY = y;
                    newX = x-1;
                    break;
                case 's':
                    newY = y-1;
                    newX = x;
                    break;
                default:
                    socket.emit('userError', 'invalid direction');
            }
            if(currentRoom.exits[direction] && newX >=0 && newY>=0) {
                socket.leave(currentRoom.roomId);
                if(model.rooms[currentRoom.roomId]) {
                    model.rooms[currentRoom.roomId]--;
                    model.toDisk({x:x, y:y});
                }
                currentRoom = model.getRoom({x:newX, y: newY});
                if(!currentRoom) {
                    currentRoom = model.generate({x:newX, y: newY});
                }
               
                if(!socket.game.history[x])
                    socket.game.history[x] = [];
                socket.game.state.currentRoom = currentRoom;
                socket.game.history[x][y] = {
                    exits : currentRoom.exits,
                    visited : true
                };
                socket.join(currentRoom.roomId);
                model.rooms[currentRoom.roomId]++;
                socket.emit('renderRoom', currentRoom);
                socket.emit('displayMap', socket.game.history);
            } else {
                console.log('Attempted invalid move');
                console.log('Can\'t go ' + exits[direction].name + ' from here')
                console.log('x: ' + x + ', y: ' + y);
                console.log(currentRoom);
                socket.emit('userError', 'Can\'t go ' + exits[direction].name + ' from here');
            }

        });

        socket.on('message', function(envelope){
            console.log('message recvd')
            var outgoing = {
                message : envelope.message,
                sender : socket.game.name
            };
            
            if(envelope.address && envelope.address != 'GLOBAL') {
                if(envelope.address.room) {
                    io.to(envelope.address.room).emit('message', outgoing);
                } else if(typeof envelope.address.person === 'number' && members[envelope.address.person]){
                    members[envelope.address.person].send('message', outgoing)
                }
            } else {
                outgoing.global = true;
                io.emit('message', outgoing);
            }
        });

        socket.on('disconnect', function(){
            delete model.members[id];
            delete model.players[socket.game.name];
            model.members = model.members.filter(function(m){return !!m});
            io.emit('members', model.members);
        });

        socket.on('menu', function(data) {
            console.log(data);
        });
    });

    this.initialize = function initialize(server, port){
        // redis.on('ready', function(){
        //     console.log('redis connected');
        //     mongoose.connect('mongodb://localhost/b2');
        //     var db = mongoose.connection;
        //     db.on('open', function(){
        //         console.log('mongo connected');
        //         server.listen(port);
        //         model.generate({
        //             x:0,
        //             y:0
        //         });
        //         console.log('server running');
        //     });
        // });
        server.listen(port);
        console.log('server running');
    }
}



