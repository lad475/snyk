module.exports = snyk;

var cluster = require('cluster');
var hook = require('./hook');

function snyk(options) {
  if (!options) {
    options = {};
  }

  if (options.api) {
    snyk.api = options.api;
  }

  if (options.id) {
    snyk.id = options.id;
  }

  // FIXME add in pid + whether master + hostname + all these fields

  snyk.config.isMaster = cluster.isMaster;

  if (options.monitor && snyk.config.isMaster) {
    if (!snyk.api) {
      throw new Error('Snyk monitors require an authenticated account ' +
        'and API key');
    }
    snyk.monitor.capture();
    hook();
  }

  return snyk;
}

snyk.id = require('./config').id;
snyk.api = require('./api-key')();
snyk.modules = require('./modules');
snyk.test = require('./test');
snyk.monitor = require('./monitor');
snyk.bus = require('./bus');
snyk.dotfile = require('./dotfile');
snyk.isRequired = true; // changed to false when loaded via cli
snyk.isolate = {
  okay: function () {
    return true;
  },
};

// this is the user config, and not the internal config
snyk.config = require('./user-config');