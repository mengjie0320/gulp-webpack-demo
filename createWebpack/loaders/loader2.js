// loader是个函数
// 异步loader
module.exports = function(content, map, meta){
    console.log('content ---> ', content);
    const callback = this.async(); // this.async()返回this.callback
    setTimeout(() => {
        callback(null, content);
    }, 1000);

    // return content;
}