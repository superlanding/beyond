const offFns = []
const loadRows = []
const unloadRows = []

const onPage = row => {
  const { controller, action } = row
  const { dataset } = document.body
  return (dataset.controller === controller) && (dataset.action === action)
}

export const $ = (selector, dom = document) => dom.querySelector(selector)

export const $$ = (selector, dom = document) => Array.from(dom.querySelectorAll(selector))

export const on = (dom, event, cb, useCapture = false) => {
  dom.addEventListener(event, cb, useCapture)
  const off = () => dom.removeEventListener(event, cb, useCapture)
  offFns.push(off)

  return () => {
    const index = offFns.findIndex(fn => fn === off)
    if (index !== -1) {
      offFns.splice(index, 1)
    }
    off()
  }
}

export const allOff = () => {
  offFns.forEach(fn => fn())
  offFns.length = 0
}

export const onload = (controller, action, fn) => {
  loadRows.push({ controller, action, fn })
}

export const load = () => {
  loadRows.forEach(row => {
    if (onPage(row)) {
      row.fn()
    }
  })
}

export const onunload = (controller, action, fn) => {
  unloadRows.push({ controller, action, fn })
}

export const unload = () => {
  unloadRows.forEach(row => {
    if (onPage(row)) {
      row.fn()
    }
  })
}
