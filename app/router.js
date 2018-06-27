const KoaRouter = require("koa-router");

const router = new KoaRouter();

const index = require("./controller");

// 这里不使用 / 的原因是 / 不生效，原因是app.js 使用了 koa-static 中间件，挂载在了/ 上，直接返回值去了。
router
  .get("/home", index.index)
  .get("/test", index.test)
  .get("/404", index.error);

let stack = router.routes().router.stack;

// 打印加载的路由
for (let s of stack) require("debug")("topstar-api:bind-router")(s.path);

module.exports = router;
