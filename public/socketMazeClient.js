(function View(window){
    var socket = window.io('http://localhost:8080'),
        isErr = false,
        heading = 0,
        x = 11,
        MIN_X = 0,
        MAX_X = 21, 
        y = 11,
        MIN_Y = 0,
        MAX_Y = 21;


    document.getElementById('enterButton').addEventListener('click', function(){
        var name = document.getElementById('userName').value;
        var initialDialog = document.getElementById('enter');
        initialDialog.parentElement.removeChild(initialDialog);
        
        socket.emit('enter', {userName: name});
    });

    function createUI(){
        var room = document.getElementById('room');
        console.log(room);
        function turnLeft() {
            heading++;
            heading = heading % 360;
            transformRoom();
        }

        function turnRight() {
            heading--;
            while(heading < 0) {
                heading += 360;
            }
            transformRoom();
        }

        function moveForward() {
            var headingInRads = heading * Math.PI/180;
            x+= Math.sin(headingInRads);
            y+= Math.cos(headingInRads);
            bound();
            transformRoom();
        }

        function bound(){
            x = Math.max(MIN_X,x);
            x = Math.min(MAX_X,x);
            y = Math.max(MIN_Y,y);
            y = Math.min(MAX_Y,y);
        }

        function moveBackward() {
            var headingInRads = heading * Math.PI/180;
            x-= Math.sin(headingInRads);
            y-= Math.cos(headingInRads);
            bound();
            transformRoom();
        }

        document.querySelector('input').addEventListener('keydown', function(e){
            e.stopPropagation();
        });
        document.querySelector('button').addEventListener('keydown', function(e){
            e.stopPropagation();
        });
        document.addEventListener('keydown', function(e){
            switch(e.keyCode){
                case 37:
                    turnLeft();
                    break;
                case 38:
                    moveForward();
                    break;
                case 39:
                    turnRight();
                    break;
                case 40:
                    moveBackward();
                    break;
                default:
                    break;
            }
        });
    }
    createUI();
    function transformRoom(){
        console.log('heading: ' + heading + 'deg');
        console.log('position x: ' + x + 'y: ' + y);

        var northWall = document.querySelector('.north.wall');
        var eastWall = document.querySelector('.east.wall');
        var westWall = document.querySelector('.west.wall');
        var southWall = document.querySelector('.south.wall');
        var room = document.getElementById('room');

        if(heading >= 135 && heading <= 225){
            northWall.style.display='none'

        } else {
            northWall.style.display='block'
        }
        if(heading >= 225 && heading <= 315){
            eastWall.style.display='none'
        } else {
            eastWall.style.display='block'
        }
        if(heading >= 45 && heading <= 135){
            westWall.style.display='none'
        } else {
            westWall.style.display='block'
        }
        if(heading >= 315 || heading <= 45){
            southWall.style.display='none'
        } else {
            southWall.style.display='block'
        }

        room.style.transform = 'translateZ(-500px) rotateY(' + heading + 'deg) translateZ(' + (y/21 * 1000) + 'px) translateX(' + (x/21*1000) + 'px)'

    }

    socket.on('renderRoom', function renderRoom(currentRoom){
        console.log('render Room received');
        var room = document.getElementById('room'),
            northDoor,
            northWall = document.createElement('div'),
            eastDoor,
            eastWall = document.createElement('div'),
            westDoor,
            westWall = document.createElement('div'),
            southDoor,
            southWall = document.createElement('div'),
            floor = document.createElement('div'),
            ceiling = document.createElement('div');



        if(currentRoom.exits.n){
            northDoor = document.createElement('div');
            northDoor.classList.add('door');
            northDoor.classList.add('north');

            northDoor.addEventListener('click', function() {
                socket.emit('move', {direction: 'n'});
            });
            northWall.appendChild(northDoor);
        }

        if(currentRoom.exits.e){
            eastDoor = document.createElement('div');
            eastDoor.classList.add('door');
            eastDoor.classList.add('east');
            eastDoor.addEventListener('click', function() {
                socket.emit('move', {direction: 'e'});
            });
            eastWall.appendChild(eastDoor);
        }

        if(currentRoom.exits.w){
            westDoor = document.createElement('div');
            westDoor.classList.add('door');
            westDoor.classList.add('west');
            westDoor.addEventListener('click', function() {
                socket.emit('move', {direction: 'w'});
            });
            westWall.appendChild(westDoor);
        }

        if(currentRoom.exits.s){
            southDoor = document.createElement('div');
            southDoor.classList.add('door');
            southDoor.classList.add('south');
            southDoor.addEventListener('click', function() {
                socket.emit('move', {direction: 's'});
            });
            southWall.appendChild(southDoor);
        }
        console.log('render received');
        document.getElementById('modal-screen').style.display='none';

        floor.classList.add('floor');
        ceiling.classList.add('ceiling');
        northWall.classList.add('wall');
        eastWall.classList.add('wall');
        westWall.classList.add('wall');
        southWall.classList.add('wall');

        northWall.classList.add('north');
        eastWall.classList.add('east');
        westWall.classList.add('west');
        southWall.classList.add('south');


        room.innerHTML = '';
        room.appendChild(floor);
        room.appendChild(ceiling);
        room.appendChild(northWall);
        room.appendChild(eastWall);
        room.appendChild(westWall);
        room.appendChild(southWall);
        x=0;
        y=0;
        transformRoom();

    });

    socket.on('userError', function displayError(err){
        var bubble, 
            x;
        if(!isErr) {
            bubble = document.createElement('div');
            x = document.createElement('div');
            x.classList.add('error-close');
            bubble.innerText = err;
            bubble.appendChild(x);
            bubble.classList.add('error');

            bubble.setAttribute('id', 'error-message');
            x.addEventListener('click', function(){
                document.getElementById('modal-screen').style.display='none'
                bubble.parentElement.removeChild(bubble);
                isErr=false;
            });
            document.getElementById('modal-screen').appendChild(bubble);
            document.getElementById('modal-screen').style.display='block'
            isErr = true;
        } else {
            bubble = document.getElementById('error-message');
            bubble.innerText += '\n' + err;
        }
    });

    socket.on('displayMap', function displayMap(maze) {
        var map = document.getElementById('map');
        var width = maze.length;
        var height = maze.reduce(function(p,c,i){
            if(c.length>p){
                return c.length;
            } else {
                return p;
            }
        },0);

        var table = document.createElement('table');
        var tr, td, n, e, w, s;

        for(var y=0; y<height; y++) {
            tr = document.createElement('tr');
            for(var x=0; x<width; x++){
                td = document.createElement('td');
                if(maze[x][y]){
                    td.classList.add('room');
                    if(maze[x][y].visited){
                        td.classList.add('visited');
                    }
                    if(maze[x][y].exits.n) {
                        n = document.createElement('div');
                        td.appendChild(n);
                    }
                    if(maze[x][y].exits.e) {
                        e = document.createElement('div');
                        td.appendChild(e);
                    }
                    if(maze[x][y].exits.w) {
                        w = document.createElement('div');
                        td.appendChild(w);
                    }
                    if(maze[x][y].exits.s) {
                        s = document.createElement('div');
                        td.appendChild(s);
                    }
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        map.innerHTML='';
        map.appendChild(table);
    });
    socket.on('message', function(envelope){
        var chat = document.getElementById('chat-display');
        var msg = document.createElement('div');
        var sender = document.createElement('span');
        var time = document.createElement('span');
        var content = document.createElement('span');
        
        if(envelope.sender) {
            sender.innerText = envelope.sender;    
        } else if(envelope.system) {
            sender.innerText = 'System';
        } else {
            sender.innerText = 'Unknown';
        }
        sender.innerText += ': ';
        content.innerText = envelope.message || '';
        msg.appendChild(sender);
        msg.appendChild(content)
        chat.appendChild(msg);

    });
})(window);