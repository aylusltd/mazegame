import Model from 'Model';

var model = new Model();

export default function Controller(io){

    model.members = [];    

    io.on('connection', function(socket) {
        var id = members.length;
        members.push(socket);
        socket.game={
            history : [],
            state: {}
        }

        socket.on('enter', function(data){
            socket.game.name = data.userName;

        })

        socket.on('north', function(){
            var currentRoom = socket.game.state.currentRoom;
            var x = currentRoom.x;
            var y = currentRoom.y;

            if(currentRoom.exits.n) {
                socket.leave(currentRoom.roomId);
                if(model.maze[x][y+1]){

                } else {
                    model.generate({
                        x:x, 
                        y: y+1,
                        mustHaveExits : {
                            s:true
                        }
                    })
                }
                socket.join(currentRoom.roomId);
            } else {
                socket.send('error', 'Can\'t go north from here');
            }
        });

        socket.on('south', function(){

        });
        socket.on('east', function(){

        });
        socket.on('west', function(){

        });

        socket.on('message', function(envelope){
            if(envelope.address && envelope.address != 'GLOBAL') {
                if(envelope.address.room) {
                    io.to(envelope.address.room).emit('message', {
                        global: false,
                        message: envelope.message
                    });
                } else if(typeof envelope.address.person === 'number' && members[envelope.address.person]){
                    members[envelope.address.person].send('message', {
                        global: false,
                        message: envelope.message
                    })
                }
            } else {
                io.emit('message', {
                    global : true,
                    message: envelope.message
                });
            }
        });

        socket.on('disconnect', function(){
            delete model.members[id];
            model.members = model.members.filter(function(m){return !!m});
            io.emit('members', members);
        });
    });

    this.initialize = function initialize(){
        app.listen(80);
    }
}



