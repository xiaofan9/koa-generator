const request = require("supertest");
const app = require("../app");
const assert = require("power-assert");
const http = require("http");
const server = http.createServer(app.callback());

describe("url test", () => {
  it("should complete this test", function () {
    return new Promise(function (resolve, reject) {
      request(server.listen())
        .get("/test")
        .end(function (err, res) {
          resolve();
          server.close();

          if (err) {
            throw err;
          }

          assert.strictEqual(2, 3);
        });
    });
  });
});
