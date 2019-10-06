const { fork } = require('child_process');

const forks = []
module.exports = class Bulbs {
  constructor(opts) {

    this.logger = opts.logger
    this.isWhite = true;
    this.idol = -1;

    this.connectToBulbs()

    // TMP: do this for real ----------------------------
    // this.cabRef = opts.fb.db.ref('museum/devices/cabinet').on('value', (snapshot) => {
    //   let cabinet = snapshot.val()
    //   if (cabinet == null) return

    //   if (this.idol != -1 && this.idol != cabinet.idol) {
    //     console.log('Detected idol change, changing lights to match');
    //     var color = 'blue';
    //     if (cabinet.idol == 3) {
    //       color = 'red';
    //     }
    //     if (cabinet.idol == 4) {
    //       color = 'green';
    //     }
    //     this.color(color);
        
    //     console.log(`Change to ${cabinet.idol}`);
    //   }

    //   this.idol = cabinet.idol;
    // })
    // ---------------------------------------------------
  }

  connectToBulbs() {
    const bulbs = require('./bulbs.devices');
    forks.push(fork('bulbs.handler', bulbs.getBulbs(0,6),   {env: {NOBLE_HCI_DEVICE_ID: 0}}));
    forks.push(fork('bulbs.handler', bulbs.getBulbs(6,12),  {env: {NOBLE_HCI_DEVICE_ID: 1}}));
    forks.push(fork('bulbs.handler', bulbs.getBulbs(12,18), {env: {NOBLE_HCI_DEVICE_ID: 2}}));
  }

  off()  {
    forks.forEach((f) => {
      f.send({ cmd: 'off' });
    });

    this.isWhite = true;
  }

  on()  {
    forks.forEach((f) => {
      f.send({ cmd: 'on' });
    });

    this.isWhite = false;
  }

  // red,green,blue
  color(color) {
    forks.forEach((f) => {
      f.send({ cmd: 'color', color: color });
    });

    this.isWhite = color == 'white';
  }
}

// when process  is kill, cleanup it's children
function exitHandler(options, exitCode) {
    console.log('cleaning up spawned processes...');
    forks.forEach((f) => {
        process.kill(f.pid)
    });

    process.exit();
}

process.on('exit', exitHandler.bind(null, {}));