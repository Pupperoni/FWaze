const express = require("express");
const http = require("http");
const app = express();
const socket = require("socket.io");

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Socket setup
 */
const io = socket(server);
// init

io.of("/events").on("connection", socket => {
  console.log("Connected");

  // upon reconnect
  socket.on("initialize", data => {
    console.log("Reconnecting");
    // join private room
    socket.join(`room ${data.id}`);

    // join admins room if admin role
    if (data.role == 2) socket.join("admins");
  });

  // login
  socket.on("login", data => {
    console.log("Logging in");
    // when a user logs in, he joins a private room with himself
    socket.join(`room ${data.id}`, () => {
      if (data.role == 2) {
        socket.join("admins");
      }
    });
  });

  // new application
  socket.on("applicationCreated", data => {
    io.of("/events")
      .to("admins")
      .emit("applicationSent", data);
  });

  // accepted application
  socket.on("onAccepted", data => {
    io.of("/events")
      .to(`room ${data.data.userId}`)
      .emit("applicationAccepted", data);
    io.of("/events")
      .to(`room ${data.data.userId}`)
      .emit("changeToAdvertiser", data);
  });

  // application rejected
  socket.on("onRejected", data => {
    io.of("/events")
      .to(`room ${data.data.userId}`)
      .emit("applicationRejected", data);
  });

  socket.on("mapVisited", () => {
    // join map viewing room
    console.log("Joining map...");
    socket.join("map viewers");
  });

  socket.on("mapExited", () => {
    // leave map room
    console.log("Leaving map...");
    socket.leave("map viewers");
  });

  socket.on("viewReport", data => {
    // report viewing room
    console.log("Joining report", data);
    socket.join(`report ${data}`);
  });

  socket.on("leaveReport", data => {
    // report viewing room
    console.log("Leaving report", data);
    socket.leave(`report ${data}`);
  });

  // new report
  socket.on("reportSubmitted", data => {
    io.of("/events")
      .in("map viewers")
      .emit("reportCreated", data); // send back new report to everyone viewing map
  });

  // report upvoted
  socket.on("onUpVoted", data => {
    console.log(socket.rooms);
    io.of("/events")
      .to(`report ${data.id}`)
      .emit("voteCreated", data);
  });

  // report downvoted
  socket.on("onDownVoted", data => {
    console.log(socket.rooms);
    io.of("/events")
      .to(`report ${data.id}`)
      .emit("voteDeleted", data);
  });

  // Handle ad events
  socket.on("adSubmitted", data => {
    io.of("/events")
      .to("map viewers")
      .emit("adCreated", data);
  });

  // Handle comments
  socket.on("commentSubmitted", data => {
    io.of("/events")
      .to("map viewers")
      .emit("commentCreated", data);
  });
});

const data = {
  app: app,
  server: server,
  io: io
};

module.exports = data;
