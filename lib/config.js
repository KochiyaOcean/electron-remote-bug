var config, configCache, configPath, fs, log, path;

path = require('path');

fs = require('fs');

config = null;

configCache = {};

configPath = path.join(__dirname, '..', 'config.json');

config = JSON.parse(fs.readFileSync(configPath));

module.exports = {
  get: function(path, value) {
    var cur, j, len1, p;
    if (configCache[path]) {
      return configCache[path];
    }
    path = path.split('.').filter(function(p) {
      return p !== '';
    });
    cur = config;
    for (j = 0, len1 = path.length; j < len1; j++) {
      p = path[j];
      cur = cur != null ? cur[p] : void 0;
    }
    return configCache[path] = cur != null ? cur : value;
  },
  set: function(path, value) {
    var cur, e, i, j, len, len1, p;
    if (configCache[path]) {
      delete configCache[path];
    }
    path = path.split('.').filter(function(p) {
      return p !== '';
    });
    cur = config;
    len = path.length;
    for (i = j = 0, len1 = path.length; j < len1; i = ++j) {
      p = path[i];
      if (i !== len - 1) {
        if (typeof cur[p] !== 'object') {
          cur[p] = {};
        }
        cur = cur[p];
      } else {
        cur[p] = value;
      }
    }
    try {
      return fs.writeFileSync(configPath, CSON.stringify(config, null, 2));
    } catch (error1) {
      return console.warn(error1);
    }
  },
  setDefault: function(path, value) {
    if (!this.get(path)) {
      return this.set(path, value);
    }
  }
};
