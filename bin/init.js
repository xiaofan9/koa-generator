// 项目名称

// Project description
// Author

// 是否开启cors（默认/不开启/开启选中的）
// 当端口给占用，是自动修改端口，还是杀死进程

// 数据库示例？ 删除文件，但不删除文件夹,
// 删除单元测试

const fs = require("fs-extra");
const exec = require("child_process").execSync;
const pkg = require("../package.json");
const config = require("../config");
const path = require("path");

const inquirer = require("inquirer");

const questions = [
  {
    name: "name",
    message: "Project name",
    default: "test",
  },
  {
    name: "desc",
    message: "Project description",
    default: "A koa project",
  },
  {
    name: "author",
    message: "Author",
    default: getGitUser(),
  },
  {
    type: "confirm",
    name: "private",
    message: "Project is private",
    default: "Y/n",
  },
  {
    name: "cors",
    type: "confirm",
    message: "Are you use cors",
    default: "Y/n",
  },
  {
    name: "portHandle",
    type: "list",
    message:
      "When the port is occupied, is it necessary to modify the port automatically or kill the process?",
    default: ["modify"],
    choices: ["modify", "kill"],
  },
  {
    type: "confirm",
    name: "mongodb",
    message: "Are you add mongodb examples",
    default: "Y/n",
  },
  {
    type: "confirm",
    name: "unit",
    message: "Are you add unit test",
    default: "Y/n",
  },
];

inquirer.prompt(questions).then(an => {
  let pkg_ = {
    ...pkg,
    name: an.name,
    description: an.desc,
    author: an.author,
    ...(an.private
      ? {
        private: true,
      }
      : {}),
  };

  const root = path.resolve(__dirname, "..");

  let cfg = {
    ...config,
    cors: an.cors,
    portHandle: an.portHandle,
  };

  if (an.private) {
    Reflect.deleteProperty(pkg_, "license");
  }

  if (!an.unit) {
    Reflect.deleteProperty(pkg_["scripts"], "unit");
    Reflect.deleteProperty(pkg_["scripts"], "test");

    fs.removeSync(path.join(root, "test"));
  }

  pkg_["scripts"]["debug"] = "set debug=" + pkg_.name + ":* && npm run dev";

  Reflect.deleteProperty(pkg_, "keywords");
  Reflect.deleteProperty(pkg_, "homepage");
  Reflect.deleteProperty(pkg_, "repository");
  Reflect.deleteProperty(pkg_, "bugs");

  Reflect.deleteProperty(pkg_["scripts"], "init");

  fs.outputFileSync(
    path.join(root, "package.json"),
    JSON.stringify(pkg_, null, 2)
  );

  fs.outputFileSync(
    path.join(root, "config", "index.js"),
    "module.exports = " + JSON.stringify(cfg, null, 2)
  );

  if (!an.mongodb) {
    const pathApp = path.join(root, "app");

    fs.removeSync(path.join(pathApp, "controller", "db-test.js"));
    fs.removeSync(path.join(pathApp, "modle", "test.js"));
  }

  fs.removeSync(path.join(__dirname, "init.js"));
  // fs.removeSync(path.join(root, ".git"));
});

function getGitUser() {
  let name;
  let email;

  try {
    name = exec("git config --get user.name");
    email = exec("git config --get user.email");
  } catch (e) {}

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1);
  email = email && " <" + email.toString().trim() + ">";

  return (name || "") + (email || "");
}
