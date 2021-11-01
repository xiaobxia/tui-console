import store from '@/store'
import sysSetting from '@/setting'

function hasPerm(key) {
  if (sysSetting.permission) {
    const menu = store.getters.menuList
    for (let i = 0; i < menu.length; i++) {
      const item = menu[i]
      if (item === key || item.startsWith(key)) {
        return true
      }
    }
    return false
  } else {
    return true
  }
}

// 过滤权限
function filterPerm(keys) {
  return keys.filter((v) => {
    return hasPerm(v)
  })
}

export default {
  hasPerm,
  filterPerm,
  // tabs的第一个权限
  getTabsPerm(keys, raw) {
    raw = raw || ''
    const res = filterPerm(keys)
    if (res.indexOf(raw) === -1) {
      raw = res[0]
    }
    return raw
  }
}
