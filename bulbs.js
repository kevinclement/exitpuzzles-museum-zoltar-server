const { fork } = require('child_process');

const forks = []
module.exports = class Bulbs {
  constructor(opts) {
    this.logger = opts.logger

    this.connectToBulbs()

    setTimeout(() => {
        this.color("green")
    }, 8000)
  }

  connectToBulbs() {
    const bulbs = require('./bulbs.devices');
    forks.push(fork('bulbs.handler', bulbs.getBulbs(0,3),   {env: {NOBLE_HCI_DEVICE_ID: 0}}));
    forks.push(fork('bulbs.handler', bulbs.getBulbs(3,6),   {env: {NOBLE_HCI_DEVICE_ID: 1}}));
    // forks.push(fork('bulbs.handler', bulbs.getBulbs(12,18), {env: {NOBLE_HCI_DEVICE_ID: 2}}));
  }

  off()  {
    forks.forEach((f) => {
      f.send({ cmd: 'off' });
    });
  }

  on()  {
    forks.forEach((f) => {
      f.send({ cmd: 'on' });
    });
  }

  // red,green,blue
  color(color) {
    forks.forEach((f) => {
      f.send({ cmd: 'color', color: color });
    });
  }
}

// when process  is kill, cleanup it's children
process.once('SIGUSR2', function () {
  forks.forEach((f) => {
    process.kill(f.pid)
  });
  
  process.kill(process.pid)
});