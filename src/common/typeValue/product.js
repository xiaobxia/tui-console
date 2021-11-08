import { toTypeValueList, typeValueFormat } from '@/utils'

const PRODUCT_TYPE = [
  { v: 1, l: '现金贷' },
  { v: 2, l: '贷超' }
]

export default {
  /**
   * 产品类型
   */
  PRODUCT_TYPE_FORMAT: function(value) {
    return typeValueFormat(PRODUCT_TYPE, value)
  },
  PRODUCT_TYPE_LIST: toTypeValueList(PRODUCT_TYPE)
}
