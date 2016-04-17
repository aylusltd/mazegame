
module.exports = function videoHandler(ev){
	var rtc = require('./webrtc.client');
	
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