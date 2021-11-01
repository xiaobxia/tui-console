const LINK_MAP = [
  {
    name: '部门',
    type: '',
    componentName: 'addDepartDialog',
    deleteUrl: 'ucenter/dept/delete' // { ids: ids }
  }, {
    name: '往来单位',
    type: '1',
    componentName: 'addCurrentUnitDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // { ids }
  }, {
    name: '往来个人',
    type: '21',
    componentName: 'addCurrentUserDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '收入来源',
    type: '16',
    componentName: 'addIncomeSourceDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '拨款种类',
    type: '14',
    componentName: 'addGrantsTypeDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // { ids }
  }, {
    name: '资产分类',
    type: '6',
    componentName: 'addAssetClassificationDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '支付对象',
    type: '19',
    componentName: 'addReceiverDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '投资类型',
    type: '18',
    componentName: 'addInvestmentTypeDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '投资对象',
    type: '17',
    componentName: 'addInvestmentDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '功能科目',
    type: '7',
    componentName: 'addFunctionalSubjectDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '经济科目',
    type: '20',
    componentName: 'addEconomicSubjectDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '资金性质',
    type: '4',
    componentName: 'addFundsNatureDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '经费类型',
    type: '8',
    componentName: 'addFundsTypesDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '经费渠道',
    type: '13',
    componentName: 'addFundingChannelsDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '预算项目',
    type: '11',
    componentName: 'addBudgetsDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '经办机构',
    type: '5',
    componentName: 'addAgencyDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '指标来源',
    type: '9',
    componentName: 'addIndicatorsSourceDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '专项类型',
    type: '15',
    componentName: 'addSpecialTypesDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }, {
    name: '预算单位',
    type: '24',
    componentName: 'addBudgetUnitsDialog',
    deleteUrl: ''
  }, {
    name: '现金流量项目',
    type: '10',
    componentName: 'addCashFlowDialog',
    deleteUrl: 'ucenter/commonBasic/basicDelete' // ids
  }
]

export { LINK_MAP }
