/**
 * Module dependencies.
 */
const debug = require("debug")("fwaze:server");
const http = require("http");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const mapRouter = require("./routes/map");
const socket = require("socket.io");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/map", mapRouter);

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

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
    console.log(data);
    io.emit("applicationAccepted", data);
    io.emit("currentUser", data);
  });

  socket.on("rejectApplication", data => {
    io.emit("applicationRejected", data);
  });
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server 'error' event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

module.exports = server;
