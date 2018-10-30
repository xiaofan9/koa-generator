#!/usr/bin/env node

const app = require("../app");
const pkg = require("../package.json");
const debug = require("debug")(pkg.name + ":admin");
const http = require("http");
const config = require("../config");
const kill = require("../app/middleware/kill");
const portfinder = require("portfinder");

const port = normalizePort(config.port || process.env.PORT);

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

createServer(port);

/**
 * 创建http 服务器
 */
async function createServer(port) {
  if (config.portHandle === "kill") {
    await kill(port).catch(process.exit);
  } else {
    portfinder.basePort = port;

    port = await portfinder.getPortPromise().catch(process.exit);
  }

  const server = http.createServer(app.callback());

  if (config.host) {
    server.listen(port, config.host);
  } else {
    server.listen(port);
  }
  server.on("error", onError);
  server.on("listening", onListening);

  // 错误处理函数
  function onError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
      default:
        throw error;
    }
  }

  // 监听函数
  function onListening() {
    let addr = server.address();
    let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);

    if (process.env === "production") {
      console.log("Your application is Listening on " + bind);
    }
  }
}

function normalizePort(num) {
  let port = parseInt(num, 10);

  if (isNaN(port)) {
    port = 8000;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}
