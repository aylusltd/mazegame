/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var video = __webpack_require__(1);
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
	        chair.setAttribute('data-chair', 1);
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
	        chair2.setAttribute('data-chair', 2);
	        chair2.id = "chair2";
	        room.appendChild(chair2);
	        x=11;
	        y=11;
	        transformRoom();
	        chair.addEventListener('click', video);
	        chair2.addEventListener('click', video);

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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = function videoHandler(ev){
		var rtc = __webpack_require__(2);
		
		var t = ev.target;
		var socket = window.io('https://localhost:443');

		while(t !== document.body && !~Array.prototype.slice.call(t.classList).indexOf('chair')) {
			t=t.parentNode;
		}

		function handleVideo(stream){
			var selfie = t.querySelector('video');
			selfie.setAttribute('muted', true);
			selfie.src = window.URL.createObjectURL(stream);
			rtc.createStream({"video": true, "audio":false}, function(stream){
			    // get local stream for manipulation
			    // rtc.attachStream(stream, 'local');
			});
			rtc.connect('wss://localhost:8001');
			socket.emit('video', {chair: t.getAttribute('data-chair')});
		}

		function videoError(error){
			console.log(error);
		}

		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
		if (navigator.getUserMedia) {       
	        navigator.getUserMedia({video: true, audio:true}, handleVideo, videoError);
	    }
	    socket.on('video', function(message){
	    	rtc.on('add remote stream', function(stream){
				// show the remote video
				document.querySelector('[data-chair='+message.chair+'] video').src=URL.createObjectURL(stream);
	  		});
	    });
		
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	//CLIENT
	// Fallbacks for vendor-specific variables until the spec is finalized.
	var PeerConnection = window.PeerConnection || window.webkitPeerConnection00;
	var URL = window.URL || window.webkitURL || window.msURL || window.oURL;
	var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	(function() {

	  var rtc;
	  if (false) {
	    rtc = this.rtc = {};
	  } else {
	    rtc = module.exports = {};
	  }


	  // Holds a connection to the server.
	  rtc._socket = null;

	  // Holds callbacks for certain events.
	  rtc._events = {};

	  rtc.on = function(eventName, callback) {
	    rtc._events[eventName] = rtc._events[eventName] || [];
	    rtc._events[eventName].push(callback);
	  };

	  rtc.fire = function(eventName, _) {
	    var events = rtc._events[eventName];
	    var args = Array.prototype.slice.call(arguments, 1);

	    if (!events) {
	      return;
	    }

	    for (var i = 0, len = events.length; i < len; i++) {
	      events[i].apply(null, args);
	    }
	  };

	  // Holds the STUN server to use for PeerConnections.
	  rtc.SERVER = "STUN stun.l.google.com:19302";

	  // Referenc e to the lone PeerConnection instance.
	  rtc.peerConnections = {};

	  // Array of known peer socket ids
	  rtc.connections = [];
	  // Stream-related variables.
	  rtc.streams = [];
	  rtc.numStreams = 0;
	  rtc.initializedStreams = 0;

	  /**
	   * Connects to the websocket server.
	   */
	  rtc.connect = function(server, room) {
	    room = room || ""; // by default, join a room called the blank string
	    rtc._socket = new WebSocket(server);

	    rtc._socket.onopen = function() {

	      rtc._socket.send(JSON.stringify({
	        "eventName": "join_room",
	        "data": {
	          "room": room
	        }
	      }), function(error) {
	        if (error) {
	          console.log(error);
	        }
	      });

	      rtc._socket.onmessage = function(msg) {
	        var json = JSON.parse(msg.data);
	        rtc.fire(json.eventName, json.data);
	      };

	      rtc._socket.onerror = function(err) {
	        console.log('onerror');
	        console.log(err);
	      };

	      rtc._socket.onclose = function(data) {
	        rtc.fire('disconnect stream', rtc._socket.id);
	        delete rtc.peerConnections[rtc._socket.id];
	      };

	      rtc.on('get_peers', function(data) {
	        rtc.connections = data.connections;
	        // fire connections event and pass peers
	        rtc.fire('connections', rtc.connections);
	      });

	      rtc.on('receive_ice_candidate', function(data) {
	        var candidate = new IceCandidate(data.label, data.candidate);
	        rtc.peerConnections[data.socketId].processIceMessage(candidate);

	        rtc.fire('receive ice candidate', candidate);
	      });

	      rtc.on('new_peer_connected', function(data) {
	        rtc.connections.push(data.socketId);

	        var pc = rtc.createPeerConnection(data.socketId);
	        for (var i = 0; i < rtc.streams.length; i++) {
	          var stream = rtc.streams[i];
	          pc.addStream(stream);
	        }
	      });

	      rtc.on('remove_peer_connected', function(data) {
	        rtc.fire('disconnect stream', data.socketId);
	        delete rtc.peerConnections[data.socketId];
	      });

	      rtc.on('receive_offer', function(data) {
	        rtc.receiveOffer(data.socketId, data.sdp);
	        rtc.fire('receive offer', data);
	      });

	      rtc.on('receive_answer', function(data) {
	        rtc.receiveAnswer(data.socketId, data.sdp);
	        rtc.fire('receive answer', data);
	      });

	      rtc.fire('connect');
	    };
	  };


	  rtc.sendOffers = function() {
	    for (var i = 0, len = rtc.connections.length; i < len; i++) {
	      var socketId = rtc.connections[i];
	      rtc.sendOffer(socketId);
	    }
	  }

	  rtc.onClose = function(data) {
	    rtc.on('close_stream', function() {
	      rtc.fire('close_stream', data);
	    });
	  }

	  rtc.createPeerConnections = function() {
	    for (var i = 0; i < rtc.connections.length; i++) {
	      rtc.createPeerConnection(rtc.connections[i]);
	    }
	  };

	  rtc.createPeerConnection = function(id) {
	    console.log('createPeerConnection');
	    var pc = rtc.peerConnections[id] = new PeerConnection(rtc.SERVER, function(candidate, moreToFollow) {
	      if (candidate) {
	        rtc._socket.send(JSON.stringify({
	          "eventName": "send_ice_candidate",
	          "data": {
	            "label": candidate.label,
	            "candidate": candidate.toSdp(),
	            "socketId": id
	          }
	        }), function(error) {
	          if (error) {
	            console.log(error);
	          }
	        });
	      }
	      rtc.fire('ice candidate', candidate, moreToFollow);
	    });

	    pc.onopen = function() {
	      // TODO: Finalize this API
	      rtc.fire('peer connection opened');
	    };

	    pc.onaddstream = function(event) {
	      // TODO: Finalize this API
	      rtc.fire('add remote stream', event.stream, id);
	    };
	    return pc;
	  };

	  rtc.sendOffer = function(socketId) {
	    var pc = rtc.peerConnections[socketId];
	    // TODO: Abstract away video: true, audio: true for offers
	    var offer = pc.createOffer({
	      video: true,
	      audio: true
	    });
	    pc.setLocalDescription(pc.SDP_OFFER, offer);
	    rtc._socket.send(JSON.stringify({
	      "eventName": "send_offer",
	      "data": {
	        "socketId": socketId,
	        "sdp": offer.toSdp()
	      }
	    }), function(error) {
	      if (error) {
	        console.log(error);
	      }
	    });
	    pc.startIce();
	  };


	  rtc.receiveOffer = function(socketId, sdp) {
	    var pc = rtc.peerConnections[socketId];
	    pc.setRemoteDescription(pc.SDP_OFFER, new SessionDescription(sdp));
	    rtc.sendAnswer(socketId);
	  };


	  rtc.sendAnswer = function(socketId) {
	    var pc = rtc.peerConnections[socketId];
	    var offer = pc.remoteDescription;
	    // TODO: Abstract away video: true, audio: true for answers
	    var answer = pc.createAnswer(offer.toSdp(), {
	      video: true,
	      audio: true
	    });
	    pc.setLocalDescription(pc.SDP_ANSWER, answer);
	    rtc._socket.send(JSON.stringify({
	      "eventName": "send_answer",
	      "data": {
	        "socketId": socketId,
	        "sdp": answer.toSdp()
	      }
	    }), function(error) {
	      if (error) {
	        console.log(error);
	      }
	    });
	    pc.startIce();
	  };


	  rtc.receiveAnswer = function(socketId, sdp) {
	    var pc = rtc.peerConnections[socketId];
	    pc.setRemoteDescription(pc.SDP_ANSWER, new SessionDescription(sdp));
	  };


	  rtc.createStream = function(opt, onSuccess, onFail) {

	    onSuccess = onSuccess ||
	    function() {};
	    onFail = onFail ||
	    function() {};

	    var options = {
	        video: opt.video || false,
	        audio: opt.audio || false
	    };

	    if (getUserMedia) {
	      rtc.numStreams++;
	      getUserMedia.call(navigator, options, function(stream) {
	        rtc.streams.push(stream);
	        rtc.initializedStreams++;
	        onSuccess(stream);
	        if (rtc.initializedStreams === rtc.numStreams) {
	          rtc.fire('ready');
	        }
	      }, function() {
	        alert("Could not connect stream.");
	        onFail();
	      });
	    } else {
	      alert('webRTC is not yet supported in this browser.');

	    }
	  }


	    rtc.addStreams = function() {
	      for (var i = 0; i < rtc.streams.length; i++) {
	        var stream = rtc.streams[i];
	        for (var connection in rtc.peerConnections) {
	          rtc.peerConnections[connection].addStream(stream);
	        }
	      }
	    };


	    rtc.attachStream = function(stream, domId) {
	      document.getElementById(domId).src = URL.createObjectURL(stream);
	    };

	    rtc.on('ready', function() {
	      rtc.createPeerConnections();
	      rtc.addStreams();
	      rtc.sendOffers();
	    });

	  }).call(this);

/***/ }
/******/ ]);