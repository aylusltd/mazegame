var Room = require('./Room');
var fs = require('fs');

module.exports = function Model() {
    var maze = [];
    var maxX = 0;
    var maxY = 0;

    this.generate = function generate(opts, cb){
        opts = opts || {};
        var x = opts.x;
        var y = opts.y;

        console.log('generating room at ' + x + ', ' + y);
        
        var n = this.getRoom({x:x,y:y+1});
        var e = this.getRoom({x:x+1,y:y});
        var w = this.getRoom({x:x-1,y:y});
        var s = this.getRoom({x:x,y:y-1});

        opts.mustHaveExits = opts.mustHaveExits || {};
        opts.invalidExits = opts.invalidExits || {};

        if(n && n.exits.s){
            opts.mustHaveExits.n = true;   
        }
        if(e && e.exits.w){
            opts.mustHaveExits.e = true;   
        }
        if(w && w.exits.e){
            opts.mustHaveExits.w = true;   
        }
        if(s && s.exits.n){
            opts.mustHaveExits.s = true;   
        }

        maxX = Math.max(x,maxX);
        maxY = Math.max(y,maxY);

        if(maze[x][y]){
            throw new Error('already exists');
        }
        if(!maze[x]){
            maze[x] = [];
        }

        if(x === 0) {
            opts.invalidExits.w = true;
        }

        if(y === 0) {
            opts.invalidExits.s = true;
        }

        if(!maze[x][y]) {
            maze[x][y] = new Room(opts);
        }

        if(typeof cb === 'function') {
            return cb(maze[x][y]);
        } else {
            return maze[x][y];
        }
    };

    this.getBounds = function getBounds(cb){
        if(typeof cb === 'function') {
            return cb({x:maxX, y:maxY});
        } else {
            return {x:maxX, y:maxY};
        }
    }

    this.getRoom = function getRoom(opts, cb){
        var x = opts.x;
        var y = opts.y;
        var e;
        console.log('fetching room at ' + x + ', ' + y);
        if(!maze[x] || !maze[x][y]) {
            if(!maze[x]) {
                maze[x] = [];
            }
            try {
                maze[x][y] = require('./Rooms/' + x + '-' + y);
            } catch (ex) {
                e = ex;   
            }
        }
        if(typeof cb === 'function') {
            return cb(e, maze[x][y]);
        } else {
            return maze[x][y];
        }
    };

    this.persistRoom = function persistRoom(opts, cb) {
        var x = opts.x;
        var y = opts.y;
        fs.writeFile(__dirname + './Rooms/' + x + '-' + y +'.json', function(err){
            if(typeof cb === 'function') {
                cb(err);
            }
        });
    };

    this.toDisk = function toDisk(opts, cb) {
        var x = opts.x;
        var y = opts.y;

        this.persistRoom(opts, function(err){
            if(!err)
                delete maze[x][y];

            if(typeof cb === 'function') {
                cb(err);
            }
        });
    }
}