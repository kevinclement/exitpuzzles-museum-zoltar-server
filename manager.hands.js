let Manager = require('./manager')

module.exports = class HandsManager extends Manager {
    constructor(opts) {

        // TODO: switch to real device
        let bt = new (require('./bluetooth.mock'))({
            name: opts.name,
            address: '00:00:00:00:00:00',
            channel: 1,
            logger: opts.logger
        });

        let mummyRef = opts.fb.db.ref('museum/hands')

        // setup supported device output parsing
        let incoming = [
          {
            pattern:/count (.*)/,
            match: (m) => {
                // do some updates 
                // m[1]
                console.log(`found count match ${m[1]}\n`)
            }
          }
        ]
        let handlers = {};

        super({ ...opts, bt: bt, handlers: handlers, incoming:incoming })

        // setup supported commands
        handlers['hands.test'] = this.test

        this.mummyRef = mummyRef
        this.logger = opts.logger;
    }

    test(snapshot, cb) {
        console.log("test function!");
        cb();
    }

    activity() {
         this.mummyRef.update({
             lastActivity: (new Date()).toLocaleString()
        })
    }

    connecting() {
        // NOTE: while connecting, mark device as disabled, since it defaults to that
        this.mummyRef.update({
            isConnected: false
        })
    }

    connected() {
        this.mummyRef.update({
            isConnected: true
        })
    }
}