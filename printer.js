const path = require('path');
const escpos = require('escpos');

const options = { }
// TODO: uncomment once printer is plugged in
// const device  = new escpos.USB();
// const printer = new escpos.Printer(device, options);

const solvedTicket = path.join(__dirname, 'zoltar-solved-ticket.jpg'); 
escpos.Image.load(solvedTicket, function(image){
    console.log('escpos image loaded');
});

module.exports = class Printer {
    constructor(opts) {
        this.logger = opts.logger
        this.logPrefix = 'printer: '
    }

    print(cb) {
        this.logger.log(this.logPrefix + 'printing solved ticket...')
        // device.open(() => {
        //     printer
        //         .align('ct')
        //         .raster(image)
        //         .cut()
        //         .close()
        // })
    }
}