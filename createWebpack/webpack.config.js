// const Plugin1 = require('./plugins/Plugins1')
// const Plugin2 = require('./plugins/Plugins2')
const CopyWebpackPlugin = require('./plugins/CopyWebpackPlugin')
const path = require('path');

module.exports = {
    mode: 'production',
    // 测试 plugin
    // output: {
    //     filename: 'bundle.js', 
    //     path: path.resolve(__dirname, 'dist-plugin'), 
    // },
    // plugins: [
    //     new CopyWebpackPlugin({
    //         from: 'public',
    //         to: 'css',
    //         ignore: ['**/index.html']
    //     })
    // ],

    // 测试 loader
    output: {
        filename: 'bundle.js', 
        path: path.resolve(__dirname, 'dist-loader'), 
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                // loader: path.resolve(__dirname, 'loaders', 'loader1.js'),
                use: [
                    'loader1',
                    'loader2',
                    {
                        loader: 'loader3',
                        options: {
                            name: 'xx'
                        }
                    }
                ]
                // loader: 'babelLoader',
                // options: {
                //     presets: ['@babel/preset-env']
                // }
            }
        ]
    },
    // 配置loader解析规则
    resolveLoader: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'loaders')
        ]
    }
}