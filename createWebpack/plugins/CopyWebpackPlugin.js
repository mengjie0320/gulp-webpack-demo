const { validate } = require('schema-utils');
const globby = require('globby');
const schema = require('./schema.json');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const webpack = require('webpack');
const { RawSource } = webpack.sources;

const readFile = promisify(fs.readFile);

class CopyWebpackPlugin {

    constructor(options = {}){
        // 验证options是否符合规范
        validate(schema, options, { name: 'CopyWebpackPlugin'})

        this.options = options;
    }

    apply(compiler){
        // 初始化 compilation
        compiler.hooks.thisCompilation.tap('CopyWebpackPlugin', async (compilation) => {

            // 添加资源的hooks
            compilation.hooks.additionalAssets.tapAsync('CopyWebpackPlugin', async (callback) => {
                

                const {from, ignore} = this.options;
                const to = this.options.to ? this.options.to: '';

                // 1、过滤到ignore文件

                // webpack配置中的context
                const context = compiler.options.context; // process.cmd
                // 将输入变成绝对路径 ??? 相对路径？？？？
                const absoluteFrom = path.isAbsolute(from) ? from: path.resolve(context, from)

                console.log('absoluteFrom ---> ', absoluteFrom);

                // globby(要处理的文件夹, options)
                const paths = await globby(from, { ignore });
                console.log('paths ---> ', paths);

                // 2、读取paths所有资源；
                const files = await Promise.all(
                    paths.map(async absolutePath => {
                        const data = await readFile(absolutePath);
                        // basename 得到最后的文件名称
                        const relativePath = path.basename(absolutePath);
                        
                        const filename = path.join(to, relativePath);

                        return {
                            data, // 文件数据
                            filename, // 名称
                        }
                    })
                )
                
                // 3、生成webpack格式资源；
                const assets = files.map((file) => {
                    const source = new RawSource(file.data);

                    return {
                        source,
                        filename: file.filename
                    }
                })
                // 4、添加到compilation，输出
                // compilation.emitAsset('b.txt', new RawSource(data))
                assets.forEach((asset) => {
                    compilation.emitAsset(asset.filename, asset.source);
                })


                callback();
            });
        })
        
    }
}

module.exports = CopyWebpackPlugin;
