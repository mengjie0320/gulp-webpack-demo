const Compiler = require('./Compiler');

function myWebapck(config){
    return new Compiler(config);
}

module.exports = myWebapck;