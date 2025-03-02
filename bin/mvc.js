#! /usr/bin/env node
const { program } = require('commander')
// 因为是命令行工具，所以执行环境是node端用commonjs规范
// 获取命令行问题
// 创建版本，创建命令create, 指定参数，指定描述
let fileName = ''
let answers = []
program
    .version('0.1.0')
    .command('create <name>')
    .description('创建一个新的项目')
    .action(async (data) => {
        fileName = data
        require('../lib/creator')
    })
program.parse()
