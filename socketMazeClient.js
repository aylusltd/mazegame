function View(){
    var socket = io('http://localhost');
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });
    function createUI(){

    }

    function renderRoom(){

    }

    function updateMap(){

    }

    function displayError(err){}

    function moveRoom(){

    }

    function displayMap(maze) {
        document.getElementById('map'){

        }
    }
}