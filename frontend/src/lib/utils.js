export const $ = (s) => document.querySelector(s)
export const $$ = (s) => [...document.querySelectorAll(s)]
export const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue('--' + n).trim()
export const rn = () => { let u = 0; while (!u) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283 * Math.random()) }
export function bind(id, cb) {
  const e = $('#' + id), v = $('#' + id + '-v')
  const u = () => { v.textContent = e.value; cb && cb(+e.value) }
  e.addEventListener('input', u); u()
}
