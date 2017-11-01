const path = require("path");
const Koa = require('koa');
const json = require('koa-json');
const logger = require("koa-logger");
const onerror = require('koa-onerror');
const staticServer = require('koa-static');
const bodyParser = require("koa-bodyparser");
const nunjucks = require("./app/middleware/nunjucks");
const router = require("./app/middleware/controller")();

const app = new Koa();

onerror(app); // koa的错误处理

app.use(nunjucks(path.join(__dirname, "views"), {
    extension: "njk"
}));

app.use(logger()); // 输出日志
app.use(json()); // 格式化json输出
app.use(bodyParser({ enableTypes: ['json', 'form', 'text'] })); // 解析 post body

app.use(staticServer(path.join(__dirname, 'public'), {
    maxage: 7 * 24 * 60 * 60 * 1000
})); // 指定静态文件中间件


app.use(require("./app/middleware/error404")); // 捕获错误页面
// 加载路由
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;