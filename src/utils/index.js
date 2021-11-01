export function debounce(fn, delay) {
  let timer = null

  return function() {
    const args = arguments
    const context = this

    if (timer) {
      clearTimeout(timer)

      timer = setTimeout(function() {
        fn.apply(context, args)
      }, delay)
    } else {
      timer = setTimeout(function() {
        fn.apply(context, args)
      }, delay)
    }
  }
}

export function throttle(fn, delay) {
  const context = this
  var lastTime
  var timer
  return function() {
    var args = arguments
    var nowTime = Date.now()
    if (lastTime && nowTime - lastTime < delay) {
      clearTimeout(timer)
      timer = setTimeout(function() {
        lastTime = nowTime
        fn.apply(context, args)
      }, delay)
    } else {
      lastTime = nowTime
      fn.apply(context, args)
    }
  }
}

// 数组去重
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

// 判断外链
export function isExternal(path) {
  return /^(https?:|mailto:|tel:|\/#\/|\/([^/]*)\/#\/)/.test(path)
}

// 过滤补充对象中的字段
export function filterObject(tar, data) {
  const row = {}
  for (const key in tar) {
    if (data[key] !== undefined) {
      row[key] = data[key]
    } else {
      row[key] = tar[key]
    }
  }
  return row
}

// 枚举转换
export function toTypeValueList(raw) {
  const list = []
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i]
    list.push({
      value: item.v,
      label: item.l
    })
  }
  return list
}

export function typeValueFormat(list, value) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item.v === value) {
      return item.l
    }
  }
  return ''
}

// 给接口用的
export function listValueFormat(list, key, value) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item[key] === value) {
      return item
    }
  }
  return {}
}
