const KoaRouter = require("koa-router");
const router = new KoaRouter();
const pkg = require("../../package.json");
const debug = require("debug")(pkg.name + ":bind-router");
const fs = require("fs");
const path = require("path");

const basepath = path.join(__dirname, "../", "controller");

addRouter();

module.exports = router;

function addRouter() {
  try {
    const fileNames = fs.readdirSync(basepath);

    for (let fileName of fileNames) {
      let mapping = require(path.join(basepath, fileName));

      let methods = ["get", "delete", "header", "post", "put", "patch"];

      for (let [rule, fn] of Object.entries(mapping)) {
        let [method, path] = rule.split(" ");

        if (!path) {
          console.log(`invalid path: ${path}`);
          continue;
        }
        if (methods.indexOf(method.toLocaleLowerCase(method)) >= 0) {
          router[method](path, fn);
          debug(path);
        } else {
          console.log(`invalid method: ${method}`);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}
