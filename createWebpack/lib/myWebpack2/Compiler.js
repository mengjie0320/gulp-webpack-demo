const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default; // 默认暴露
const { getAst, getDeps, getCode } = require('./Parser');


class Compiler{
    constructor(options = {}){
        this.options = options;
    }

    // 启动webpack打包
    run(){
        // 入口文件路径
        const filePath = this.options.entry;
        const ast = getAst(filePath);
        const deps = getDeps(ast, filePath);
        const code = getCode(ast);

        // console.log('ast ---> ', ast);
        // console.log('deps ---> ', deps);
        // console.log('code ---> ', code);
    }
}

module.exports = Compiler;