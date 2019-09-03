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

// Handle report events
io.of("/reports").on("connection", socket => {
  socket.on("onCreated", data => {
    io.of("/reports").emit("reportCreated", data); // send back new report to everyone
  });
  socket.on("onUpVoted", data => {
    socket.broadcast.emit("voteCreated", data);
  });
  socket.on("onDownVoted", data => {
    socket.broadcast.emit("voteDeleted", data);
  });
});

// Handle comments
io.of("/comments").on("connection", socket => {
  socket.on("onCreated", data => {
    socket.broadcast.emit("commentCreated", data);
  });
});

// Handle ad events
io.of("/ads").on("connection", socket => {
  socket.on("onCreated", data => {
    io.of("/ads").emit("adCreated", data);
  });
});

// Handle applications events
io.of("/applications", socket => {
  socket.on("onCreated", data => {
    io.of("/applications").emit("applicationCreated", data);
  });

  socket.on("onAccepted", data => {
    io.of("/applications").emit("applicationAccepted", data);
    io.of("/applications").emit("currentUser", data);
  });

  socket.on("onRejected", data => {
    console.log("he");
    io.of("/applications").emit("applicationRejected", data);
  });
});

const data = {
  app: app,
  server: server,
  io: io
};

module.exports = data;
