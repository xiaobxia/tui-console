// 也可以使用file-saver库操作

export default {
  // 通过base64创建图片
  createBase64Img(type, str) {
    return `data:image/${type};base64,${str}`
  },
  // 下载文件流
  downloadExcel(data, name, type) {
    const blob = new Blob(
      [data],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }
    )
    if (window.navigator.msSaveBlob) { // 兼容ie
      window.navigator.msSaveBlob(blob, `${name}.${type}` || '下载')
    } else { // 非ie
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob) // 创建下载的链接
      downloadElement.href = href
      downloadElement.download = `${name}.${type}` // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
    }
  },
  // 通过arrayBuffer下载文件流
  downloadFile(data, name) {
    const blob = new Blob(
      [data]
    )
    if (window.navigator.msSaveBlob) { // 兼容ie
      window.navigator.msSaveBlob(blob, name || '下载')
    } else { // 非ie
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob) // 创建下载的链接
      downloadElement.href = href
      downloadElement.download = `${name}` // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
    }
  },
  // 通过 blob 下载文件流
  downloadBlobFile(blob, name = 'download') {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, name)
    } else {
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.setAttribute('download', name)
      a.click()
    }
  },
  // 下载文件，已有路径
  downloadFileByUrl(url, name) {
    const downloadElement = document.createElement('a')
    downloadElement.href = url
    downloadElement.download = `${name}` // 下载后文件名
    document.body.appendChild(downloadElement)
    downloadElement.click() // 点击下载
    document.body.removeChild(downloadElement) // 下载完成移除元素
  },
  // 创建上传的FormData
  createUploadFormData(target) {
    target = target || {}
    const formData = new FormData()
    // 向 formData 对象中添加文件
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        formData.append(key, target[key])
      }
    }
    return formData
  },
  // 直接下载链接
  downloadURL(URL, name) {
    const downloadElement = document.createElement('a')
    downloadElement.href = URL
    downloadElement.download = name // 下载后文件名
    document.body.appendChild(downloadElement)
    downloadElement.click() // 点击下载
    document.body.removeChild(downloadElement) // 下载完成移除元素
  }
}
