'use strict'
const fs = require('fs');
const KoaRouter = require('koa-router');
const { join } = require("path");
const debug = require('debug')('topstar-api:bind-router');

const router = new KoaRouter;

const $root = process.cwd();

function isFile(path) {
    return fs.statSync(path).isFile()
}

function isDir(path) {
    return fs.statSync(path).isDirectory()
}

function addControllers(router, dir, basepath = '', pre = '') {
    let files = fs.readdirSync(join($root, dir, pre));
    for (let i = 0; i < files.length; i++) {
        let filePath = join($root, dir, pre, files[i]);
        if (isFile(filePath)) {
            if (files[i].endsWith('.js')) {
                let mapping = require(filePath);
                addMapping(router, mapping, basepath, pre);
            }
        } else if (isDir(filePath)) {
            let subDir = pre + "/" + files[i];
            addControllers(router, dir, basepath, subDir);
        }
    }
}

function addMapping(router, mapping, basepath = '', pre = '') {
    if (pre && !pre.startsWith('/')) {
        pre = '/' + pre;
    }
    if (basepath && !basepath.startsWith('/')) {
        basepath = '/' + basepath;
    }

    for (let url in mapping) {
        let method = url.split(' ')[0].toLocaleUpperCase();
        let path = basepath + pre + url.split(' ')[1]

        if (method.startsWith('GET')) {
            router.get(path, mapping[url])
                //console.log('bind router get',method, path)
        } else if (method.startsWith('POST')) {
            router.post(path, mapping[url])
        } else if (method.startsWith('DELETE')) {
            router.del(path, mapping[url])
        } else if (method.startsWith('PUT')) {
            router.put(path, mapping[url])
        } else {
            console.error('invalid URL: \d', url)
        }
        debug('bind router: %s %s', method, path)
    }

}

module.exports = function(dir, basepath = '') {
    let controllers_dir = dir || './app/controller'
    addControllers(router, controllers_dir, basepath)
    return router;
}