export default {
  // 适合手机号，编码，只能输入数字的情况
  inputFilterNumberText(form, key) {
    form[key] = form[key].replace(/\D/g, '')
  }
}
