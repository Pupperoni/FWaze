const express = require("express");
const http = require("http");
const app = express();
const socket = require("socket.io");
const broker = require("./kafka");
const CONSTANTS = require("./constants");

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Socket setup
 */
const io = socket(server);
const eventsNameSpace = io.of("/events");

broker.eventSocketsSubscribe(message => {
  let event = JSON.parse(message.value);
  let room = `${event.aggregateName} ${event.aggregateID}`;

  if (
    event.eventName === CONSTANTS.EVENTS.CREATE_REPORT ||
    event.eventName === CONSTANTS.EVENTS.CREATE_AD
  ) {
    // users viewing map must receive new reports and ads
    room = "map viewers";
  } else if (event.eventName === CONSTANTS.EVENTS.CREATE_APPLICATION) {
    // users that are admins must receive new applications
    room = "admins";
  } else if (event.eventName === CONSTANTS.EVENTS.CREATE_COMMENT) {
    // users viewing comments will receive new comments of the report
    room = `${CONSTANTS.AGGREGATES.COMMENT_AGGREGATE_NAME} ${event.payload.reportId}`;
  } else if (
    event.eventName === CONSTANTS.EVENTS.APPROVE_APPLICATION ||
    event.eventName === CONSTANTS.EVENTS.REJECT_APPLICATION
  ) {
    // users that applied must receive response
    room = `${CONSTANTS.AGGREGATES.USER_AGGREGATE_NAME} ${event.payload.userId}`;
  }
  console.log("Sending to room", room);
  // emit to client
  eventsNameSpace.to(room).emit(event.eventName, event.payload);
});

eventsNameSpace.on("connection", socket => {
  console.log("Connected");

  // upon reconnect
  socket.on("initialize", data => {
    console.log("Reconnecting");
    // join private room
    socket.join(`${CONSTANTS.AGGREGATES.USER_AGGREGATE_NAME} ${data.id}`);

    // join admins room if admin role
    if (data.role == 2) socket.join("admins");
  });

  // login
  socket.on("login", data => {
    console.log("Logging in");
    // when a user logs in, he joins a private room with himself
    socket.join(
      `${CONSTANTS.AGGREGATES.USER_AGGREGATE_NAME} ${data.id}`,
      () => {
        if (data.role == 2) {
          socket.join("admins");
        }
      }
    );
  });

  socket.on("subscribe", data => {
    console.log("Joined", data);
    socket.join(data);
  });

  socket.on("unsubscribe", data => {
    console.log("Left", data);
    socket.leave(data);
  });
});

const data = {
  app: app,
  server: server,
  io: io
};

module.exports = data;
