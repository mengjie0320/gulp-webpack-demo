const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default; // 默认暴露
const { transformFromAst } = require('@babel/core');

function myWebapck(config){
    return new Compiler(config);
}

class Compiler{
    constructor(options = {}){
        this.options = options;
    }

    // 启动webpack打包
    run(){
        // 1、读取入口文件内容
        // 入口文件路径
        const filePath = this.options.entry;
        const file = fs.readFileSync(filePath, 'utf-8');
        // 2、将其解析成ast抽象语法树
        const ast = babelParser.parse(file, {
            sourceType: 'module', // 解析文件的模块化方案是 ES Module
        });
        // debugger
        console.log('ast ---> ', ast);

        // 获取到文件文件夹路径
        const dirname = path.dirname(filePath);

        // 存储依赖容器
        const deps = {}

        // 收集依赖
        traverse(ast, {
            // 内部会遍历ast中program.body，判断里面语句类型
            // 如果type：ImportDeclaration 就会触发当前函数
            ImportDeclaration({node}){
                // 相对路径 './add.js'
                const relativePath = node.source.value;
                // 基于入口文件的绝对路径
                const absolutePath = path.resolve(dirname, relativePath);

                deps[relativePath] = absolutePath;
            }
        });

        console.log('deps ---> ', deps);

        // 编译代码：将浏览器不能识别的代码编译
        const {code} = transformFromAst(ast, null, {
            presets: ['@babel/preset-env']
        });

        console.log('code ---> ', code);
    }
}

module.exports = myWebapck;