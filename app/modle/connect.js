const mongoose = require("mongoose");
const config = require("../../config/db");

function onError(err) {
  // 关闭数据库
  mongoose.connection.close();

  throw err;
}

const dbs = {};

const openDB = ({
  name: dbName,
  ...config
}) => {
  if (dbs[dbName]) {
    return dbs[dbName];
  }

  let url;

  // 多个数据ku连接;
  if (config.auth) {
    url = `mongodb://${config.authConfig.user}:${config.authConfig.password}@${
      config.host
    }:${config.port}/${dbName}?authSource=${config.authConfig.authSource}`;
  } else {
    url = `mongodb://${config.host}:${config.port}/${dbName}`;
  }

  // 新建连接池
  let db = mongoose.createConnection(url, {
    useNewUrlParser: true, // useMongoClient
  });

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

  return dbs[dbName];
};

let connect;

if (Array.isArray(config)) {
  config.forEach(conf => openDB(conf));

  connect = dbs;
} else {
  connect = openDB(config);
}

connect.openDB = openDB;

module.exports = connect;
