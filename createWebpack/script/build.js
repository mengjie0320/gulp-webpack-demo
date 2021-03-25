const myWebapck = require('../lib/myWebpack/index');
const config = require('../config/webpack.config');

const compiler = myWebapck(config);
// 开始打包webpack
compiler.run();
