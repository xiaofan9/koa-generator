const index = async ctx => {
  await ctx.render("index", {
    auth: true,
  });
};

module.exports = {
  // "method path": handle
  "get /view": index,
};
