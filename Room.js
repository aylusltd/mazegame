import config from 'config';

export default class Room {
    constructor(opts){
        // check global config object
        var config = config || {};
        config.Room = config.Room || {};
         
        // check for global state
        var state = state || {};

        // check for constructor params
        opts = opts || {};

        var chance = opts.chance || config.Room.chanceOfExit || 0.5;
        opts.mustHaveExits = opts.mustHaveExits || {};

        this.exits = opts.exits || {
            n: opts.mustHaveExits.n || Math.random() < chance,
            e: opts.mustHaveExits.e || Math.random() < chance,
            w: opts.mustHaveExits.w || Math.random() < chance,
            s: opts.mustHaveExits.s || Math.random() < chance
        };

        this.x = opts.x;
        this.y = opts.y;

        this.roomId = '' + opts.x + ', ' + opts.y;
        Objec.freeze(this);
    }
}

