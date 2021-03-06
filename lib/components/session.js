"use strict";

const SessionService = require('../common/service/sessionService');

module.exports = function(app, opts) {
  let cmp = new Component(app, opts);
  app.set('sessionService', cmp, true);
  return cmp;
};

/**
 * Session component. Manage sessions.
 *
 * @param {Object} app  current application context
 * @param {Object} opts attach parameters
 */
let Component = function(app, opts) {
  opts = opts || {};
  this.app = app;
  this.service = new SessionService(opts);

  let self = this;
  let getFun = function(m) {
    return (function() {
          return function() {
            return self.service[m].apply(self.service, arguments);
          };
    })();
  };
  
  // proxy the service methods except the lifecycle interfaces of component
  for(let m in this.service) {
    if(m !== 'start' && m !== 'stop') {
      let method = this.service[m];
      if(typeof method === 'function') {
        this[m] = getFun(m);
      }
    }
  }
};

Component.prototype.name = '__session__';
