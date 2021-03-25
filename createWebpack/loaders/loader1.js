// loader是个函数 map -> sourceMap
module.exports = function(content, map, meta){
    console.log('content ---> ', content);
    // 同步
    this.callback(null, content, map, meta);
    // return content;
}

// pitch 会反过来，从上往下执行（正常loader从下往上）
module.exports.pitch = function(){
    console.log('pitch1 ---> ');
}