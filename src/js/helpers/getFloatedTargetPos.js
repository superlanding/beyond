// Calculate floated target position for tooltip and dropdown
export default function getFloatedTargetPos(options) {

  const { src, target, place, align, offset } = options

  const x1 = src.offsetLeft
  const y1 = src.offsetTop
  const w1 = src.offsetWidth
  const h1 = src.offsetHeight

  const w2 = target.offsetWidth
  const h2 = target.offsetHeight

  switch (place) {
    case 'top': {
      const top = y1 - offset - h2
      if (align === 'left') {
        const left = x1
        return { left, top }
      }
      if (align === 'right') {
        const left = x1 - (w2 - w1)
        return { left, top }
      }
      const left = x1 + (w1 / 2) - (w2 / 2)
      return { left, top }
    }
    case 'bottom': {
      const top = y1 + h1 + offset
      if (align === 'left') {
        const left = x1
        return { left, top }
      }
      if (align === 'right') {
        const left = x1 - (w2 - w1)
        return { left, top }
      }
      const left = x1 + (w1 / 2) - (w2 / 2)
      return { left, top }
    }
    case 'left': {
      const left = x1 - offset - w2
      if (align === 'top') {
        const top = y1
        return { left, top }
      }
      if (align === 'bottom') {
        const top = y1 - (h2 - h1)
        return { left, top }
      }
      const top = y1 + (h1 / 2) - (h2 / 2)
      return { left, top }
    }
    case 'right': {
      const left = x1 + w1 + offset
      if (align === 'top') {
        const top = y1
        return { left, top }
      }
      if (align === 'bottom') {
        const top = y1 - (h2 - h1)
        return { left, top }
      }
      const top = y1 + (h1 / 2) - (h2 / 2)
      return { left, top }
    }
    default:
      throw new Error(`Unsupported Place: ${place}`)
  }
}
