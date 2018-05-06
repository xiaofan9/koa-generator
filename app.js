const path = require("path");
const Koa = require("koa");
const json = require("koa-json");
const logger = require("koa-logger");
const onerror = require("koa-onerror");
const staticServer = require("koa-static");
const bodyParser = require("koa-bodyparser");
const nunjucks = require("./app/middleware/nunjucks");
const router = require("./app/router");

const app = new Koa();

// 捕获404错误页面
app.use(require("./app/middleware/error404"));

// koa的错误处理
onerror(app);

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
app.use(bodyParser({ enableTypes: ["json", "form", "text"] }));

// 指定静态文件中间件
app.use(
    staticServer(path.join(__dirname, "public"), {
        maxage: 7 * 24 * 60 * 60 * 1000,
    })
);

// 加载路由
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
