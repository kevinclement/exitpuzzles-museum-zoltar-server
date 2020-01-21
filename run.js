module.exports = class Runs {
    constructor(opts) {
        this.runsRef = opts.db.ref('museum/runs')
        this.run = undefined
        this.logger = opts.logger
        this.logPrefix =  'run: '

        opts.db.ref('museum/runs').orderByChild('timestamp').limitToLast(2000).on('value', (snapshot) => {
            let latest = undefined;
            snapshot.forEach(function(runSnap) {
                let run = runSnap.val()
                let key = runSnap.key
                if (run.finished == "") {
                    latest = key
                }
            })

            if (latest) {
                this.logger.log(this.logPrefix + `using ${latest} for run analytics.`)
                this.run = opts.db.ref('museum/runs').child(latest)
            } else {
                this.run = undefined
            }
        })
    }
    solved(event, forced) {
        if (this.run) {
            this.run.child("events").child(event).update({
                timestamp: (new Date()).toLocaleString(),
                force: forced ? true : false
            })
        } else {
            this.logger.log(this.logPrefix + `WARN: ${event}: run not defined, not updating analytics`)
        }
    }
    zoltarSolved(forced) {
        this.solved('zoltar', forced)
    }
}