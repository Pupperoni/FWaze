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

  // socket.join("room " + socket.handshake.query.userId);

  // io.of("/events")
  //   .to("room mNy-jjHblx")
  //   .emit("event", "gej");

  // socket.on("test", data => {
  //   io.of("/events")
  //     .to("room mNy-jjHblx")
  //     .emit("event", "testing");
  // });

  // login
  socket.on("login", data => {
    // when a user logs in, he joins a private room with himself
    socket.join(`room ${data.id}`, () => {
      if (data.role == 2) {
        console.log("Joined admins");
        socket.join("admins", () => {
          console.log(Object.keys(socket.rooms));
        });
      }
    });
  });

  socket.on("applicationCreated", data => {
    console.log("Application created");
    console.log(data);
    console.log(socket.rooms);
    io.of("/events")
      .to("admins")
      .emit("applicationSent", data);
  });

  socket.on("onAccepted", data => {
    console.log(data);
    console.log(socket.rooms);
    io.of("/events")
      .to(`room ${data.data.userId}`)
      .emit("applicationAccepted", data);
    io.of("/events")
      .to(`room ${data.data.userId}`)
      .emit("changeToAdvertiser", data);
  });

  socket.on("onRejected", data => {
    console.log(data);
    console.log(socket.rooms);
    // io.of("/applications").emit("applicationRejected", data);
    io.of("/events")
      .to(`room ${data.data.userId}`)
      .emit("applicationRejected", data);
  });

  // socket.on("disconnecting", reason => {
  //   console.log(reason);
  //   console.log(Object.keys(socket.rooms));
  // });
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
