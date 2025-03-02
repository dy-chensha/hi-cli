const execa = require('execa')

module.exports = function executeCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        const child = execa(command, [], {
            cwd,
            stdio: ['inherit', 'pipe', 'inherit'],
        })

        child.stdout.on('data', buffer => {
            process.stdout.write(buffer)
        })

        child.on('close', code => {
            if (code !== 0) {
                reject(new Error(`command failed: ${command}`))
                return
            }

            resolve()
        })
    })
}

// create.js 文件
console.log('\n正在下载依赖...\n')
// 下载依赖
await executeCommand('npm install', path.join(process.cwd(), name))
console.log('\n依赖下载完成! 执行下列命令开始开发：\n')
console.log(`cd ${name}`)
console.log(`npm run dev`)