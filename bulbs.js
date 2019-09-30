const { fork } = require('child_process');

const forks = []
module.exports = class Bulbs {
  constructor(opts) {

    this.logger = opts.logger
    this.isWhite = true;

    this.connectToBulbs()
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

    isWhite = color == 'white';
  }
}

// when process  is kill, cleanup it's children
function exitHandler(options, exitCode) {
    if (options.cleanup) { 
      console.log('cleaning up spawned processes...');
      forks.forEach((f) => {
        process.kill(f.pid)
      });
    }
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));