import { toTypeValueList, typeValueFormat } from '@/utils'
// 工种
const WORK_TYPE = [
  { v: 1, l: '家务员' },
  { v: 2, l: '育儿嫂' },
  { v: 3, l: '养老护理' },
  { v: 4, l: '病患护理' },
  { v: 5, l: '钟点工' },
  { v: 6, l: '母婴护理' },
  { v: 7, l: '清洁保养' },
  { v: 8, l: '定时保姆' },
  { v: 9, l: '做饭师' }
]

// 劳动关系
const LABOR_RELATION = [
  { v: 1, l: '合同制' },
  { v: 2, l: '非合同制' }
]

// 工作状态
const WORK_STATUS = [
  { v: 1, l: '岗前培训' },
  { v: 2, l: '在岗' },
  { v: 3, l: '禁用' },
  { v: 4, l: '离职' }
]

// 学历
const EDUCATION = [
  { v: 1, l: '小学' },
  { v: 2, l: '初中' },
  { v: 3, l: '高中' },
  { v: 4, l: '大学专科' },
  { v: 5, l: '大学本科' },
  { v: 6, l: '硕士研究生' },
  { v: 7, l: '博士研究生' }
]

// 来源
const ORIGIN = [
  { v: 1, l: 'h5' },
  { v: 2, l: '网站' },
  { v: 3, l: 'ios' },
  { v: 4, l: 'android' },
  { v: 5, l: '电话' }
]

// 会员类别
const VIP_TYPE = [
  { v: 1, l: '普通' },
  { v: 2, l: 'vip会员' },
  { v: 3, l: '推客' },
  { v: 4, l: '星级' }
]

// 从业类别
const JOB_TYPE = [
  { v: 1, l: '保姆' },
  { v: 2, l: '保洁' },
  { v: 3, l: '搬家' }
]

// 证件类别
const CARD_TYPE = [
  { v: 1, l: '身份证' },
  { v: 2, l: '驾驶证' },
  { v: 3, l: '护照' }
]

export default {
  /**
   * 工种
   */
  WORK_TYPE_FORMAT: function(value) {
    return typeValueFormat(WORK_TYPE, value)
  },
  WORK_TYPE_LIST: toTypeValueList(WORK_TYPE),
  /**
   * 劳动关系
   */
  LABOR_RELATION_FORMAT: function(value) {
    return typeValueFormat(LABOR_RELATION, value)
  },
  LABOR_RELATION_LIST: toTypeValueList(LABOR_RELATION),
  /**
   * 工作状态
   */
  WORK_STATUS_FORMAT: function(value) {
    return typeValueFormat(WORK_STATUS, value)
  },
  WORK_STATUS_LIST: toTypeValueList(WORK_STATUS),
  /**
   * 学历
   */
  EDUCATION_FORMAT: function(value) {
    return typeValueFormat(EDUCATION, value)
  },
  EDUCATION_LIST: toTypeValueList(EDUCATION),
  /**
   * 来源
   */
  ORIGIN_FORMAT: function(value) {
    return typeValueFormat(ORIGIN, value)
  },
  ORIGIN_LIST: toTypeValueList(ORIGIN),
  /**
   * 会员类别
   */
  VIP_TYPE_FORMAT: function(value) {
    return typeValueFormat(VIP_TYPE, value)
  },
  VIP_TYPE_LIST: toTypeValueList(VIP_TYPE),
  /**
   * 从业类别
   */
  JOB_TYPE_FORMAT: function(value) {
    return typeValueFormat(CARD_TYPE, value)
  },
  JOB_TYPE_LIST: toTypeValueList(JOB_TYPE),
  /**
   * 证件类别
   */
  CARD_TYPE_FORMAT: function(value) {
    return typeValueFormat(CARD_TYPE, value)
  },
  CARD_TYPE_LIST: toTypeValueList(CARD_TYPE)
}
