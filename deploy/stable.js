const ftp = require('basic-ftp')
const path = require('path')

const accessConfig = {
}

const remoteDir = '/life365admin'

async function task() {
  const client = new ftp.Client()
  try {
    await client.access(accessConfig)
    // 清空，服务器目录
    // await client.clearWorkingDir()
    await client.ensureDir(remoteDir)
    await client.removeDir(remoteDir)
    console.log(`成功清空服务器目录`)
    // 上传文件
    const distPath = path.resolve(__dirname, '..') + `\\dist`
    await client.uploadFromDir(distPath, remoteDir)
    // 打印文件
    const list = await client.list(remoteDir)
    list.forEach((fileInfo) => {
      let text = ''
      if (fileInfo.type === 1) {
        text = `文件：${fileInfo.name}`
      } else {
        text = `文件夹：/${fileInfo.name}`
      }
      console.log(`成功部署${text}`)
    })
  } catch (err) {
    console.log(err)
  }
  client.close()
}

task()
