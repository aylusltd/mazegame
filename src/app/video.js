module.exports = function videoHandler(ev){
	console.log(ev.target);
	var t = ev.target;
	while(t !== document.body && !~Array.prototype.slice.call(t.classList).indexOf('chair'))
		t=t.parentNode;
	console.log(t);

	function handleVideo(stream){
		t.querySelector('video').src = window.URL.createObjectURL(stream);
	}

	function videoError(error){
		console.log(error);
	}

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
	if (navigator.getUserMedia) {       
        navigator.getUserMedia({video: true}, handleVideo, videoError);
    }
};