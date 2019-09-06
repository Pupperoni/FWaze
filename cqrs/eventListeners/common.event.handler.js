const CONSTANTS = require("../../constants");
const broker = require("../../kafka");
const async = require("async");

function enqueueEvent(event) {
  CommonEventHandler.eventQueue.push(
    { event: event },
    // perform command
    function(event) {
      CommonEventHandler.sendEvent(event);
    }
  );
  return Promise.resolve();
}

// helper function to find component directory
function getComponent(aggregateName) {
  let componentName = null;
  switch (aggregateName) {
    case CONSTANTS.AGGREGATES.USER_AGGREGATE_NAME:
      componentName = CONSTANTS.COMPONENTS.USER_COMPONENT;
      break;
    case CONSTANTS.AGGREGATES.REPORT_AGGREGATE_NAME:
      componentName = CONSTANTS.COMPONENTS.MAP_COMPONENT;
      break;
    case CONSTANTS.AGGREGATES.AD_AGGREGATE_NAME:
      componentName = CONSTANTS.COMPONENTS.MAP_COMPONENT;
      break;
    case CONSTANTS.AGGREGATES.COMMENT_AGGREGATE_NAME:
      componentName = CONSTANTS.COMPONENTS.MAP_COMPONENT;
      break;
    case CONSTANTS.AGGREGATES.APPLICATION_AGGREGATE_NAME:
      componentName = CONSTANTS.COMPONENTS.USER_COMPONENT;
      break;
  }
  return componentName;
}

const CommonEventHandler = {
  eventQueue: async.queue(function(task, callback) {
    console.log(`Sending ${task.event.eventName}`);
    callback(task.event);
  }),

  sendEvent(event) {
    // get component name
    const componentName = getComponent(event.aggregateName);

    // import the corresponding event handler
    const eventHandler = require(`./${componentName}/${event.aggregateName}.event.handler`);
    eventHandler.sendToReadStore(event);

    return Promise.resolve();
  }
};

broker.eventSubscribe(enqueueEvent);

module.exports = CommonEventHandler;
