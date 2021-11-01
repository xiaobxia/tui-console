export default {
  // 经纬度
  formatLocation(row) {
    if (row.locationx && row.locationy) {
      return `${row.locationx} , ${row.locationy}`
    }
    return ''
  },
  // 经纬度
  formatLonLat(row) {
    if (row.longitude && row.latitude) {
      return `${row.longitude} , ${row.latitude}`
    }
    return ''
  },
  // 区域
  formatArea(row) {
    const list = []
    if (row.province) {
      list.push(row.province)
    }
    if (row.city) {
      list.push(row.city)
    }
    if (row.region) {
      list.push(row.region)
    }
    return list.join('-')
  }
}
