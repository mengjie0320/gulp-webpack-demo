const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default; // 默认暴露
const { getAst, getDeps, getCode } = require('./Parser');


class Compiler{
    constructor(options = {}){
        // webpack的配置
        this.options = options;
        // 所有依赖的容器
        this.modules = [];
    }

    // 启动webpack打包
    run(){
        // 入口文件路径
        const filePath = this.options.entry;
        // 初次构建，得到入口文件的信息
        const fileInfo = this.build(filePath);

        this.modules.push(fileInfo);
        this.modules.forEach((fileInfo) => {
            // 取出当前文件所有依赖
            const deps = fileInfo.deps;
            // 遍历
            for(const relativePath in deps){
                // 依赖绝对路径
                const absolutePath = deps[relativePath];
                // 对依赖文件进行处理
                const fileInfo = this.build(absolutePath);
                // 处理后结果添加到modules中，后面遍历
                this.modules.push(fileInfo);
            }
        });

        // console.log('this.modules ---> ', this.modules);

        // 整理好依赖关系图
        const depsGraph = this.modules.reduce((graph, module) => {
            return {
                ...graph,
                [module.filePath]: {
                    code: module.code,
                    deps: module.deps
                }
            }
        }, {});

        // console.log('depsGraph ---> ', depsGraph);

        this.generate(depsGraph);
    }

    build(filePath){
        const ast = getAst(filePath);
        const deps = getDeps(ast, filePath);
        const code = getCode(ast);

        console.log('ast ---> ', ast);
        console.log('deps ---> ', deps);
        console.log('code ---> ', code);

        return {
            filePath,
            deps,
            code
        }
    }

    // 生成输出资源
    generate(depsGraph){
        const bundle = `
            (function(depsGraph){
                // require目的：加载入口文件
                function require(module){
                    // 定义模块内部的require函数
                    function localRequire(relativePath){
                        // 为找到要引入模块的绝对路径，通过require加载
                        return require(depsGraph[module].deps[relativePath]);
                    }

                    // 定义暴露对象（将来模块要暴露的内容）
                    var exports = {};

                    (function(require, exports, code){
                        eval(code)
                    })(localRequire, exports, depsGraph[module].code)

                    // 作为require函数返回值return，后面require得到暴露的内容
                    return exports
                }

                require('${this.options.entry}');
            })(${JSON.stringify(depsGraph)})
        `;

        // 生成输出文件的绝对路径
        const filePath = path.resolve(this.options.output.path, this.options.output.filename);
        // 写入文件
        fs.writeFileSync(filePath, bundle, 'utf-8');
    }
}

module.exports = Compiler;