var config = require('./config');

module.exports = function Room(opts) {
        // check global config object
        var config = config || {};
        config.Room = config.Room || {};
         
        var x = opts.x;
        var y = opts.y;

        // check for constructor params
        opts = opts || {};

        var chance = opts.chance || config.Room.chanceOfExit || 0.5;
        opts.mustHaveExits = opts.mustHaveExits || {};
        opts.invalidExits = opts.invalidExits || {};

        this.exits = opts.exits || {
            n: !opts.invalidExits.n && opts.mustHaveExits.n || Math.random() < chance,
            e: !opts.invalidExits.e && opts.mustHaveExits.e || Math.random() < chance,
            w: !opts.invalidExits.w && opts.mustHaveExits.w || Math.random() < chance,
            s: !opts.invalidExits.s && opts.mustHaveExits.s || Math.random() < chance
        };

        if(x < 1) {
            this.exits.w = false;
        }

        if(y < 1) {
            this.exits.s = false;
        }

        if( !this.exits.n && 
            !this.exits.e && 
            !this.exits.w && 
            !this.exits.s ) {
            Math.random() >= 0.5 ? 
                this.exits.n = true :
                this.exits.e = true;
        }    


        this.x = opts.x;
        this.y = opts.y;

        this.roomId = '' + opts.x + ', ' + opts.y;
        // Object.freeze(this);
}

