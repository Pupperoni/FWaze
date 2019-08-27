const constants = require("../../../constants");

function BaseCommandHandler() {}

BaseCommandHandler.prototype.getCommands = function() {
  return [];
};

BaseCommandHandler.prototype.validate = function(payload) {
  /* validate data here and resolve promise if valid */
  if (payload) return Promise.resolve(true);
};

BaseCommandHandler.prototype.performCommand = function(payload) {
  /* run this if validate passes */

  return Promise.resolve(payload);
};

BaseCommandHandler.prototype.getAggregate = function() {
  /* gets current state */
  return Promise.resolve(null);
};

BaseCommandHandler.prototype.commandChain = function(payload) {
  /* main function */

  return this.validate(payload)
    .then(valid => {
      if (valid) {
        return this.performCommand(payload);
      }
    })
    .catch(e => {
      return Promise.reject(e);
    });
};

module.exports = BaseCommandHandler;