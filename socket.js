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
  // upon reconnect
  socket.on("reconnect", data => {
    // join private room
    socket.join(`room ${data.id}`);

    // join admins room if admin role
    if (data.role == 2) socket.join("admins");
  });

  // login
  socket.on("login", data => {
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

  // new report
  socket.on("reportSubmitted", data => {
    io.of("/events")
      .in("map viewers")
      .emit("reportCreated", data); // send back new report to everyone viewing map
  });

  // report upvoted
  socket.on("onUpVoted", data => {
    // socket.broadcast.emit("voteCreated", data);
    io.of("/events")
      .to("map viewers")
      .emit("voteCreated", data);
  });

  // report downvoted
  socket.on("onDownVoted", data => {
    // socket.broadcast.emit("voteDeleted", data);
    io.of("/events")
      .to("map viewers")
      .emit("voteDeleted", data);
  });
});

// // Handle report events
// io.of("/reports").on("connection", socket => {
//   socket.on("onCreated", data => {
//     io.of("/reports").emit("reportCreated", data); // send back new report to everyone
//   });
//   socket.on("onUpVoted", data => {
//     socket.broadcast.emit("voteCreated", data);
//   });
//   socket.on("onDownVoted", data => {
//     socket.broadcast.emit("voteDeleted", data);
//   });
// });

// // Handle comments
// io.of("/comments").on("connection", socket => {
//   socket.on("onCreated", data => {
//     socket.broadcast.emit("commentCreated", data);
//   });
// });

// // Handle ad events
// io.of("/ads").on("connection", socket => {
//   socket.on("onCreated", data => {
//     io.of("/ads").emit("adCreated", data);
//   });
// });

// // Handle applications events
// io.of("/applications", socket => {});

const data = {
  app: app,
  server: server,
  io: io
};

module.exports = data;
