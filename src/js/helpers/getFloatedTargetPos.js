// Calculate floated target position for tooltip and dropdown
export default function getgetFloatedTargetPos({ src, target, placement, offset }) {

  const x1 = src.offsetLeft
  const y1 = src.offsetTop
  const w1 = src.offsetWidth
  const h1 = src.offsetHeight

  const w2 = target.offsetWidth
  const h2 = target.offsetHeight

  switch (placement) {
    case 'top': {
      const left = x1 + (w1 / 2) - (w2 / 2)
      const top = y1 - offset - h2
      return { left, top }
    }
    case 'bottom': {
      const left = x1 + (w1 / 2) - (w2 / 2)
      const top = y1 + h1 + offset
      return { left, top }
    }
    case 'left': {
      const left = x1 - offset - w2
      const top = y1 + (w1 / 2) - (h2 / 2)
      return { left, top }
    }
    case 'right': {
      const left = x1 + w1 + offset
      const top = y1 + (h1 / 2) - (h2 / 2)
      return { left, top }
    }
    default:
      throw new Error(`Unsupported Placement: ${placement}`)
  }
}
