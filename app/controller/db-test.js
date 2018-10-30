const test = require("../modle/test");

const add = async ctx => {
  await test.add({
    name: "fan",
    date: Date.now(),
  }).then(
    msg => {
      ctx.body = msg;
    }
  ).catch(e => {
    console.error(e);

    ctx.body = e;
  });
};

const list = async ctx => {
  await test.list({}).then(
    list => {
      ctx.body = list;
    }
  ).catch(e => {
    console.error(e);

    ctx.body = e;
  });
};

const remove = async ctx => {
  await test.delete({}).then(
    msg => {
      ctx.body = msg;
    }
  ).catch(e => {
    console.error(e);

    ctx.body = e;
  });
};

const update = async ctx => {
  await test.update({
    name: "fan",
  }, {
    name: "fan",
    date: Date.now(),
  }).then(
    msg => {
      ctx.body = msg;
    }
  ).catch(e => {
    console.error(e);

    ctx.body = e;
  });
};

module.exports = {
  "get /db-test/add": add,
  "get /db-test/list": list,
  "get /db-test/remove": remove,
  "get /db-test/update": update,
};
