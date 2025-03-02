module.exports = (generator) => {
  generator.extendPackage({
      devDependencies: {
          'typescript': '^5.0.0',
          '@vue/compiler-sfc': '^3.3.0',
          'vue-tsc': '^1.0.0',
          "@vue/runtime-dom":"^3.3.0",
          "@vue/runtime-core":"^3.3.0"
      },
  })
}