// 通过generater类的extendPackage方法向实例身上添加属性
module.exports = (generator) => {
    // 调用实例的方法扩展属性
  generator.extendPackage({
      dependencies: {
          // 支持es6+的语法
          'core-js': '^3.33.0',
      },
      devDependencies: {
          '@babel/core': '^7.23.0',
          '@babel/preset-env': '^7.22.0',
          'babel-loader': '^9.1.3',
          // babel支持vue3
          "@vue/babel-preset-app":"^5.0.8",
          // 支持jsx
          "@vue/babel-plugin-jsx":"^1.1.1"
      },
  })
  
}