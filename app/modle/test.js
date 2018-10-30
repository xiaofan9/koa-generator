/**
 * 数据库调用示例
 */
const db = require("./connect");

const mongoose = require("mongoose");

mongoose.Promise = Promise;

const schema = new mongoose.Schema({
  name: String,
  date: {
    require: true,
    default: +new Date(),
    type: Date,
  },
});

// model
const Test = db["test2"].model("test", schema, "test"); // test 表名（没有3默认为1加s，存在3表名为3），(模型名, schema, 连接名)

module.exports = {
  //  通过实例化model，创建一个model实例
  add: function (data) {
    return new Promise((resolve, reject) => {
      Test.create(data, (err, doc) => {
        if (err) {
          reject(err);
          return;
        }

        resolve("创建成功！");
      });
    });
  },

  delete: function (condition) {
    return new Promise((resolve, reject) => {
      Test.remove(condition, (err, doc) => {
        if (err) {
          reject(err);
          return;
        }

        resolve("删除成功！");
      });
    });
  },
  update: function (condition, data) {
    return new Promise((resolve, reject) => {
      Test.update(condition, data, (err, doc) => {
        if (err) {
          reject(err);
          return;
        }

        resolve("更新成功！");
      });
    });
  },
  list: function (condition) {
    return new Promise((resolve, reject) => {
      Test.find(condition, (err, doc) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(doc);
      });
    });
  },
};
