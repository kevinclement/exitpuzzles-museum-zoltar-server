module.exports = class BluetoothMock {
    constructor(opts) {
        this.logger = opts.logger;
        this.address = opts.address;
        this.channel = opts.channel;
        this.logPrefix = 'bluetooth: ' + opts.name + ': ';

        this.open = false;
        this.connectionStartTime = null;
        this.onLine = this.onLine.bind(this);
        this.buffer = new (require('./buffer'))(this.onLine);
    }

    connect(cb) {
        this.log('Connecting to ' + this.address + ' ...')
        this.connectionStartTime = new Date();
        this.buffer.reset();
        setTimeout(() => {
            this.logger.log(this.logPrefix + 'Connected.');
            this.open = true;
            this.connectionStartTime = null;
            if (cb) cb();
        }, 5000)
    }

    isConnecting() {
        if (!this.connectionStartTime) return false;

        return true;
    }

    isOpen() {
        return this.open;
    }

    onLine(line) {
        this.logger.log(this.logPrefix + '< ' + line);
    }

    write(msg, cb) {
        if (!this.isOpen()) {
            this.logger.logger.error(this.logPrefix + 'Trying to write to device but not yet connected.');
        }

        this.logger.log(this.logPrefix + '> ' + msg);

        // fake it
        setTimeout(() => {
            if (cb) cb();
        }, 100);
    }

    log(msg) {
        this.logger.log(this.logPrefix + msg);
    }

    inquire() {
    }
}


