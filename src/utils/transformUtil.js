export default {
  // 把element的表格转为普通表格
  elementTableToNormal(id) {
    const target = document.querySelector('#' + id)
    // 表头
    let theadHtml = '<thead>'
    const theadTrs = target.querySelectorAll(
      '.el-table__header-wrapper .el-table__header thead tr'
    )
    theadTrs.forEach((tr, headIndex) => {
      let trHtml = '<tr>'
      const ths = tr.querySelectorAll('th:not(.gutter):not(.no-print)')
      ths.forEach((th, index) => {
        // 有内容并且不是checkbox
        if (
          th.className.indexOf('el-table-column--selection') === -1 &&
          th.className.indexOf('no-print') === -1
        ) {
          const cssText = th.style.cssText
          let borderWidth = '0'
          if (index === ths.length - 1) {
            borderWidth = '1px 1px 1px 0'
          } else if (index === 0) {
            borderWidth = '1px'
          } else {
            borderWidth = '1px 1px 1px 0'
          }
          trHtml += `<th class="${th.className}" rowspan="${
            th.rowSpan >= 0 ? th.rowSpan : 1
          }" colspan="${
            th.colSpan >= 0 ? th.colSpan : 1
          }" style="${cssText}line-height: 2.5em;font-weight: bold;padding:0 10px;font-weight: bold;border-width: ${borderWidth}; border-style: solid; border-color: #2C2C2C">${
            th.innerText
          }</th>`
        }
      })
      trHtml += '</tr>'
      theadHtml += trHtml
    })
    theadHtml += '</thead>'
    // 表体
    let tbodyHtml = '<tbody>'
    const tbodyTrs = target.querySelectorAll(
      '.el-table__body-wrapper tbody .el-table__row'
    )
    tbodyTrs.forEach((tr, bodyIndex) => {
      let trHtml = '<tr>'
      const tds = tr.querySelectorAll('td:not(.no-print)')
      tds.forEach((td, index) => {
        // 不需要有内容
        if (
          td.className.indexOf('el-table-column--selection') === -1 &&
          td.className.indexOf('no-print') === -1
        ) {
          const cssText = td.style.cssText
          let borderWidth = '0'
          if (bodyIndex === tbodyTrs.length - 1) {
            if (index === 0) {
              borderWidth = '0 1px 1px 1px'
            } else {
              borderWidth = '0 1px 1px 0'
            }
          } else {
            if (index === 0) {
              borderWidth = '0 1px 1px 1px'
            } else {
              borderWidth = '0 1px 1px 0'
            }
          }
          trHtml += `<td class="${td.className}" rowspan="${
            td.rowSpan >= 0 ? td.rowSpan : 1
          }" colspan="${
            td.colSpan >= 0 ? td.colSpan : 1
          }" style="${cssText}line-height: 2.5em;padding:0 10px; border-width: ${borderWidth}; border-style: solid; border-color: #2C2C2C">${
            td.innerText
          }</td>`
        }
      })
      trHtml += '</tr>'
      tbodyHtml += trHtml
    })
    // 表尾
    const footerTrs = target.querySelectorAll(
      '.el-table__footer-wrapper .el-table__footer tbody tr'
    )
    footerTrs.forEach(tr => {
      let trHtml = '<tr>'
      const tds = tr.querySelectorAll('td')
      const rowSpans = []
      const colSpans = []
      tds.forEach(td => {
        rowSpans.push(td.rowSpan)
        colSpans.push(td.colSpan)
      })
      rowSpans.forEach((item, index) => {
        if (item > 1) {
          for (let i = 1; i < item; i++) {
            rowSpans[index + i] = 0
          }
        }
      })
      colSpans.forEach((item, index) => {
        if (item > 1) {
          for (let i = 1; i < item; i++) {
            colSpans[index + i] = 0
          }
        }
      })
      // const targetColSpan = 0
      // const targetRowSpan = 0
      tds.forEach((td, index) => {
        let borderWidth = '0'
        if (index === tds.length - 1) {
          borderWidth = '0 1px 1px 0'
        } else if (index === 0) {
          borderWidth = '0 1px 1px 1px'
        } else {
          borderWidth = '0 1px 1px 0'
        }
        // 不需要有内容
        if (
          td.className.indexOf('el-table-column--selection') === -1 &&
          td.className.indexOf('no-print') === -1
        ) {
          const cssText = td.style.cssText
          trHtml += `<td class="${td.className}" 
          rowspan="${rowSpans[index] >= 0 ? rowSpans[index] : 1}" 
          colspan="${colSpans[index] >= 0 ? colSpans[index] : 1}" 
          style="${cssText}line-height: 2.5em;padding:0 10px; display: ${
  colSpans[index] === 0 ? 'none' : 'table-cell'
}; text-align: ${index === 0 ? 'center' : 'left'};
          border-width: ${borderWidth}; border-style: solid; border-color: #2C2C2C">${
  td.innerText
}</td>`
        }
      })
      trHtml += '</tr>'
      tbodyHtml += trHtml
    })
    tbodyHtml += '</tbody>'
    return `<table style="width: 100%;" height="auto" border="0" cellspacing="0">${theadHtml}${tbodyHtml}</table>`
  }
}
