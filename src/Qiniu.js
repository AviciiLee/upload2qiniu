const path = require('path')
const fs = require('fs')
const qiniu = require('qiniu')

class Qiniu {

  constructor() {
    //token
    const mac = new qiniu.auth.digest.Mac(process.env.QINIU_AK, process.env.QINIU_SK);
    const options = {
      scope: process.env.QINIU_BUCKET,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    this.uploadToken = putPolicy.uploadToken(mac);
  }

  upload(filePath) {
    if(!process.env.QINIU_ZONE) {
      throw new Error('you should config the `QINIU_ZONE` in the .env file, like: QINIU_ZONE=Zone_z2')
    }
    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone[process.env.QINIU_ZONE];
    config.useHttpsDomain = true;
    config.useCdnDomain = true;
    const stat =  fs.statSync(filePath)
    if(stat.isDirectory()) {
      throw new Error('不支持上传目录！')
    }
    let localFileExist = fs.existsSync(filePath)
    if(!localFileExist) {
      throw new Error('要上传的文件不存在！')
    }
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    let key = path.basename(filePath) + '_' + (new Date()).getTime()
    // 文件上传
    formUploader.putFile(this.uploadToken, key, filePath, putExtra, function(respErr,
      respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        const { key } = respBody
        console.log(`link：${process.env.QINIU_CDNLINK}${key}`);
      } else {
        throw new Error(`${respInfo.statusCode}: ${respBody.error}`)
      }
    });
  }
}


module.exports = Qiniu