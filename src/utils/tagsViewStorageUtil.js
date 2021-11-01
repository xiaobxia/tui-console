function formatKey(key) {
  return `tagsView-${key}`
}
function sessionStorageGetItem(key) {
  return sessionStorage.getItem(formatKey(key))
}
function sessionStorageSetItem(key, data) {
  return sessionStorage.setItem(formatKey(key), data)
}
function sessionStorageRemoveItem(key) {
  return sessionStorage.removeItem(formatKey(key))
}
const tagsViewStorageUtil = {
  getData: function(name) {
    let value = []
    const valueString = sessionStorageGetItem(name)
    if (valueString) {
      value = JSON.parse(valueString)
    }
    return value
  },
  setData: function(name, data) {
    sessionStorageSetItem(name, JSON.stringify(data))
  },
  clearAll: function() {
    window.sessionStorage.clear()
  },
  sessionStorageRemoveItem
}

export default tagsViewStorageUtil
