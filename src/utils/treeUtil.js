function getTreeKeys(children, key, keys) {
  keys = keys || []
  for (let i = 0; i < children.length; i++) {
    const item = children[i]
    keys.push(item[key])
    if (item.children && item.children.length > 0) {
      getTreeKeys(item.children, key, keys)
    }
  }
  return keys
}
function getSubjectChildrenKeys(children, key, keys) {
  keys = keys || []
  for (let i = 0; i < children.length; i++) {
    const item = children[i]
    keys.push(item[key])
    if (item.childList && item.childList.length > 0) {
      getSubjectChildrenKeys(item.childList, key, keys)
    }
  }
  return keys
}

// 给定子级的key，返回父级的keys
function getParentKeys(list, key, value) {
  for (let i = 0; i < list.length; i++) {
    const keys = []
    getSubjectChildrenKeys([list[i]], key, keys)
    if (keys.indexOf(value) !== -1) {
      return keys.slice(0, keys.indexOf(value))
    }
  }
  return []
}

function sortTree(list) {
  list.sort((a, b) => {
    return a.sort - b.sort
  })
  list.forEach((v) => {
    if (v.children && v.children.length > 0) {
      sortTree(v.children)
    }
  })
}

function getChildren(children, key, value) {
  for (let i = 0; i < children.length; i++) {
    const item = children[i]
    item.children = item.children || []
    if (item[key] === value) {
      return item.children
    } else {
      const res = getChildren(item.children, key, value)
      if (res.length > 0) {
        return res
      }
    }
  }
  return []
}

function getBrother(children, key, value) {
  for (let i = 0; i < children.length; i++) {
    const item = children[i]
    item.children = item.children || []
    if (item[key] === value) {
      return children
    } else {
      const res = getBrother(item.children, key, value)
      if (res.length > 0) {
        return res
      }
    }
  }
  return []
}

export default {
  // 获取整个树的keys
  getTreeKeys,
  // 给定子级的key，返回父级的keys
  getParentKeys,
  sortTree,
  // 获取子集
  getChildren,
  // 获取兄弟
  getBrother
}
