const constants = require("../../../constants");

function BaseCommandHandler(payload) {
  this.payload = payload;
  this.reason = constants.DEFAULT_INVALID_DATA;
}

BaseCommandHandler.prototype.getCommands = function() {
  return [];
};

BaseCommandHandler.prototype.validate = function() {
  /* validate data here and resolve promise if valid */
  return Promise.resolve(true);
};

BaseCommandHandler.prototype.fail = function() {
  /* run this if validate fails */
};

BaseCommandHandler.prototype.performCommand = function() {
  /* run this if validate passes */

  return Promise.resolve(null);
};

BaseCommandHandler.prototype.getAggregate = function() {
  /* gets current state */
  return Promise.resolve(null);
};

BaseCommandHandler.prototype.commandChain = function() {
  /* main function */

  return this.validate()
    .then(valid => {
      if (valid) {
        return this.performCommand();
      } else {
        this.fail();
        return Promise.reject(this.reason);
      }
    })
    .catch(e => {
      return Promise.reject(this.reason);
    });
};

module.exports = BaseCommandHandler;
