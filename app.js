const path = require("path");
const Koa = require("koa");
const json = require("koa-json");
const logger = require("koa-logger");
const onerror = require("koa-onerror");
const staticServer = require("koa-static");
const bodyParser = require("koa-bodyparser");
const nunjucks = require("./app/middleware/nunjucks");
const compress = require("koa-compress");
const router = require("./app/middleware/auto-add-router");
const errorPage = require("./app/middleware/error404");
const cors = require("koa2-cors");
const config = require("./config");

const app = new Koa();

if (config.cors) {
  app.use(cors());
}

// koa的错误处理
onerror(app);

// gzip 压缩
app.use(
  compress({
    level: 9,
  })
);

// 捕获404错误页面
app.use(errorPage);

// 加载html模板
app.use(
  nunjucks(path.join(__dirname, "app", "views"), {
    extension: "njk",
  })
);

// 输出日志
app.use(logger());

// 格式化json输出
app.use(json());

// 解析 post body
app.use(
  bodyParser({
    enableTypes: ["json", "form", "text"],
  })
);

// 加载路由
app.use(router.routes());
app.use(router.allowedMethods());

// 指定静态文件中间件
app.use(
  staticServer(path.join(__dirname, "public"), {
    maxage: 7 * 24 * 60 * 60 * 1000,
  })
);

module.exports = app;
