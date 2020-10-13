import isDef from './isDef'

export default function raf(fn) {
  if (isDef(window.requestAnimationFrame)) {
    return window.requestAnimationFrame(fn)
  }
  return fn()
}
