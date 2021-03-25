##### 自创建对应信息简介：
| | 简写目录 | 目的文件| 执行命令 |
|:--------:|:--------:|:--------:|:--------:|
| webpack | lib/myWebpack | dist | tnpm run build |
|plugins|plugins|dist-plugins|npx webpack(打开webpack.config.js)对应配置|
|loaders|loaders|dist-loaders|npx webpack(打开webpack.config.js)对应配置|

## 简单总结：

loader 用于对模块的源代码进行转换。loader 可以使你在 import 或"加载"模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的强大方法。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS文件！loader是个函数，接收三个参数content, map, meta，回调三个参数，默认从后向前执行；其中可添加pitch函数，执行顺序相反。

plugin插件是 webpack 的支柱功能。webpack 自身也是构建于，你在 webpack 配置中用到的相同的插件系统之上！插件目的在于解决 loader 无法实现的其他事。webpack 插件是一个具有 apply 属性的 JavaScript 对象。apply 属性会被 webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问。
