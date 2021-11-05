export function createProductEditForm(tar) {
  let raw = {
    '_id': '',
    'name': '',
    'url': '',
    'icon_url': '',
    'min_quota': '',
    'max_quota': '',
    'term_unit': '',
    'min_term': '',
    'max_term': '',
    'daily_rate': '',
    'lending_time_unit': '',
    'lending_time': '',
    'zhi_ma': '',
    'success_rate': '',
    'is_recommend': '',
    'is_activity': '',
    'is_rotation': '',
    'status': '',
    'unit_price_daytime': '',
    'unit_price_nighttime': '',
    'startTime': '',
    'endTime': '',
    'sort': '',
    'introduction': '',
    'platform': '',
    'type': ''
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}
