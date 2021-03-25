
            (function(depsGraph){
                // require目的：加载入口文件
                function require(module){
                    // 定义模块内部的require函数
                    function localRequire(relativePath){
                        // 为找到要引入模块的绝对路径，通过require加载
                        return require(depsGraph[module].deps[relativePath]);
                    }

                    // 定义暴露对象（将来模块要暴露的内容）
                    var exports = {};

                    (function(require, exports, code){
                        eval(code)
                    })(localRequire, exports, depsGraph[module].code)

                    // 作为require函数返回值return，后面require得到暴露的内容
                    return exports
                }

                require('./src/index.js');
            })({"./src/index.js":{"code":"\"use strict\";\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nvar _count = _interopRequireDefault(require(\"./count.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\n// ? 处理依赖的时候后缀js的补充\nconsole.log('add(1,2) ---> ', (0, _add[\"default\"])(1, 2));\nconsole.log('count(1,2) ---> ', (0, _count[\"default\"])(1, 2));","deps":{"./add.js":"E:\\webDemo\\gulp-webpack-demo\\createWebpack\\src\\add.js","./count.js":"E:\\webDemo\\gulp-webpack-demo\\createWebpack\\src\\count.js"}},"E:\\webDemo\\gulp-webpack-demo\\createWebpack\\src\\add.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nfunction add(x, y) {\n  return x + y;\n}\n\nvar _default = add;\nexports[\"default\"] = _default;","deps":{}},"E:\\webDemo\\gulp-webpack-demo\\createWebpack\\src\\count.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nfunction count(x, y) {\n  return x - y;\n}\n\nvar _default = count;\nexports[\"default\"] = _default;","deps":{}}})
        