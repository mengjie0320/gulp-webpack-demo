const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default; // 默认暴露
const { transformFromAst } = require('@babel/core');

const parser = {
    // 将文件解析成ast
    getAst(filePath){
        // 读取文件
        const file = fs.readFileSync(filePath, 'utf-8');
        // 将其解析成ast抽象语法树
        const ast = babelParser.parse(file, {
            sourceType: 'module', // 解析文件的模块化方案是 ES Module
        });

        return ast;
    },
    // 获取依赖
    getDeps(ast, filePath){
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

        return deps;
    },
    // 解析ast成code
    getCode(ast){
        const {code} = transformFromAst(ast, null, {
            presets: ['@babel/preset-env']
        });
        return code;
    }
}

module.exports = parser;
