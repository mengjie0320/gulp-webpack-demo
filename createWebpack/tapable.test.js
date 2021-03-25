const { SyncHook, SyncBailHook, AsyncParallelHook, AsyncSeriesHook } = require('tapable');

class Lesson {
    constructor(){
        // 初始化hooks容器
        this.hooks = {
            // 同步hooks
            // go: new SyncHook(['address']) 任务依次执行
            // go: new SyncBailHook(['address']) // 一旦有返回值就停止
            go: new SyncBailHook(['address']),
            // 异步hooks
            // leave: new AsyncParallelHook(['name', 'age']) // 异步并行
            leave: new AsyncSeriesHook(['name', 'age']) // 异步串行
        }
    }

    tap(){
        // 往hooks容器中注册事件/添加回调函数
        this.hooks.go.tap('class0318', (address) => {
            console.log('address 318 ---> ', address);
            return 11; // 一旦有返回，不会再往下执行
        });
        this.hooks.go.tap('class0314', (address) => {
            console.log('address 314 ---> ', address);
            // return 11; // 一旦有返回，不会再往下执行
        });

        this.hooks.leave.tapAsync('class0514', (name, age, cb) => {
            setTimeout(()=>{
                console.log('class0514 ---> ', name, age, cb);
                cb();
            }, 2000);
        });

        this.hooks.leave.tapPromise('class0614', (name, age) => {
            return new Promise((resolve, reject) => {
                setTimeout(()=>{
                    console.log('class0614 ---> ', name, age);
                    resolve();
                }, 1000);
            });
        });
    }

    start(){
        // 触发hooks
        this.hooks.go.call('c318');
        this.hooks.leave.callAsync('mj', 16, function(){
            // 代表所有leave容器的触发完
            console.log('end~ ---> ');
        });
    }
}

const l = new Lesson();
l.tap();
l.start();
