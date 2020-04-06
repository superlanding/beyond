export default function docReady() {
  return new Promise(resolve => {
    const { readyState } = document
    if (['complete', 'interactive'].includes(readyState)) {
      setTimeout(resolve, 1)
      return
    }
    document.addEventListener('DOMContentLoaded', resolve)
  })
}
