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

        let dbRef = opts.fb.db.ref('museum/hands')

        // mock:
        //   hands:true
        //   hands:false

        // setup supported device output parsing
        let incoming = [
          {
            pattern:/hands:(.*)/,
            match: (m) => {
                opts.logger.log(`updating isPressed to ${m[1]}.`)
                dbRef.update({ 'isPressed': m[1] == "true" })
            }
          }
        ]
        let handlers = {};

        super({ ...opts, bt: bt, handlers: handlers, incoming:incoming })

        // setup supported commands
        handlers['hands.test'] = this.test

        this.dbRef = dbRef;
        this.logger = opts.logger;
    }

    test(snapshot, cb) {
        console.log("test function!");
        cb();
    }

    activity() {
         this.dbRef.update({
             lastActivity: (new Date()).toLocaleString()
        })
    }

    connecting() {
        // NOTE: while connecting, mark device as disabled, since it defaults to that
        this.dbRef.update({
            isConnected: false
        })
    }

    connected() {
        this.dbRef.update({
            isConnected: true
        })
    }
}