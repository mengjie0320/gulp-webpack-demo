// wp是node写出来的  node写法
let path = require('path'); //内置模块
let HtmlWebpackPlugin = require('html-webpack-plugin'); // 有人习惯 -- 或者说插件都是类 大写是个类
let miniCssExtractPlugin = require('mini-css-extract-plugin'); // 需要自己压缩文件
let optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
let uglifyjsPlugin = require('uglifyjs-webpack-plugin');
let webpack = require('webpack');
module.exports = {
    optimization: { // 优化项
        minimizer: [
            new uglifyjsPlugin(),
            new optimizeCssAssetsWebpackPlugin()
        ]
    },
    mode: 'development', //模式：默认两种 production\ development
    entry: '../src/js/index.js', //入口
    output: {
        filename: 'bundle.[hash:8].js', //打包后的文件名, hash戳新文件放置覆盖缓存，:8只显示8位
        path: path.resolve(__dirname, 'build'), 
        //路径必须是一个绝对路径 resolve将相对路径->绝对路径；__dirname以当前目录下产生dist
        // publicPath: 'http://xxxx/xx' 也可以在需要的地方添加该前缀即可
    },
    plugins: [ // Array 所有webpack插件
        new HtmlWebpackPlugin({
            template: '../src/index.html', 
            filename: 'index.html',
            minify: { //压缩
                removeAttributeQuotes: true, //删除属性的双引号
                collapseWhitespace: true, //变成一行
            },
            hash: true, // hash戳
        }),
        new HtmlWebpackPlugin({
            template: '../src/html/login.html', // 打包多个即需多个配置，可以用代码循环生成之后，concat到plugins上
            filename: './html/login.html',
            minify: { //压缩
                removeAttributeQuotes: true, //删除属性的双引号
                collapseWhitespace: true, //变成一行
            },
            hash: true, // hash戳
        }),
        new miniCssExtractPlugin({
            filename: 'css/main.css'
        }),
        // new webpack.ProvidePlugin({ //在每个模块中都注入$
        //     $: 'jquery'
        // })
    ],
    module: { //模块
        rules: [ // 规则
            {
                test: /\.html$/,
                use: 'html-withimg-loader' 
            },
            {
                test: /\.(png|jpg|gif)$/,
                // use: 'file-loader',
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 200*1024, // 200k  给1 -> 保证正常产出
                        outputPath: 'img/'
                    }
                }
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // 用babel-loader 需把es6转es5
                        presets: [ // 大插件集合
                            // preset-env
                            // '@babel/preset-env' // 转模块文件，不会转API
                            'env'
                        ],
                        // plugins: [
                        //     '@babel/plugin-proposal-class-properties'
                        // ]
                        "plugins": [
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                            '@babel/plugin-transform-runtime'
                        ]
                    }
                },
                include: path.resolve(__dirname, 'src'),
                exclude: '/node_modules/'
            },
            {
                test:/\.css$/, 
                use: [
                    miniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            }, 
            {
                test:/\.less$/, 
                use: [
                    miniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            // node-sass sass-loader; stylus stylus-loader
        ]
    }
}