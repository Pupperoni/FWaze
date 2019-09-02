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
io.on("connection", socket => {
  // Handle report events
  socket.on("addReport", data => {
    io.emit("newReport", data); // send back new report to everyone
  });
  socket.on("addVote", data => {
    socket.broadcast.emit("voteIncr", data);
  });
  socket.on("deleteVote", data => {
    socket.broadcast.emit("voteDecr", data);
  });

  // Handle comments
  socket.on("addComment", data => {
    socket.broadcast.emit("newComment", data);
  });

  // Handle ad events
  socket.on("addAd", data => {
    io.emit("newAd", data);
  });

  // Handle applications events
  socket.on("addApplication", data => {
    io.emit("newApplication", data);
  });

  socket.on("acceptApplication", data => {
    io.emit("applicationAccepted", data);
    io.emit("currentUser", data);
  });

  socket.on("rejectApplication", data => {
    io.emit("applicationRejected", data);
  });
});

const data = {
  app: app,
  server: server,
  io: io
};

module.exports = data;
