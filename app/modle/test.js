const db = require("./connect");

const mongoose = require("mongoose");

mongoose.Promise = Promise;

const schema = new mongoose.Schema({
    name: String,
    num: {
        require: true,
        default: 1,
        type: Number
    }
});

const Test = db.model("test", schema, "test");

const testEntity = new Test({
    name: "小凡"
});

testEntity.save(function(err) {
    if (err) {
        require("debug")("topstar-api:db-find")(err);

        return
    }

    Test.find(function(err, persons) {
        //查询到的所有person
        console.log(persons);
    });
});