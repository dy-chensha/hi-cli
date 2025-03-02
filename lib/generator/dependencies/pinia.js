module.exports = (generator) => {
  generator.extendPackage({
      devDependencies: {
          'pinia': '^2.1.0',
      },
  })
  // 向入口文件 `src/main.js` 注入代码
  generator.injectImports('{createPinia}', `./src/router/index.ts`,"createPinia()")
}