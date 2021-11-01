<template>
  <el-dialog
    :close-on-press-escape="false"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :width="printModel === 2 ? '1000px' : '1300px'"
    :before-close="close"
    title="凭证打印"
    destroy-on-close
  >
    <div class="print">
      <div class="btn-block">
        <!--        <div class="num">{{ currentPage + 1 }}/{{ tableData.length }}</div>-->
        <el-button type="primary" size="small" @click="changePage('first')">首张</el-button>
        <!--        <el-button type="primary" size="small" @click="changePage('prev')">上一张</el-button>-->
        <!--        <el-button-->
        <!--          type="primary"-->
        <!--          size="small"-->
        <!--          @click="changePage('next')">下一张-->
        <!--        </el-button>-->
        <el-button type="primary" size="small" @click="changePage('last')">末张</el-button>
      </div>
      <div v-if="dialogVisible" id="cert-content">
        <template v-if="printModel === 2">
          <div
            v-for="(item, index) in tableData"
            :key="index"
            :id="'cert' + index"
            :style="{'position': 'relative','minHeight': '47%','margin-bottom': '3%'}"
            style="box-sizing: border-box;margin: 0 0 0 30px"
            class="print-content"
          >
            <div
              v-for="(certDtl, certDtlIndex) in cut(item.certDtlVOList,5) || cut(item[0].certDtlVOList,5)"
              :key="certDtlIndex"
              :style="{'display': 'block', 'vertical-align':'inherit','min-height':'auto', 'width': '100%'}"
              class="print-cert"
            >
              <table style="width: 100%;border-spacing: 0">
                <thead>
                  <tr>
                    <td colspan="20" align="center">
                      <h3
                        style="text-align: center; margin: 5px 0; font-weight: 600;font-size: 24px;"
                      >财务会计凭证</h3>
                      <p
                        style="text-align: right; margin: 5px 0"
                      >附单据：{{ isNew ? item[0].attachNum : item.attachNum }}张</p>
                      <p
                        style="display: flex; align-items: center;justify-content: space-between; margin: 5px 0"
                      >
                        <span
                          style="display: inline-block;text-align: left;width: 43.5%;padding: 0 10px 0 0"
                        >
                          单位名称：{{
                            orgInfo.name
                          }}
                        </span>
                        <span
                          style="display: inline-block;text-align: left;width: 25%;padding: 0 5px 0 0"
                        >
                          {{
                            getDate(item.certDate || item[0].certDate)
                          }}
                        </span>
                        <span
                          style="display: inline-block;text-align: right;width: 31.5%;padding: 0"
                        >
                          <span>凭证号:</span>
                          第{{
                            item.certNo || item[0].certNo
                          }}号
                          <!-- 第{{ index+1 }}/{{
                            tableData.length
                          }}页 -->
                          第{{ certDtlIndex+1 }}/{{
                            (cut(item.certDtlVOList,5) || cut(item[0].certDtlVOList,5)).length + (item[1]?cut(item[1].certDtlVOList,5):[]).length
                          }}页
                      </span></p>
                    </td>
                  </tr>
                  <tr>
                    <th
                      v-for="(head, headIndex) in titleData"
                      :key="headIndex"
                      :style="{'border-width': headIndex ===0?'1px 1px 1px 1px' : '1px 1px 1px 0'}"
                      style="padding: 5px;border: 0px solid #DCDFE6;"
                    >{{ head.label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(line, lineIndex) in certDtl || item[0].certDtlVOList"
                    :key="lineIndex"
                  >
                    <td
                      v-for="(cell, cellIndex) in titleData"
                      :key="cellIndex"
                      :style="{'border-width': cellIndex === 0?'0px 1px 1px 1px' : '0px 1px 1px 0','width': cellIndex <= 1? '32%':'18%'}"
                      style="border: 0px solid #DCDFE6;height:59px;"
                    >
                      <div
                        :style="{'font-size':printModel === 2 && String(line.digest).split('').length > 30 ?'12px':'14px','textAlign': cell.prop === 'debit' || cell.prop === 'lender' ? 'right' : 'left', 'padding': '0 5px', 'minHeight': '26px','maxHeight': '59px'}"
                      >{{ getCell(line, cell.isNumber, cell.isSub, cell.prop) }}</div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="2"
                      style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 1px; text-align: left;"
                    >合计：{{ $digitUppercase(allCount[index].length > 1 ? Number(allCount[index][0]).toFixed(2) : Number(allCount[index]).toFixed(2)) }}</td>
                    <td
                      style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 0; text-align: right;font-size:12px;"
                    >{{ $formatMoneyRaw(allDebit[index].length > 1 ? Number(allDebit[index][0]).toFixed(2) : Number(allDebit[index]).toFixed(2)) }}</td>
                    <td
                      style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 0; text-align: right;font-size:12px;"
                    >
                      {{
                        $formatMoneyRaw(allLender[index].length > 1 ? Number(allLender[index][0]).toFixed(2) : Number(allLender[index]).toFixed(2))
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p
                style="display: flex; align-items: center;justify-content: space-between; margin: 5px 0"
              >
                <span style="display: inline-block;text-align: left;width: 25%;padding: 0 5px 0 0">
                  财务主管：{{
                    isNew ? item[0].cfoName : item.cfoName
                  }}
                </span>
                <span
                  style="display: inline-block;text-align: center;width: 25%;padding: 0 5px 0 0"
                >
                  记账：{{
                    isNew ? item[0].bookKeeper : item.bookKeeper
                  }}
                </span>
                <span
                  style="display: inline-block;text-align: center;width: 25%;padding: 0 5px 0 0"
                >
                  审核：{{
                    isNew ? item[0].verifyName : item.verifyName
                  }}
                </span>

                <!--              <span style="display: inline-block;text-align: left;width: 25%;padding: 0 5px 0 0">记账：{{-->
                <!--                item.length > 1 && isNew ? item[0].cashName : item.cashName-->
                <!--              }}</span>-->
                <span style="display: inline-block;text-align: right;width: 25%;padding: 0">
                  制单：{{
                    isNew ? item[0].creatName : item.creatName
                  }}
                </span>
              </p>
              <div v-if="index !== (cut(item.certDtlVOList,5) || cut(item[0].certDtlVOList,5)).length - 1" style="page-break-after:always;" />
            </div>
            <div
              v-if="item.length > 1 && printModel === 2"
              class="blank"
              style="width: 100%;height: 50px"
            />
            <template v-if="item.length > 1">
              <div
                v-for="(certDtl, certDtlIndex) in cut(item.certDtlVOList,5) || cut(item[1].certDtlVOList,5)"
                :key="'certDtlIndex_'+certDtlIndex"
                :style="{'display': 'block', 'vertical-align': 'inherit' , 'min-height': 'auto', 'width': '100%'}"
                class="print-cert"
              >
                <table style="width: 100%;border-spacing: 0">
                  <thead>
                    <tr>
                      <td colspan="20" align="center">
                        <h3 style="text-align: center; margin: 5px 0;font-size: 24px;">预算会计凭证</h3>
                        <p style="text-align: right; margin: 5px 0">附单据：{{ item[1].attachNum }}张</p>
                        <p
                          style="display: flex; align-items: center;justify-content: space-between; margin: 5px 0"
                        >
                          <span
                            style="display: inline-block;text-align: left;width: 43.5%;padding: 0 10px 0 0"
                          >
                            单位名称：{{
                              orgInfo.name
                            }}
                          </span>
                          <span
                            style="display: inline-block;text-align: left;width: 25%;padding: 0 5px 0 0"
                          >
                            {{
                              getDate(item[1].certDate)
                            }}
                          </span>
                          <span
                            style="display: inline-block;text-align: right;width: 31.5%;padding: 0"
                          >
                            <span>凭证号:</span>
                            第{{
                              item[1].certNo
                            }}号
                            <!-- 第{{ index+1 }}/{{
                              tableData.length
                            }}页 -->
                            第{{ certDtlIndex+1+cut(item[0].certDtlVOList,5).length }}/{{
                              (cut(item.certDtlVOList,5) || cut(item[0].certDtlVOList,5)).length + (item[1]?cut(item[1].certDtlVOList,5):[]).length
                            }}页
                          </span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <th
                        v-for="(head, headIndex) in titleData"
                        :key="headIndex"
                        :style="{'border-width': headIndex ===0?'1px 1px 1px 1px' : '1px 1px 1px 0'}"
                        style="padding: 5px;border: 0px solid #DCDFE6;"
                      >{{ head.label }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(line, lineIndex) in certDtl || item[1].certDtlVOList"
                      :key="lineIndex"
                    >
                      <td
                        v-for="(cell, cellIndex) in titleData"
                        :key="cellIndex"
                        :style="{'border-width': cellIndex === 0?'0px 1px 1px 1px' : '0px 1px 1px 0','width': cellIndex <= 1? '32%':'18%'}"
                        style="padding: 5px;border: 0px solid #DCDFE6;height:59px;"
                      >
                        <div
                          :style="{'font-size':printModel === 2 && String(line.digest).split('').length > 30 ?'12px':'14px','textAlign': cell.prop === 'debit' || cell.prop === 'lender' ? 'right' : 'left', 'padding': '0 5px', 'minHeight': '26px','maxHeight': '59px'}"
                        >{{ getCell(line, cell.isNumber, cell.isSub, cell.prop) }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td
                        colspan="2"
                        style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 1px; text-align: left;"
                      >合计：{{ $digitUppercase(allCount[index][1]?Number(allCount[index][1]).toFixed(2) : 0) }}</td>
                      <td
                        style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 0; text-align: right;font-size:12px;"
                      >{{ _formatStandardCurrencyZero(Number(allDebit[index][1]).toFixed(2)) }}</td>
                      <td
                        style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 0; text-align: right;font-size:12px;"
                      >{{ _formatStandardCurrencyZero(Number(allLender[index][1]).toFixed(2)) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p
                  style="display: flex; align-items: center;justify-content: space-between; margin: 5px 0"
                >
                  <span
                    style="display: inline-block;text-align: left;width: 25%;padding: 0 5px 0 0"
                  >
                    财务主管：{{
                      item[1].cfoName
                    }}
                  </span>
                  <span
                    style="display: inline-block;text-align: center;width: 25%;padding: 0 5px 0 0"
                  >
                    记账：{{
                      item[1].bookKeeper
                    }}
                  </span>
                  <span
                    style="display: inline-block;text-align: center;width: 25%;padding: 0 5px 0 0"
                  >
                    审核：{{
                      item[1].verifyName
                    }}
                  </span>
                  <span style="display: inline-block;text-align: right;width: 25%;padding: 0">
                    制单：{{
                      item[1].creatName
                    }}
                  </span>
                </p>
                <div v-if="index !== (cut(item.certDtlVOList,5) || cut(item[0].certDtlVOList,5)).length - 1" style="page-break-after:always;" />
              </div>
            </template>
          </div>
        </template>
        <template v-if="printModel === 1">
          <template v-if="isNew">
            <div
              v-for="(item, index) in tableData"
              :key="index"
              :id="'cert' + index"
              :style="{'position': 'relative','minHeight': '50%'}"
              style="box-sizing: border-box;margin: 0 0 0 30px"
              class="print-content"
            >
              <div
                v-for="(certDtl, certDtlIndex) in cut_copy(item,6)"
                :key="certDtlIndex"
                :style="{'display': 'block', 'vertical-align':'inherit','min-height':'auto', 'width': '100%'}"
                class="print-cert"
              >
                <h3
                  style="text-align: center; margin: 5px 0; font-weight: 600;font-size: 24px;"
                >记账凭证</h3>
                <p
                  style="display: flex; align-items: center;justify-content: space-between; margin: 5px 0"
                >
                  <span
                    style="display: inline-block;padding: 0 10px 0 0"
                  >
                    单位名称：{{
                      orgInfo.name
                    }}
                  </span>
                  <span
                    style="display: inline-block;position: absolute;left: 50%;margin-left: -70px;width: 140px;text-align: center;"
                  >
                    {{
                      getDate(item.certDate || item[0].certDate)
                    }}
                  </span>
                  <span style="display: inline-block;padding: 0 10px;">附单据：{{ isNew ? item[0].attachNum : item.attachNum }}张</span>
                </p>
                <div v-if="+bookInfo.certType == 1" style="text-align: right;">
                  <span style="display: inline-block;padding: 0">
                    <span>
                      凭证号: 第{{
                        item.certNo || item[0].certNo
                      }}号
                    </span>
                  </span>
                  <span style="margin: 5px 0">第{{ certDtlIndex+1 }}/{{ cut_copy(item,6).length }}页</span>
                </div>
                <div v-if="+bookInfo.certType == 2" style="display: flex;">
                  <p
                    style="width:50%;text-align:right;margin: 5px 0"
                  >
                    <span style="display: inline-block;text-align: right;padding: 0">
                      <span>
                        凭证号: 第{{
                          item[0].certNo
                        }}号
                      </span>
                  </span></p>
                  <p
                    style="width:43%;text-align:right;margin: 5px 0"
                  >
                    <span style="display: inline-block;text-align: right;padding: 0">
                      <span>
                        凭证号: 第{{
                          item[1].certNo
                        }}号
                      </span>
                  </span></p>
                  <span style="width:7%;text-align:right;margin: 5px 0">第{{ certDtlIndex+1 }}/{{ cut_copy(item,6).length }}页</span>
                </div>
                <div style="display:flex;">
                  <table style="width: 50%;border-spacing: 0">
                    <thead>
                      <tr>
                        <th colspan="8" style="padding: 5px;border-color:#DCDFE6;border-style: solid;border-width: 1px 1px 0 1px;">财务会计</th>
                      </tr>
                      <tr>
                        <th
                          v-for="(head, headIndex) in titleData"
                          :key="headIndex"
                          :style="{'border-width': headIndex ===0?'1px 1px 1px 1px' : '1px 1px 1px 0'}"
                          style="padding: 5px;border: 0px solid #DCDFE6;"
                        >{{ head.label }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(line, lineIndex) in certDtl[0]"
                        :key="lineIndex"
                      >
                        <td
                          v-for="(cell, cellIndex) in titleData"
                          :key="cellIndex"
                          :style="{'border-width': cellIndex === 0?'0px 1px 1px 1px' : '0px 1px 1px 0','width': cellIndex <= 1? '32%':'18%'}"
                          style="border: 0px solid #DCDFE6;"
                        >
                          <div
                            :style="{'font-size':printModel === 2 && String(line.digest).split('').length > 30 ?'12px':'14px','textAlign': cell.prop === 'debit' || cell.prop === 'lender' ? 'right' : 'left', 'minHeight': '26px','height': '75px','display':cellIndex <= 1? 'flex': 'block','alignItems':cellIndex <= 1? 'center':'none','lineHeight': cellIndex <= 1? 'inherit':'75px'}"
                          >{{ getCell(line, cell.isNumber, cell.isSub, cell.prop) }}</div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          colspan="2"
                          style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 1px; text-align: left;"
                        >合计：{{ $digitUppercase(allCount[index].length > 1 ? Number(allCount[index][0]).toFixed(2) : Number(allCount[index]).toFixed(2)) }}</td>
                        <td
                          style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 0; text-align: right;font-size:12px;"
                        >{{ _formatStandardCurrencyZero(allDebit[index].length > 1 ? Number(allDebit[index][0]).toFixed(2) : Number(allDebit[index]).toFixed(2)) }}</td>
                        <td
                          style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 0; text-align: right;font-size:12px;"
                        >
                          {{
                            _formatStandardCurrencyZero(allLender[index].length > 1 ? Number(allLender[index][0]).toFixed(2) : Number(allLender[index]).toFixed(2))
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table style="width: 50%;border-spacing: 0">
                    <thead>
                      <tr>
                        <th colspan="8" style="padding: 5px;border-color:#DCDFE6;border-style: solid;border-width: 1px 1px 0 0px;">预算会计</th>
                      </tr>
                      <tr>
                        <th
                          v-for="(head, headIndex) in titleData"
                          :key="headIndex"
                          :style="{'border-width': headIndex ===0?'1px 1px 1px 0px' : '1px 1px 1px 0'}"
                          style="padding: 5px;border: 0px solid #DCDFE6;"
                        >{{ head.label }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(line, lineIndex) in certDtl[1]" :key="lineIndex">
                        <td
                          v-for="(cell, cellIndex) in titleData"
                          :key="cellIndex"
                          :style="{'border-width': '0px 1px 1px 0','width': cellIndex <= 1? '32%':'18%'}"
                          style="border: 0px solid #DCDFE6;"
                        >
                          <div
                            :style="{'font-size':printModel === 2 && String(line.digest).split('').length > 30 ?'12px':'14px','textAlign': cell.prop === 'debit' || cell.prop === 'lender' ? 'right' : 'left', 'minHeight': '26px','height': '75px','display':cellIndex <= 1? 'flex': 'block','alignItems':cellIndex <= 1? 'center':'none','lineHeight': cellIndex <= 1? 'inherit':'75px'}"
                          >{{ getCell(line, cell.isNumber, cell.isSub, cell.prop) }}</div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          colspan="2"
                          style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 0px; text-align: left;"
                        >合计：{{ $digitUppercase(allCount[index].length > 1 ? Number(allCount[index][1]).toFixed(2) : Number(allCount[index]).toFixed(2)) }}</td>
                        <td
                          style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 0; text-align: right;font-size:12px;"
                        >{{ _formatStandardCurrencyZero(allDebit[index].length > 1 ? Number(allDebit[index][1]).toFixed(2) : Number(allDebit[index]).toFixed(2)) }}</td>
                        <td
                          style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 0; text-align: right;font-size:12px;"
                        >
                          {{
                            _formatStandardCurrencyZero(allLender[index].length > 1 ? Number(allLender[index][1]).toFixed(2) : Number(allLender[index]).toFixed(2))
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p
                  style="display: flex; align-items: center;justify-content: space-between; margin: 5px 0"
                >
                  <span
                    style="display: inline-block;text-align: left;width: 25%;padding: 0 5px 0 0"
                  >
                    财务主管：{{
                      isNew ? item[0].cfoName : item.cfoName
                    }}
                  </span>
                  <span
                    style="display: inline-block;text-align: center;width: 25%;padding: 0 5px 0 0"
                  >
                    记账：{{
                      isNew ? item[0].bookKeeper : item.bookKeeper
                    }}
                  </span>
                  <span
                    style="display: inline-block;text-align: center;width: 25%;padding: 0 5px 0 0"
                  >
                    审核：{{
                      isNew ? item[0].verifyName : item.verifyName
                    }}
                  </span>
                  <span style="display: inline-block;text-align: right;width: 25%;padding: 0">
                    制单：{{
                      isNew ? item[0].creatName : item.creatName
                    }}
                  </span>
                </p>
                <div v-if="index !== cut_copy(item,6).length - 1" style="page-break-after:always;" />
              </div>
            </div>
          </template>
          <template v-else>
            <div
              v-for="(item, index) in tableData"
              :key="index"
              :id="'cert' + index"
              :style="{'position': 'relative','minHeight': '50%'}"
              style="box-sizing: border-box;margin: 0 0 0 30px"
              class="print-content"
            >
              <div
                v-for="(certDtl, certDtlIndex) in cut(item.certDtlVOList,6) || cut(item[0].certDtlVOList,6)"
                :key="certDtlIndex"
                :style="{'display': 'block', 'vertical-align':'inherit','min-height':'auto', 'width': '100%'}"
                class="print-cert"
              >
                <table style="width: 100%;border-spacing: 0">
                  <thead>
                    <tr>
                      <td colspan="20" align="center">
                        <h3
                          style="text-align: center; margin: 5px 0; font-weight: 600;font-size: 24px;"
                        >记账凭证</h3>
                        <p
                          style="text-align: right; margin: 5px 0"
                        >附单据：{{ isNew ? item[0].attachNum : item.attachNum }}张</p>
                        <p
                          style="display: flex; align-items: center;justify-content: space-between; margin: 5px 0"
                        >
                          <span
                            style="display: inline-block;text-align: left;width: 43.5%;padding: 0 10px 0 0"
                          >
                            单位名称：{{
                              orgInfo.name
                            }}
                          </span>
                          <span
                            style="display: inline-block;text-align: left;width: 25%;padding: 0 5px 0 0"
                          >
                            {{
                              getDate(item.certDate || item[0].certDate)
                            }}
                          </span>
                          <span
                            style="display: inline-block;text-align: right;width: 31.5%;padding: 0"
                          >
                            凭证号:
                            第{{
                              item.certNo || item[0].certNo
                            }}号
                          </span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <th
                        v-for="(head, headIndex) in titleData"
                        :key="headIndex"
                        :style="{'border-width': headIndex ===0?'1px 1px 1px 1px' : '1px 1px 1px 0'}"
                        style="padding: 5px;border: 0px solid #DCDFE6;"
                      >{{ head.label }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(line, lineIndex) in certDtl || item[0].certDtlVOList"
                      :key="lineIndex"
                    >
                      <td
                        v-for="(cell, cellIndex) in titleData"
                        :key="cellIndex"
                        :style="{'border-width': cellIndex === 0?'0px 1px 1px 1px' : '0px 1px 1px 0','width': cellIndex <= 1? '32%':'18%'}"
                        style="border: 0px solid #DCDFE6;"
                      >
                        <div
                          :style="{'font-size':printModel === 2 && String(line.digest).split('').length > 30 ?'12px':'14px','textAlign': cell.prop === 'debit' || cell.prop === 'lender' ? 'right' : 'left', 'minHeight': '26px','height': '75px','display':cellIndex <= 1? 'flex': 'block','alignItems':cellIndex <= 1? 'center':'none','lineHeight': cellIndex <= 1? 'inherit':'75px'}"
                        >{{ getCell(line, cell.isNumber, cell.isSub, cell.prop) }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td
                        colspan="2"
                        style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 1px; text-align: left;"
                      >合计：{{ $digitUppercase(allCount[index].length > 1 ? Number(allCount[index][0]).toFixed(2) : Number(allCount[index]).toFixed(2)) }}</td>
                      <td
                        style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 0; text-align: right;font-size:12px;"
                      >{{ _formatStandardCurrencyZero(allDebit[index].length > 1 ? Number(allDebit[index][0]).toFixed(2) : Number(allDebit[index]).toFixed(2)) }}</td>
                      <td
                        style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 0; text-align: right;font-size:12px;"
                      >
                        {{
                          _formatStandardCurrencyZero(allLender[index].length > 1 ? Number(allLender[index][0]).toFixed(2) : Number(allLender[index]).toFixed(2))
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p
                  style="display: flex; align-items: center;justify-content: space-between; margin: 5px 0"
                >
                  <span
                    style="display: inline-block;text-align: left;width: 25%;padding: 0 5px 0 0"
                  >
                    财务主管：{{
                      isNew ? item[0].cfoName : item.cfoName
                    }}
                  </span>
                  <span
                    style="display: inline-block;text-align: center;width: 25%;padding: 0 5px 0 0"
                  >
                    记账：{{
                      isNew ? item[0].bookKeeper : item.bookKeeper
                    }}
                  </span>
                  <span
                    style="display: inline-block;text-align: center;width: 25%;padding: 0 5px 0 0"
                  >
                    审核：{{
                      isNew ? item[0].verifyName : item.verifyName
                    }}
                  </span>
                  <!--              <span style="display: inline-block;text-align: left;width: 25%;padding: 0 5px 0 0">记账：{{-->
                  <!--                item.length > 1 && isNew ? item[0].cashName : item.cashName-->
                  <!--              }}</span>-->
                  <span style="display: inline-block;text-align: right;width: 25%;padding: 0">
                    制单：{{
                      isNew ? item[0].creatName : item.creatName
                    }}
                  </span>
                </p>
                <!-- <div v-if="printModel === 1" style="page-break-after:always;" /> -->
                <div v-if="index !== (cut(item.certDtlVOList,6) || cut(item[0].certDtlVOList,6)).length - 1" style="page-break-after:always;" />
              </div>
              <div
                v-if="item.length > 1 && printModel === 2"
                class="blank"
                style="width: 100%;height: 50px"
              />
              <template v-if="item.length > 1">
                <div
                  v-for="(certDtl, certDtlIndex) in cut(item.certDtlVOList,6) || cut(item[1].certDtlVOList,6)"
                  :key="'certDtlIndex_'+certDtlIndex"
                  :style="{'display': 'block', 'vertical-align': 'inherit' , 'min-height': 'auto', 'width': '100%'}"
                  class="print-cert"
                >
                  <table style="width: 100%;border-spacing: 0">
                    <thead>
                      <tr>
                        <td colspan="20" align="center">
                          <h3 style="text-align: center; margin: 5px 0;font-size: 24px;">预算会计凭证</h3>
                          <p style="text-align: right; margin: 5px 0">附单据：{{ item[1].attachNum }}张</p>
                          <p
                            style="display: flex; align-items: center;justify-content: space-between; margin: 5px 0"
                          >
                            <span
                              style="display: inline-block;text-align: left;width: 43.5%;padding: 0 10px 0 0"
                            >
                              单位名称：{{
                                orgInfo.name
                              }}
                            </span>
                            <span
                              style="display: inline-block;text-align: left;width: 25%;padding: 0 5px 0 0"
                            >
                              {{
                                getDate(item[1].certDate)
                              }}
                            </span>
                            <span
                              style="display: inline-block;text-align: right;width: 31.5%;padding: 0"
                            >
                              <span v-if="isNew && +bookInfo.certType === 2">凭证号:</span>
                              第{{
                                item[1].certNo
                              }}号
                            </span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <th
                          v-for="(head, headIndex) in titleData"
                          :key="headIndex"
                          :style="{'border-width': headIndex ===0?'1px 1px 1px 1px' : '1px 1px 1px 0'}"
                          style="padding: 5px;border: 0px solid #DCDFE6;"
                        >{{ head.label }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(line, lineIndex) in certDtl || item[1].certDtlVOList"
                        :key="lineIndex"
                      >
                        <td
                          v-for="(cell, cellIndex) in titleData"
                          :key="cellIndex"
                          :style="{'border-width': cellIndex === 0?'0px 1px 1px 1px' : '0px 1px 1px 0','width': cellIndex <= 1? '32%':'18%'}"
                          style="padding: 5px;border: 0px solid #DCDFE6;"
                        >
                          <div
                            :style="{'font-size':printModel === 2 && String(line.digest).split('').length > 30 ?'12px':'14px','textAlign': cell.prop === 'debit' || cell.prop === 'lender' ? 'right' : 'left', 'minHeight': '26px','height': '75px','display':cellIndex <= 1? 'flex': 'block','alignItems':cellIndex <= 1? 'center':'none','lineHeight': cellIndex <= 1? 'inherit':'75px'}"
                          >{{ getCell(line, cell.isNumber, cell.isSub, cell.prop) }}</div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          colspan="2"
                          style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 1px; text-align: left;"
                        >合计：{{ $digitUppercase(allCount[index][1]? Number(allCount[index][1]).toFixed(2): 0) }}</td>
                        <td
                          style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 0; text-align: right;font-size:12px;"
                        >{{ _formatStandardCurrencyZero(Number(allDebit[index][1]).toFixed(2)) }}</td>
                        <td
                          style="padding: 5px;border: 0px solid #DCDFE6; border-width: 0 1px 1px 0; text-align: right;font-size:12px;"
                        >{{ _formatStandardCurrencyZero(Number(allLender[index][1]).toFixed(2)) }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p
                    style="display: flex; align-items: center;justify-content: space-between; margin: 5px 0"
                  >
                    <span
                      style="display: inline-block;text-align: left;width: 25%;padding: 0 5px 0 0"
                    >
                      财务主管：{{
                        item[1].cfoName
                      }}
                    </span>
                    <span
                      style="display: inline-block;text-align: center;width: 25%;padding: 0 5px 0 0"
                    >
                      记账：{{
                        item[1].bookKeeper||''
                      }}
                    </span>
                    <span
                      style="display: inline-block;text-align: center;width: 25%;padding: 0 5px 0 0"
                    >
                      审核：{{
                        item[1].verifyName
                      }}
                    </span>
                    <span style="display: inline-block;text-align: right;width: 25%;padding: 0">
                      制单：{{
                        item[1].creatName
                      }}
                    </span>
                  </p>
                  <!-- <div v-if="printModel === 1" style="page-break-after:always;" /> -->
                  <div v-if="index !== (cut(item.certDtlVOList,6) || cut(item[0].certDtlVOList,6)).length - 1" style="page-break-after:always;" />
                </div>
              </template>
            </div>
          </template>
        </template>
      </div>
    </div>
    <div slot="footer" class="foot">
      <div class="setting">
        <el-radio-group v-model="printModel">
          <el-radio :label="1">横向打印</el-radio>
          <el-radio :label="2">纵向打印</el-radio>
        </el-radio-group>
      </div>
      <div class="foot-btn">
        <el-button size="small" @click="close">关闭</el-button>
        <el-button size="small" type="primary" @click="print">打印</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import commonMixins from '@/mixins/common'
import moment from 'moment'
export default {
  name: 'PrintCert',
  mixins: [commonMixins],
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      titleData: [],
      title: '',
      currentPage: 0,
      allCount: [],
      allDebit: [],
      allLender: [],
      printWithMerge: false, // 合并同科目同摘要同资金方向的数据
      printWithAst: false, // 显示辅助项
      printWithUnitPrice: false, // 打印单价
      printWithRate: false, // 打印汇率
      printWithoutSubCode: false, // 显示科目编码
      printModel: 2
      // disablePrev: false,
      // disableNext: false
    }
  },
  computed: {
    ...mapGetters(['bookInfo', 'orgInfo', 'sysParam']),
    isNew() {
      return +this.bookInfo.isNewAccounts === 1
    }
  },
  created() {
    console.log(this.bookInfo)
  },
  methods: {
    log(arr) {
      console.log(arr)
      return []
    },
    cut(array, subGroupLength, fill = true) {
      if (!Array.isArray(array)) {
        return false
      }
      let index = 0
      const newArray = []
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)))
      }
      if (fill) {
        for (let i = 0; i < newArray.length; i++) {
          const len = newArray[i].length
          if (len < subGroupLength) {
            for (let j = subGroupLength - len; j--; j > 0) {
              newArray[i].push({})
            }
          }
        }
      }
      return newArray
    },
    cut_copy(array, subGroupLength, fill = true) {
      console.log(array)
      if (!Array.isArray(array)) {
        return false
      }
      let index = 0
      const newArray = []
      while (index < array[0].certDtlVOList.length || (array.length > 1 ? index < array[1].certDtlVOList.length : false)) {
        newArray.push([array[0].certDtlVOList.slice(index, (index + subGroupLength)), array.length > 1 ? array[1].certDtlVOList.slice(index, (index + subGroupLength)) : []])
        index += subGroupLength
      }

      if (fill) {
        for (let i = 0; i < newArray.length; i++) {
          for (let y = 0; y < newArray[i].length; y++) {
            const len = newArray[i][y].length
            if (len < subGroupLength) {
              for (let j = subGroupLength - len; j--; j > 0) {
                newArray[i][y].push({})
              }
            }
          }
        }
      }
      return newArray
    },
    close() {
      this.dialogVisible = false
    },
    open(data) {
      this.tableData = data.tableData
      this.titleData = data.titleData
      this.title = data.title
      this.currentPage = 0
      this.printModel = 2
      this.getPrintConfig()
      if (this.printWithAst) {
        this.formatDataWithAst()
      }
      if (this.printWithMerge) {
        this.formatDataWithMerge()
      }
      this.getCount()
      this.dialogVisible = true
    },
    // 当需要打印辅助项时，将一条明细根据辅助项明细条数拆分
    formatDataWithAst() {
      let tableData = this.tableData
      const list = []
      if (this.isNew) {
        // 新政府
        if (this.tableData[0].cert) {
          // 双凭证转格式
          tableData = this.tableData.map(item => item.cert)
        }
      }
      tableData.forEach((tableItem, TableIndex) => {
        // 遍历表格
        if (tableItem.certDtlVOList && tableItem.certDtlVOList.length) {
          // 该表格有明细
          const dtlList = [] // 构建新的明细数据
          tableItem.certDtlVOList.forEach((dtlItem, dtlIndex) => {
            // 遍历原有明细
            if (dtlItem.hsCertDtlAstList && dtlItem.hsCertDtlAstList.length) {
              // 该明细有辅助项时，根据辅助项条数重新构建明细数据
              dtlItem.hsCertDtlAstList.forEach((astItem, astIndex) => {
                // 遍历辅助项数据
                dtlList.push({
                  ...dtlItem,
                  hsCertDtlAstList: [astItem],
                  debit: +dtlItem.debit > 0 ? +astItem.money : 0,
                  lender: +dtlItem.lender > 0 ? +astItem.money : 0
                })
              })
            } else {
              // 没有辅助项的直接插入
              dtlList.push(dtlItem)
            }
          })
          tableItem.certDtlVOList = dtlList
          list.push(tableItem)
        } else {
          list.push(tableItem)
        }
      })
      // 覆盖原有表格数据
      if (this.isNew) {
        // 新政府
        if (this.tableData[0].cert) {
          this.tableData = tableData.reduce((arr, item) => {
            arr.push({ cert: item })
            return arr
          }, [])
        } else {
          this.tableData = tableData
        }
      } else {
        this.tableData = tableData
      }
      console.log(this.tableData)
    },
    // 合并同科目数据
    formatDataWithMerge() {
      let tableData = this.tableData
      if (this.isNew) {
        // 新政府
        if (this.tableData[0].cert) {
          // 双凭证转格式
          tableData = this.tableData.map(item => item.cert)
        }
      }
      tableData.forEach((tableItem, tableIndex) => {
        const dtlObj = {} // 构建新的明细数据
        if (tableItem.certDtlVOList && tableItem.certDtlVOList.length) {
          // 该表格有明细
          tableItem.certDtlVOList.forEach((dtlItem, dtlIndex) => {
            const isDebit = +dtlItem.debit > 0 && +dtlItem.lender === 0
            const isLender = +dtlItem.lender > 0 && +dtlItem.debit === 0
            let key = dtlItem.digest + dtlItem.subId // 拼接摘要和科目id作为key
            if (
              this.printWithAst &&
              dtlItem.hsCertDtlAstList &&
              dtlItem.hsCertDtlAstList.length
            ) {
              // 显示辅助项且包含辅助项
              dtlItem.hsCertDtlAstList.forEach((astItem, astIndex) => {
                let astId = ''
                Object.values(astItem.astMap).forEach(e => {
                  astId += e.hisAstDtlId // 若包含辅助项将辅助项id拼进key中
                })
                key += astId
              })
            }
            key += isDebit ? 'debit' : isLender ? 'lender' : 'blank' // 收入支出或空数据
            if (dtlObj[key] && dtlObj[key].phid) {
              // 已有相同的分录
              if (isDebit) {
                // 同科目同摘要的支出
                dtlObj[key].debit = +dtlObj[key].debit + +dtlItem.debit
              }
              if (isLender) {
                // 同科目通摘要的收入
                dtlObj[key].lender = +dtlObj[key].lender + +dtlItem.lender
              }
            } else {
              dtlObj[key] = dtlItem
            }
          })
          tableItem.certDtlVOList = Object.values(dtlObj)
        }
      })
    },
    // 准备构造合计行数据
    getCount() {
      this.allCount = []
      this.allDebit = []
      this.allLender = []
      if (this.isNew) {
        // 新政府
        if (this.tableData[0].cert) {
          this.tableData = this.tableData.map(item => item.cert)
          this.formatPrintDataWithDoubleCert()
        } else {
          this.formatPrintDataWithSingleCert()
        }
      } else {
        // 未开新政府单
        this.formatPrintDataWithSingleCert()
      }
    },
    // 格式化单凭证打印合计数据
    formatPrintDataWithSingleCert() {
      let allCount = 0
      let allDebit = 0
      let allLender = 0
      this.tableData.forEach((tableItem, tableIndex) => {
        allCount = 0
        allDebit = 0
        allLender = 0
        tableItem.certDtlVOList.length &&
          tableItem.certDtlVOList.forEach(item => {
            allCount += item.debit ? +item.debit : 0
            allDebit += item.debit ? +item.debit : 0
            allLender += +item.lender ? +item.lender : 0
          })
        if (tableItem.certDtlVOList && tableItem.certDtlVOList.length < 4) {
          // 不足4条，补全
          const len = 4 - tableItem.certDtlVOList.length
          for (let i = 0; i < len; i++) {
            tableItem.certDtlVOList.push({})
          }
        }
        this.allCount.push(allCount)
        this.allDebit.push(allDebit)
        this.allLender.push(allLender)
      })
    },
    // 格式化双凭证打印合计数据
    formatPrintDataWithDoubleCert() {
      let allCount = [0, 0]
      let allDebit = [0, 0]
      let allLender = [0, 0]
      const dataList = []
      // 若有未填，剔除未填写的凭证
      this.tableData.forEach(item => {
        const eleList = []
        item.forEach(ele => {
          if (ele.phid) {
            eleList.push(ele)
          } else {
            eleList.push({})
          }
        })
        dataList.push(eleList)
      })
      this.tableData = dataList
      console.log(this.tableData, 'this.tableData')
      this.tableData.forEach((tableItem, tableIndex) => {
        allCount = new Array(tableItem.length).fill(0)
        allDebit = new Array(tableItem.length).fill(0)
        allLender = new Array(tableItem.length).fill(0)
        tableItem.forEach((dtlItem, eleIndex) => {
          dtlItem.certDtlVOList &&
            dtlItem.certDtlVOList.length &&
            dtlItem.certDtlVOList.forEach((item, index) => {
              allCount[eleIndex] += item.debit ? +item.debit : 0
              allDebit[eleIndex] += item.debit ? +item.debit : 0
              allLender[eleIndex] += item.lender ? +item.lender : 0
            })
          if (dtlItem.certDtlVOList && dtlItem.certDtlVOList.length < 4) {
            // 不足4条，补全
            const len = 4 - dtlItem.certDtlVOList.length
            for (let i = 0; i < len; i++) {
              dtlItem.certDtlVOList.push({})
            }
          }
          if (!dtlItem.certDtlVOList) {
            // 没有的话就插入四条
            dtlItem.certDtlVOList = []
            for (let i = 0; i < 4; i++) {
              dtlItem.certDtlVOList.push({})
            }
          }
        })
        this.allCount.push(allCount)
        this.allDebit.push(allDebit)
        this.allLender.push(allLender)
      })
    },
    // 打印
    print() {
      this.$newPrint('cert-content')
    },
    // 换页
    changePage(type) {
      type === 'first' && (location.href = '#cert0')
      type === 'prev' &&
        this.currentPage > 0 &&
        (location.href = `#cert${this.currentPage--}`) &&
        (this.disablePrev = false) &&
        (this.disableNext = false)
      type === 'next' &&
        this.currentPage <= this.tableData.length - 1 &&
        (location.href = `#cert${this.currentPage++}`)
      type === 'last' && (location.href = `#cert${this.tableData.length - 1}`)
    },
    // 转日期
    getDate(date) {
      return moment(date).format('YYYY年MM月DD日')
    },
    // 获取打印参数
    getPrintConfig() {
      this.printWithMerge = this.sysParam.printSetting
        ? this.sysParam.printSetting.includes('1')
        : false
      this.printWithAst = this.sysParam.printSetting
        ? this.sysParam.printSetting.includes('2')
        : false
      this.printWithUnitPrice = this.sysParam.printSetting
        ? this.sysParam.printSetting.includes('3')
        : false
      this.printWithRate = this.sysParam.printSetting
        ? this.sysParam.printSetting.includes('4')
        : false
      this.printWithoutSubCode = this.sysParam.printSetting
        ? this.sysParam.printSetting.includes('5')
        : false
    },
    // 转格式
    getCell(line, isNumber, isSub, prop) {
      if (isSub) {
        // 是科目数据
        if (line.subName) {
          // 有科目
          const subLabel = line.subName
          const subCode = `【${line.subCode}】`
          let astLabel = ''
          let returnData = ''
          if (!this.printWithoutSubCode) {
            returnData = subCode + subLabel // 打印编码
          } else {
            returnData = subLabel
          }
          if (this.printWithAst) {
            line.hsCertDtlAstList &&
              line.hsCertDtlAstList.length &&
              line.hsCertDtlAstList.forEach((item, index) => {
                // 取辅助项的值
                Object.values(item.astMap).forEach((ele, eIndex) => {
                  astLabel = astLabel + ele.dtlCode
                  if (eIndex < Object.values(item.astMap).length - 1) {
                    astLabel = astLabel + '-'
                  }
                })
                if (index < line.hsCertDtlAstList.length - 1) {
                  astLabel = astLabel + '-'
                }
              })
            returnData = line.hsCertDtlAstList
              ? returnData + '-' + astLabel
              : returnData
          }
          return returnData
        } else {
          // 补全行数的空数据
          return ''
        }
      } else if (isNumber) {
        // 是数字
        return this._formatStandardCurrencyEmpty(line[prop])
      } else {
        return line[prop]
      }
    }
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.print {
  position: relative;
  //max-height: 750px;
  overflow-x: hidden;
  overflow-y: auto;

  .btn-block {
    text-align: right;
    display: none;
  }

  #cert-content {
    //margin-top: 15px;
    max-height: 750px;
    overflow-x: hidden;
    overflow-y: auto;

    .print-cert {
      height: 50%;
    }
  }
}

.num {
  display: inline-block;
  margin-right: 10px;
  font-size: 14px;
  color: #606266;
  line-height: 32px;
  vertical-align: middle;
}

.print-content {
  /deep/ .el-divider {
    margin: 50px 0;
  }

  &:last-child {
    /deep/ .el-divider {
      margin: 50px 0 0;
    }
  }
}

.foot {
  position: relative;
  z-index: 50;

  .setting {
    position: absolute;
    right: 150px;
    top: 8px;
    z-index: 60;
  }
}

.no-print {
  /deep/ .el-divider__text {
    transform: translate(-50%, -30%);
  }
}
</style>
