const service = require("../service");

const error = async ctx => {
  await ctx.render("error");
};

const index = async ctx => {
  await ctx.render("index", {
    auth: true
  });
};

const test = async ctx => {
  const date = service();

  ctx.body = "当前时间为：" + date;
};

module.exports = {
  index,
  error,
  test
};
