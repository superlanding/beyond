export default function promisify(func) {
  return (...args) => {
    const res = func(...args)
    if (res instanceof Promise) {
      return res
    }
    return Promise.resolve(res)
  }
}
