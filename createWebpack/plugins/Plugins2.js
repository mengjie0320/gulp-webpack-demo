// 每个plugin都是个类
const fs = require('fs');
const util = require('util');
const path = require('path');

const webpack = require('webpack');
const { RawSource } = webpack.sources;

// 将fs.readFile 变成基于promise风格的方法
const readFile = util.promisify(fs.readFile);

class Plugin2 {
    apply(compiler){
        // 初始化 compilation
        compiler.hooks.thisCompilation.tap('Plugin2', (compilation) => {
            // debugger
            // console.log(compilation);
            compilation.hooks.additionalAssets.tapAsync('MyPlugin', async callback => {
                // download('https://img.shields.io/npm/v/webpack.svg', function(resp) {
                //   if(resp.status === 200) {
                //     compilation.assets['webpack-version.svg'] = toAsset(resp);
                //     callback();
                //   } else {
                //     callback(new Error('[webpack-example-plugin] Unable to download the image'));
                //   }
                // })

                const content = 'hello'

                compilation.assets['a.txt'] = {
                    size(){ return content.length },
                    source(){ return content }
                };

                const data = await readFile(path.resolve(__dirname, 'b.txt'));
                // compilation.assets['b.txt'] = new RawSource(data)

                compilation.emitAsset('b.txt', new RawSource(data))

                callback();
            });
        })
        
    }
}

module.exports = Plugin2;
