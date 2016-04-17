var video = require('./video');
(function View(window){
    document.querySelector('#roomContainer').style.left = ((window.innerHeight - 1800) / 2) + 'px';
    var socket = window.io('https://localhost:443'),
        isErr = false,
        heading = 0,
        x = 11,
        MIN_X = 3,
        MAX_X = 18, 
        y = 11,
        MIN_Y = 3,
        MAX_Y = 18;

    

    
    (function createUI(){
        var room = document.getElementById('room');
        function submitUser(){
            var name = document.getElementById('userName').value;
            var initialDialog = document.getElementById('enter');
            initialDialog.parentElement.removeChild(initialDialog);
            
            socket.emit('enter', {userName: name});
        }
        
        function sendMessage(){
            var input = document.querySelector('#chat input');
            var message = input.value;
            
            socket.emit('message', {message: message});
            input.value='';
        }

        function turnRight() {
            heading+=2;
            heading = heading % 360;
            transformRoom();
        }

        function turnLeft() {
            heading-=2;
            while(heading < 0) {
                heading += 360;
            }
            transformRoom();
        }

        function moveForward() {
            var headingInRads = heading * Math.PI/180;
            x-= Math.sin(headingInRads);
            y+= Math.cos(headingInRads);
            bound();
            transformRoom();
        }

        function bound(){
            x = Math.max(MIN_X,x);
            x = Math.min(MAX_X,x);
            console.log('x bound to ' + x);
            y = Math.max(MIN_Y,y);
            y = Math.min(MAX_Y,y);
            console.log('y bound to ' + y);

        }

        function moveBackward() {
            var headingInRads = heading * Math.PI/180;
            x+= Math.sin(headingInRads);
            y-= Math.cos(headingInRads);
            bound();
            transformRoom();
        }

        Array.prototype.slice.call(document.querySelectorAll('input')).forEach(function(el){
            el.addEventListener('keydown', function(e){
            if(e.keyCode == 13) {
                if(e.target == document.querySelector('#enter input') ) {
                    submitUser();
                } else if(e.target == document.querySelector('#chat input')){
                    sendMessage();
                }
            }
            e.stopPropagation();
        })});

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
        document.getElementById('send').addEventListener('click', sendMessage);
        document.getElementById('enterButton').addEventListener('click', submitUser);
    })();

    function transformRoom(){
        console.log('heading: ' + heading + 'deg');
        console.log('position x: ' + x + 'y: ' + y);

        var GAP = 120;

        var northWall = document.querySelector('.north.wall');
        var eastWall = document.querySelector('.east.wall');
        var westWall = document.querySelector('.west.wall');
        var southWall = document.querySelector('.south.wall');
        var room = document.getElementById('room');

        if(heading >= 180 - (GAP/2) && heading <= 180 + (GAP/2)){
            northWall.style.display='none'

        } else {
            northWall.style.display='block'
        }
        if(heading >= 270 - (GAP/2) && heading <= 270 + (GAP/2)){
            eastWall.style.display='none'
        } else {
            eastWall.style.display='block'
        }
        if(heading >= 90 - (GAP/2) && heading <= 90 + (GAP/2)){
            westWall.style.display='none'
        } else {
            westWall.style.display='block'
        }
        if(heading >= 360 - (GAP/2) || heading <= (GAP/2)){
            southWall.style.display='none'
        } else {
            southWall.style.display='block'
        }

        room.style.transformOrigin = '50% 50% 900px';
        room.style.transform = 'translateZ(-900px) rotateY(' + heading + 'deg)';
        // room.style.transform = 'rotateY(' + heading + 'deg)';
        room.style.transform += 'translateZ(' + ((y)/21 * 1800) + 'px) translateX(' + ((x-11)/21*1800) + 'px)';
        // room.style.transform = 'translateZ(-500px) rotateY(' + heading + 'deg)';
        

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
            screen = document.createElement('div'),
            chair = document.createElement('div'),
            chairback = document.createElement('div'),
            chairseat = document.createElement('div'),
            chairscreen = document.createElement('video'),
            ceiling = document.createElement('div');
            
            currentRoom.exits.n = true;

        if(currentRoom.exits.n){
            northDoor = document.createElement('div');
            northDoor.classList.add('door');
            northDoor.classList.add('north');

            northDoor.addEventListener('click', function() {
                // socket.emit('move', {direction: 'n'});
                socket.emit('menu', { hello: 'world' });
                alert("welcome to space");
            });
            northWall.appendChild(northDoor);
        }

        console.log('render received');
        document.getElementById('modal-screen').style.display='none';

        floor.classList.add('floor');
        screen.classList.add('screen');
        ceiling.classList.add('ceiling');
        northWall.classList.add('wall');
        eastWall.classList.add('wall');
        westWall.classList.add('wall');
        southWall.classList.add('wall');

        northWall.classList.add('north');
        eastWall.classList.add('east');
        westWall.classList.add('west');
        southWall.classList.add('south');

        chair.classList.add('chair');
        chairback.classList.add('chairback');
        chairseat.classList.add('chairseat');
        chairscreen.classList.add('chairscreen');
        chairscreen.setAttribute('autoplay', true);

        // chair.style.boxShadow = generateBoxShadow(100, '1px', 'black');
        // chairback.style.boxShadow = generateBoxShadow(100, '1px', 'black');
        
        screen.innerHTML = '<iframe width="300" height="195" src="https://www.youtube.com/embed/Wji-BZ0oCwg" frameborder="0" allowfullscreen></iframe>';
        // screen.innerHTML = '<iframe width="400" height="260" src="https://trello.com/b/lBFwwkiJ.html" frameborder="0" allowfullscreen></iframe>';



        room.innerHTML = '';
        room.appendChild(floor);
        room.appendChild(screen);
        room.appendChild(ceiling);
        room.appendChild(northWall);
        room.appendChild(eastWall);
        room.appendChild(westWall);
        room.appendChild(southWall);
        room.appendChild(chair);
        chair.appendChild(chairback);
        chair.appendChild(chairseat);
        chairback.appendChild(chairscreen);
        chair.id = "chair1";

        var screen2 = screen.cloneNode(true);
        screen2.classList.add('screen2');
        room.appendChild(screen2);
        
        chair2 = chair.cloneNode(true);
        chair2.classList.add('chair2');
        chair2.id = "chair2";
        room.appendChild(chair2);
        x=11;
        y=11;
        transformRoom();
        chair.addEventListener('click', video);

    });

    
    socket.on('message', function(envelope){
        console.log('message recvd');
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

    // IDEA FOUND HERE: 
    // http://jsfiddle.net/gion_13/nDCme/
    function generateBoxShadow(steps, width, color) {
        var r = '';
        
        for(var i=0;i<=steps;i++) {
            if(i !== 0) {
                r += ', ';
            }
            r += i + 'px ' + i + 'px ' + width + ' ' + color;
        }
        return r;
    }

})(window);