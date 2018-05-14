const mongoose = require("mongoose");

const config = require("../../config/db");

let url;

// auth 表示需要 数据库 用户密码验证,authSource 是验证用户名密码所在的数据库 ，默认为admin
if (config.auth) {
  url = `mongodb://${config.authConfig.user}:${config.authConfig.password}@${
    config.host
  }:${config.port}/${config.name}?authSource=${config.authConfig.authSource}`;
} else url = `mongodb://${config.host}:${config.port}/${config.name}`;

// 单个数据ku连接
mongoose.connect(url, {
  useMongoClient: true
});

const db = mongoose.connection;

db.on("error", err => {
  // 关闭数据库
  mongoose.connection.close();
  require("debug")("topstar-api:db-connect")(err);
});

module.exports = db;
