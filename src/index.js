const path = require('path')
const fs = require('fs')
const UserHome = require('user-home')
const colors = require('colors')

const Qiniu = require('./Qiniu')


// .env文件路径
let envPath =  path.join(UserHome, '/.env')
if(process.env.NODE_ENV === 'development') {
  envPath =  path.join(__dirname, '../.env')
}

function upload(options) {
  try {
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
    console.log(colors.red(error));
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


module.exports = { upload }