let Manager = require('./manager')

module.exports = class CoinManager extends Manager {
    constructor(opts) {
        let bt = new (require('./serial.direct'))({
            name: opts.name,
            baudRate: 9600,
            logger: opts.logger,
            dev: '/dev/ttyCOIN'
        });

        let ref = opts.fb.db.ref('museum/devices/zoltar')

        let incoming = [];
        let handlers = {};

        super({ ...opts, bt: bt, handlers: handlers, incoming:incoming })

        // setup supported commands
        handlers['zoltar.increment'] = (s,cb) => { 
            bt.write('increment');
            cb();
        }
        handlers['zoltar.decrement'] = (s,cb) => { 
            bt.write('decrement');
            cb();
        }
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
                    let p = s.split(/:(.+)/);
                    switch(p[0]) {
                        case "solved": 
                            this.solved = (p[1] === 'true')
                            break
                        case "version": 
                            this.version = p[1]
                            break
                        case "gitDate": 
                            this.gitDate = p[1]
                            break 
                        case "buildDate": 
                            this.buildDate = p[1]
                            break
                        case "coins": 
                            let nCoins = parseInt(p[1]);
                            if (this.coins != nCoins) {
                                this.coinChange()
                            }
                            this.coins = nCoins
                            break
                        case "donations": 
                            let nDonations = parseInt(p[1])
                            if (this.donations != nDonations) {
                                this.donationChange()
                            }
                            this.donations = nDonations
                            break
                    }
                })

                ref.update({
                    build: {
                        version: this.version,
                        date: this.buildDate,
                        gitDate: this.gitDate
                    },
                    solved: this.solved,
                    coins: this.coins,
                    donations: this.donations
                })
            }
        });

        this.ref = ref
        this.serial = bt
        this.logger = opts.logger
        this.audio = opts.audio

        this.solved = false
        this.version = "unknown"
        this.gitDate = "unknown"
        this.buildDate = "unknown"
        this.coins = 0
        this.donations = 0
    }

    activity() {
         this.ref.update({
             lastActivity: (new Date()).toLocaleString()
        })
    }

    coinChange() {
        this.logger.log(this.logPrefix + 'detected coin change...')
        var _solved = this.solved
        this.play("coin.wav", () => {
            if (_solved) {
                this.allCoins()
            }
        })
    }

    donationChange() {
        this.logger.log(this.logPrefix + 'detected donation...')
        this.play("donation.wav")
    }

    allCoins() {
        this.logger.log(this.logPrefix + 'solved.')
        this.play("success.wav")
    }

    play(fName, cb) {
        this.audio.play(fName, (err) => {
            if (cb) {
                cb()
            }
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

        // TMP -------------------------------
        setTimeout(() => {
            this.bt.write('i');
        }, 3000);
        setTimeout(() => {
            this.bt.write('i');
        }, 5000);
        setTimeout(() => {
            this.bt.write('i');
        }, 8000);
        // TMP -------------------------------

        this.ref.update({
            isConnected: true
        })
    }
}