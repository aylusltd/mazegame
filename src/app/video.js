module.exports = function videoHandler(ev){
	var t = ev.target;
	while(t !== document.body && !~Array.prototype.slice.call(t.classList).indexOf('chair')) {
		t=t.parentNode;
	}

	function handleVideo(stream){
		var selfie = t.querySelector('video');
		selfie.setAttribute('muted', true);
		selfie.src = window.URL.createObjectURL(stream);
	}

	function videoError(error){
		console.log(error);
	}

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
	if (navigator.getUserMedia) {       
        navigator.getUserMedia({video: true, audio:true}, handleVideo, videoError);
    }
};