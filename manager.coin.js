let Manager = require('./manager')

module.exports = class CoinManager extends Manager {
    constructor(opts) {
        let bt = new (require('./serial.direct'))({
            name: opts.name,
            baudRate: 9600,
            logger: opts.logger,
            dev: '/dev/ttyCOIN'
        });

        let ref = opts.fb.db.ref('museum/zoltar')

        let incoming = [];
        let handlers = {};

        super({ ...opts, bt: bt, handlers: handlers, incoming:incoming })

        // setup supported commands
        handlers['zoltar.reboot'] = (s,cb) => { 
            bt.write('reboot');
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
                            this.solved = (p[1] === 'true')
                            break
                    }
                })

                opts.fb.db.ref('museum/zoltar').update({
                    opened: this.solved
                })
            }
        });

        this.ref = ref
        this.serial = bt
        this.logger = opts.logger

        this.solved = false
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
        // No need to get status since its arduino and it restarts on connection

        this.ref.update({
            isConnected: true
        })
    }
}