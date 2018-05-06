const index = async(ctx, next) => {
    ctx.body = "hello world!";
};

const error = async ctx => {
    await ctx.render("error");
};

const test = async ctx => {
    await ctx.render("test");
};

require("../modle/test"); // 测试数据库

module.exports = {
    index,
    error,
    test,
};
