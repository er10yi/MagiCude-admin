
import { NUMBER } from '../constant/reg'

export function sortNum(a, b) {
  return a - b
}
export function isNumber(str) {
  return new RegExp(NUMBER).test(str)
}
export function getLocale() {
  const lang = localStorage.getItem('locale') || sessionStorage.getItem('locale') || (navigator.systemLanguage ? navigator.systemLanguage : navigator.language)
  const index = lang.indexOf('-')
  return lang.substring(0, index) + '_' + lang.substring(index + 1).toUpperCase()
}
