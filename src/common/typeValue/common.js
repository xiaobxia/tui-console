import { toTypeValueList, typeValueFormat } from '@/utils'

const SHIFOU_TYPE = [
  { v: true, l: '是' },
  { v: false, l: '否' }
]

export default {
  /**
   * 是否
   */
  SHIFOU_TYPE_FORMAT: function(value) {
    return typeValueFormat(SHIFOU_TYPE, value)
  },
  SHIFOU_TYPE_LIST: toTypeValueList(SHIFOU_TYPE)
}
