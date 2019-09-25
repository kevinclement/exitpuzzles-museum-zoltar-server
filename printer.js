const path = require('path');
const escpos = require('escpos');

const options = { }
// const device  = new escpos.USB();
// const printer = new escpos.Printer(device, options);

const solvedTicket = path.join(__dirname, 'zoltar-solved-ticket.jpg'); 

module.exports = class Printer {
    constructor(opts) {
        this.logger = opts.logger
        this.logPrefix = 'printer: '
    }

    print(cb) {
        this.logger.log(this.logPrefix + 'printing solved ticket...')

        // TODO: preload this when app starts and not when printing
        escpos.Image.load(solvedTicket, function(image){
            // device.open(() => {
            //     printer
            //         .align('ct')
            //         .raster(image)
            //         .cut()
            //         .close()
            // })
        });
    }
}