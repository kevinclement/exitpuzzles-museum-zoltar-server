let Manager = require('./manager')

module.exports = class LaserManager extends Manager {
    constructor(opts) {

        let bt = new (require('./serial.bluetooth'))({
            name: opts.name,
            address: '00:00:00:00:00:00',
            channel: 1,
            logger: opts.logger
        });

        let ref = opts.fb.db.ref('museum/laser')

        let incoming = [];
        let handlers = {};

        super({ ...opts, bt: bt, handlers: handlers, incoming:incoming })

        // setup supported commands
        handlers['laser.on'] = (s,cb) => { 
            bt.write('enable');
            cb();
        }

        // setup supported device output parsing
        incoming.push(
        {
            pattern:/.*status=(.*)/,
            match: (m) => {
                m[1].split(',').forEach((s)=> {
                    let p = s.split(':');
                    switch(p[0]) {
                        case "solved": 
                            // this.solved = (p[1] === 'true')
                            break
                    }
                })

                // opts.fb.db.ref('museum/mummy').update({
                //     opened: this.solved
                // })
            }
        });

        this.ref = ref
        this.serial = bt
        this.logger = opts.logger

        this.enabled = false
    }
    
    activity() {
        this.ref.update({
            lastActivity: (new Date()).toLocaleString()
       })
    }

   connecting() {
       // NOTE: while connecting, mark device as disabled, since it defaults to that
       this.ref.update({
           isConnected: false
       })
   }

   connected() {
       this.ref.update({
           isConnected: true
       })
    }
}