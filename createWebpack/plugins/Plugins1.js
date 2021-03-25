// 每个plugin都是个类

class Plugin1 {
    apply(compiler){
        compiler.hooks.emit.tap('Plugin1', (compilation) => {
            console.log('emit.tap 11 ---> ');
        })

        compiler.hooks.emit.tapAsync('Plugin1', (compilation, cb) => {
            setTimeout(() => {
                console.log('emit. tapAsync tap 11 ---> ');
                cb();
            }, 1000)
        })

        compiler.hooks.emit.tapPromise('Plugin1', (compilation) => {
            return new Promise((resolve, reject)=>{
                setTimeout(() => {
                    console.log('emit. tapPromise tap 11 ---> ');
                    resolve();
                }, 1000)
            })
        })

        compiler.hooks.afterEmit.tap('Plugin1', (compilation) => {
            console.log('afterEmit.tap 11 ---> ');
        })

        compiler.hooks.done.tap('Plugin1', (stats) => {
            console.log('done.tap 11 ---> ');
        })
    }
}

module.exports = Plugin1;
