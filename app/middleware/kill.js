const isWin = process.platform === "win32";
const cmd = isWin ? "netstat -ano" : "netstat -ntpl";

const child_process = require("child_process");
const exec = require("child_process").exec;
const iconv = require("iconv-lite");
const debug = require("debug")("kill");

module.exports = (port = 8080) => {
  return new Promise(function(resolve, reject) {
    exec(cmd, { encoding: "binary" }, function(err, stdout, stderr) {
      if (err) {
        return reject(err);
      }

      let isPZ = false;
      stdout.split("\n").filter(function(line, index) {
        const p = line.trim().split(/\s+/);
        const address = p[isWin ? 1 : 3];

        // 打印当前行
        debug(iconv.decode(new Buffer(line, "binary"), "cp936"));
        if (address !== undefined) {
          if (address.split(":")[1] == port) {
            // 端口状态
            if (p[isWin ? 3 : 5] !== "") {
              isPZ = true;
              exec("taskkill /F /pid " + p[4], function(err, stdout, stderr) {
                if (err) {
                  return reject("释放指定端口失败！！");
                }

                return resolve("占用指定端口的程序被成功杀掉！");
              });
            }
          }
        } else if (index === stdout.split("\n").length - 1 && !isPZ) {
          resolve("端口未占用！");
        }
      });
    });
  });
};
