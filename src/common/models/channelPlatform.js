export function createChannelPlatformEditForm(tar) {
  let raw = {
    'channel_id': '',
    'platform_id': '',
    'code': '',
    'name': '',
    'deduction_base': 1,
    'unit_price_daytime': '',
    'unit_price_nighttime': '',
    'dayStartTime': '',
    'dayEndTime': '',
    'status': 1,
    '_id': '',
    dayTimeRange: [
      '00:00:00',
      '23:59:59'
    ]
  }
  if (tar) {
    raw = Object.assign(raw, tar)
    raw.timeRange = [raw.dayStartTime || '00:00:00', raw.dayEndTime || '23:59:59']
  }
  return raw
}
