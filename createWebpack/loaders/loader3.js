// loader是个函数

const {getOptions} = require('loader-utils');
const {validate} = require('schema-utils');
const schema = require('./schema.json');

module.exports = function(content, map, meta){
    // 获取options
    const options = getOptions(this) || {};
    console.log('3 ---> ', options);

    // 校验options是否合法
    validate(schema, options, {
        name: 'loader3'
    })

    return content;
}