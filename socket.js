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
    event.eventName === CONSTANTS.EVENTS.REPORT_CREATED ||
    event.eventName === CONSTANTS.EVENTS.AD_CREATED
  ) {
    // users viewing map must receive new reports and ads
    room = "map viewers";
  } else if (event.eventName === CONSTANTS.EVENTS.USER_APPLICATION_CREATED) {
    // users that are admins must receive new applications
    room = "admins";
  }

  console.log("[SOCKET HANDLER] Sending to client at room", room);
  // emit to client
  eventsNameSpace.to(room).emit(event.eventName, event.payload);
});

eventsNameSpace.on("connection", socket => {
  console.log("[SOCKET HANDLER] Client connected");

  // upon reconnect
  socket.on("initialize", data => {
    console.log("[SOCKET HANDLER] Client reconnecting");
    // join private room
    socket.join(`${CONSTANTS.AGGREGATES.USER_AGGREGATE_NAME} ${data.id}`);

    // join admins room if admin role
    if (data.role == 2) socket.join("admins");
  });

  // login
  socket.on("login", data => {
    console.log("[SOCKET HANDLER] User logging in");
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
    console.log("[SOCKET HANDLER] Client joined", data);
    socket.join(data);
  });

  socket.on("unsubscribe", data => {
    console.log("[SOCKET HANDLER] Client left", data);
    socket.leave(data);
  });
});

const data = {
  app: app,
  server: server,
  io: io
};

module.exports = data;
