import { isObject } from './is/index'

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
  }
  return src
}

/**
 * Sums the passed percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function addLight(color: string, amount: number) {
  const cc = Number.parseInt(color, 16) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
 * Darkens a HEX color given the passed percentage
 * @param {string} color The color to process
 * @param {number} amount The amount to change the color by
 * @returns {string} The HEX representation of the processed color
 */
export function darken(color: string, amount: number) {
  color = color.includes('#') ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(
    color.substring(2, 4),
    amount,
  )}${subtractLight(color.substring(4, 6), amount)}`
}

/**
 * Lightens a 6 char HEX color according to the passed percentage
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed color represented as HEX
 */
export function lighten(color: string, amount: number) {
  color = color.includes('#') ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount,
  )}${addLight(color.substring(4, 6), amount)}`
}

/**
 * 判断是否 url
 */
const RegExp = /^http(s)?:\/\//iu
export function isUrl(url: string) {
  return RegExp.test(url)
}

/**
 * 一维数组转二维数组
 */
export function arrayTrans(arr: number[]): number[][] {
  const newArr: number[][] = []
  while (arr.length > 0) {
    newArr.push(arr.splice(0, 2))
  }
  return newArr
}

/**
 * Subtracts the indicated percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function subtractLight(color: string, amount: number) {
  const cc = Number.parseInt(color, 16) - amount
  const c = cc < 0 ? 0 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

export function hexToRgba(hex: string, opacity: number) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  opacity = opacity >= 0 && opacity <= 1 ? Number(opacity) : 1
  return result
    ? `rgba(${
        [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16), opacity].join(
          ',',
        )
        })`
    : hex
}

/**
 * Check if device is iOS
 * @returns True if iOS
 */
export function isIos(): boolean {
  const userAgent = navigator.userAgent
  return !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

/**
 * Get relative time format
 * @param unixtime - Unix timestamp or date string
 * @returns Relative time string
 */
export function getDateTimeFormat(unixtime: string): string {
  const currTime = Date.parse(new Date().toString())
  // 兼容 ios
  const winTime = new Date(isIos() ? unixtime.replace(/-/g, '/') : unixtime).getTime()
  let time = Number.parseInt(String(currTime)) / 1000 - Number.parseInt(String(winTime)) / 1000
  time = Math.abs(time)
  // 少于一分钟
  if (time < 60) {
    return '1分钟前'
  }
  // 秒转分钟
  const minutes = time / 60
  if (minutes < 60) {
    return `${Math.floor(minutes)}分钟前`
  }
  // 秒转小时
  const hours = time / 3600
  if (hours < 24) {
    return `${Math.floor(hours)}小时前`
  }
  // 秒转天数
  const days = time / 3600 / 24
  if (days < 30) {
    return `${Math.floor(days)}天前`
  }
  // 秒转月
  const months = time / 3600 / 24 / 30
  if (months < 12) {
    return `${Math.floor(months)}月前`
  }
  // 秒转年
  const years = time / 3600 / 24 / 30 / 12
  return `${Math.floor(years)}年前`
}

/**
 * Get time object from minutes offset
 * @param minutes - Minutes offset
 * @param currTime - Current time
 * @returns Time object
 */
export function getsomeTime(minutes: number, currTime: Date = new Date()) {
  const nowDate = new Date(currTime)
  nowDate.setTime(nowDate.getTime() + minutes * 60000)
  const time = [
    nowDate.getFullYear(),
    two(+nowDate.getMonth() + 1),
    two(nowDate.getDate()),
    two(nowDate.getHours()),
    two(nowDate.getMinutes()),
    two(nowDate.getSeconds()),
  ]
  return {
    year: time[0],
    mon: time[1],
    day: time[2],
    hour: time[3],
    min: time[4],
    sec: time[5],
    date: `${time[0]}-${time[1]}-${time[2]} ${time[3]}:${time[4]}:${time[5]}`,
  }
}

/**
 * Get time object
 * @param minutes - Minutes offset
 * @returns Time object
 */
export function getTime(minutes: number) {
  const timeData = getsomeTime(-minutes)
  return {
    year: timeData.year,
    day: `${timeData.mon}/${timeData.day}`,
    dateStr: timeData.date,
    timeAgo: getDateTimeFormat(timeData.date),
  }
}

/**
 * Format number to two digits
 * @param num - Number to format
 * @returns Formatted string
 */
function two(num: number): string {
  return num < 10 ? `0${num}` : `${num}`
}

/**
 * Set meta theme color
 * @param color - Color value
 */
export function setMetaColor(color: string): void {
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', color)
  }
}

// Click outside directive (Vue 3 version)
export const clickOutSide = {
  mounted(el: HTMLElement & { __vueClickOutside__?: (e: MouseEvent) => void }, binding: { value: (e: MouseEvent) => void }) {
    function clickHandler(e: MouseEvent) {
      if (el.contains(e.target as Node)) {
        return false
      }
      if (binding.value) {
        binding.value(e)
      }
    }
    el.__vueClickOutside__ = clickHandler
    document.addEventListener('click', clickHandler)
  },
  unmounted(el: HTMLElement & { __vueClickOutside__?: (e: MouseEvent) => void }) {
    if (el.__vueClickOutside__) {
      document.removeEventListener('click', el.__vueClickOutside__)
      delete el.__vueClickOutside__
    }
  },
}
