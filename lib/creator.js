// 生成所有文件和处理生成文件的所有流程
let { getAnswer } = require('../lib/prompt')
let {Generator} = require('../lib/Generator')
// 得到需要的所有依赖
async function creator(){
  let generator = new Generator()
  answers = await getAnswer()
  // 得到了所有的依赖，存储在这个变量当中，等待渲染到package.json
  generator.package.name = Object.keys(answers)[0]
  // 生成src/main.ts文件
  let res = await generator.createMain()
  console.log('生成main.ts');
  // 根据所有的依赖生成package变量
  generator.createDependencies(answers,Object.keys(answers)[0])
}
creator()