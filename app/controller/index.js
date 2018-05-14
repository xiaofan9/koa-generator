const index = async (ctx, next) => {
  ctx.body = "hello world!";
};

const error = async ctx => {
  await ctx.render("error");
};

const test = async ctx => {
  await ctx.render("test");
};

module.exports = {
  index,
  error,
  test
};
