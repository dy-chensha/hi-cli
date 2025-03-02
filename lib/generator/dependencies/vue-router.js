module.exports = (generator) => {
  // 注入依赖
  generator.extendPackage({
      dependencies: {
          "vue-router": '^4.2.0',
      },
  })
  // 向入口文件 `src/main.js` 注入代码
  generator.injectImports('router', `./src/router/index.ts`,'router')
}