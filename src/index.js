const path = require('path')
const fs = require('fs')
const { homedir } = require('os')
const colors = require('colors')
const semver = require('semver')

const Qiniu = require('./Qiniu')
const constant = require('./constant')
// .env文件路径
let envPath =  path.join(homedir(), '/.env')
if(process.env.NODE_ENV === 'development') {
  envPath =  path.join(__dirname, '../.env')
}

function upload(options) {
  try {
    checkNodeVersion()
    checkUserHomeEnvFile()
    initConfig()
    let localFile = ''
    const filePath = options.file
    if(!filePath) {
      return
    }
    if(path.isAbsolute(filePath)) {
      localFile = filePath
    } else {
      localFile = `${process.cwd()}/${filePath}`
    }
    let qiniu = new Qiniu()
    qiniu.upload(localFile)
  } catch (error) {
    console.log(colors.red(error.message));
  }
}

/**
 * 查看用户目录下是否存在.env文件
 */
function checkUserHomeEnvFile() {
  const exist = fs.existsSync(envPath)
  if(!exist) {
    throw new Error('请确保用户目录下存在.env文件')
  }
}

/**
 *初始化dotenv
 */
function initConfig() {
  require('dotenv').config({
    path: envPath
  })
}

function checkNodeVersion() {
  const currentVersion = process.version
  const lowestNodeVersion = constant.LOWEST_NODE_VERSION
  if(!semver.gte(currentVersion, lowestNodeVersion)) {
    throw new Error(colors.red(`need node version >= ${lowestNodeVersion}`))
  }
}


module.exports = { upload }