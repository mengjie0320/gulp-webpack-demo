
const {getOptions} = require('loader-utils');
const {validate} = require('schema-utils');
const babelSchema = require('./babelSchema.json');
const babel = require('@babel/core');
const util = require('util');

// babel.transform 编译代码的方法，普通异步方法
// util.promisify 将普通异步转化成基于promise的异步方法
const transform = util.promisify(babel.transform);


module.exports = function(content, map, meta){
    // 获取options
    const options = getOptions(this) || {};

    // 校验options是否合法
    validate(babelSchema, options, {
        name: 'babel loader'
    });

    // 创建异步
    const callback = this.async();

    // 使用babel
    transform(content, options)
        .then(({code, map})=>callback(null, code, map, meta))
        .catch((e) => callback(e))

    return content;
}