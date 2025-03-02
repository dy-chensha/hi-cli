// 选择问题过后，根据问题的依赖项生成package.json文件
// 创建generator类
let lodash = require('lodash')
let { getExportedVariables } = require('./prompt')
const fs = require('fs')
const path = require('path')
class Generator {
    constructor(name) {
        // 实例对象
        this.package = {
            name: name,
            version: '1.0.0',
            dependencies: {},
            devDependencies: {},
        }
    }
    // 原型方法扩展实例的package对象,
    extendPackage(params) {
        let result = lodash.merge(this.package, params)
        this.package = result
    }
    // 对每一个配置创建依赖
    createDependencies(params, name) {
        const directoryPath = path.join(__dirname, '/generator/dependencies')
        const variables = getExportedVariables(directoryPath, params[name])
        console.log(variables)
        variables.forEach((mergeFun) => {
            mergeFun(this)
        })
    }
    // 原型方法创建模板到src文件夹下面的某一个文件夹
    injectImports(variableName,pathName,useName) {
        const fs = require('fs')
        const path = require('path')
        const parser = require('@babel/parser')
        const traverse = require('@babel/traverse').default
        const generator = require('@babel/generator').default
        const t = require('@babel/types')

        function addVueRouterToMain(variableName,pathName,useName) {
            const mainFilePath = path.resolve(process.cwd(), 'src/main.ts')
            const code = fs.readFileSync(mainFilePath, 'utf-8')

            // 解析代码为 AST
            const ast = parser.parse(code, {
                sourceType: 'module',
                plugins: ['typescript'],
            })

            let lastImportIndex = -1
            let lastUseExpressionIndex = -1

            // 遍历 AST，找到目标位置
            traverse(ast, {
                ImportDeclaration(path) {
                    lastImportIndex = path.key // 记录最后一个 import 语句的位置
                },
                ExpressionStatement(path) {
                    if (
                        t.isCallExpression(path.node.expression) &&
                        t.isMemberExpression(path.node.expression.callee) &&
                        path.node.expression.callee.object.name === 'app' &&
                        path.node.expression.callee.property.name === 'use'
                    ) {
                        lastUseExpressionIndex = path.key // 记录最后一个 app.use 的位置
                    }
                },
            })

            // 插入新的代码
            if (lastImportIndex !== -1) {
                const importStatement = t.importDeclaration(
                    [t.importDefaultSpecifier(t.identifier(variableName))],
                    t.stringLiteral(pathName)
                )
                ast.program.body.splice(lastImportIndex + 1, 0, importStatement)
            }

            if (lastUseExpressionIndex !== -1) {
                const useRouterStatement = t.expressionStatement(
                    t.callExpression(
                        t.memberExpression(
                            t.identifier('app'),
                            t.identifier('use')
                        ),
                        [t.identifier(useName)]
                    )
                )
                ast.program.body.splice(
                    lastUseExpressionIndex + 1,
                    0,
                    useRouterStatement
                )
            } else {
                // 如果没有 app.use，则在文件末尾插入
                const useRouterStatement = t.expressionStatement(
                    t.callExpression(
                        t.memberExpression(
                            t.identifier('app'),
                            t.identifier('use')
                        ),
                        [t.identifier(useName)]
                    )
                )
                ast.program.body.push(useRouterStatement)
            }

            // 将 AST 转换回代码
            const output = generator(ast, { retainLines: true }, code)
            fs.writeFileSync(mainFilePath, output.code, 'utf-8')
            console.log('Vue Router has been added to main.ts.')
        }

        // 调用函数
        addVueRouterToMain(variableName,pathName,useName)
    }
    // 生成main文件
    createMain() {
        // 获取当前命令行工具的根目录
        const toolRoot = path.resolve(__dirname, '..') // 假设当前文件在工具的某个子目录下
        const templatePath = path.join(
            toolRoot,
            'lib/generator/template/src',
            'main.js'
        ) // 模板文件路径
        const targetPath = path.join(process.cwd(), 'src', 'main.ts') // 用户当前目录下的目标路径
        return new Promise((resolve, reject) => {
            // 1. 读取模板文件内容
            fs.readFile(templatePath, 'utf-8', (err, templateContent) => {
                if (err) {
                    console.error('读取模板文件失败:', err)
                    reject(err)
                    return
                }

                // 2. 确保目标目录存在
                const targetDir = path.dirname(targetPath) // 获取目标目录路径
                fs.mkdir(targetDir, { recursive: true }, (err) => {
                    if (err) {
                        console.error('创建目标目录失败:', err)
                        reject(err)
                        return
                    }

                    // 3. 写入目标文件
                    fs.writeFile(targetPath, templateContent, (err) => {
                        if (err) {
                            console.error('写入目标文件失败:', err)
                            reject(err)
                            return
                        }
                        resolve('ok')
                        console.log(`模板文件已成功创建于: ${targetPath}`)
                    })
                })
            })
        })
    }
}
module.exports = { Generator }
