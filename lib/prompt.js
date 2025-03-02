const {prompt} =require('inquirer').default
const fs = require('fs');
const path = require('path');
// 利用fs模块的readdirSync方法同步读取了问题文件夹下的所有暴露的变量
function getExportedVariables(directory,includesFiles) {
    let files = fs.readdirSync(directory);
    let exportedVariables = [];
    if (includesFiles) {
      files = files.filter(item => includesFiles.includes(item))
    }
    files.forEach(file => {
        if (path.extname(file) === '.js') {
            const filePath = path.join(directory, file);
            const moduleExports = require(filePath);

            // 假设模块导出一个对象
            if ( moduleExports !== null) {
              exportedVariables =  exportedVariables.concat(moduleExports)
            } else {
                console.warn(`File ${file} does not export an null.`);
            }
        }
    });

    return exportedVariables;
}

// 使用示例
const directoryPath = path.join(__dirname, '/prompts');
const variables = getExportedVariables(directoryPath);
console.log(variables);
// 应用所有问题获取命令行的回答
let getAnswer=()=>{
  return new Promise((resolve)=>{
    prompt([
      {
        name: "vue",
        // 多选交互功能
        // 单选将这里修改为 list 即可
        type: "checkbox",
        message: "Check the features needed for your project:",
        choices: variables
      },
    ]).then((res)=>{
      resolve(res)
    })
  })
}

module.exports = {
  getAnswer,
  getExportedVariables
}
