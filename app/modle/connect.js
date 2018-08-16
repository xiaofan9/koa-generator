const mongoose = require("mongoose");
const config = require("../../config/db");

function onError(err) {
  // 关闭数据库
  mongoose.connection.close();

  throw err;
}

const dbs = {};

const openDB = dbName => {
  if (dbs[dbName]) {
    return dbs[dbName];
  }

  // 多个数据ku连接;
  if (config.auth) {
    url = `mongodb://${config.authConfig.user}:${config.authConfig.password}@${
      config.host
    }:${config.port}/${dbName}?authSource=${config.authConfig.authSource}`;
  } else url = `mongodb://${config.host}:${config.port}/${dbName}`;

  let db = mongoose.createConnection(url, {
    useMongoClient: true
  }); // 新建连接池

  // 单个数据ku连接
  // mongoose.connect(
  //   url,
  //   {
  //     useMongoClient: true
  //   }
  // );

  // const db = mongoose.connection;

  db.on("error", err => {
    Reflect.deleteProperty(dbs, dbName);

    onError(err);
  });

  dbs[dbName] = db;

  return db;
};

let obj;

if (Array.isArray(config)) {
  obj = { openDB };
} else {
  obj = openDB(config.name);
}

module.exports = obj;
