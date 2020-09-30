let offFns = []

export function on(dom, event, cb, useCapture = false) {
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

export default function allOff() {
  offFns.forEach(fn => fn())
  offFns.length = 0
}
