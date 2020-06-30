import getDomPos from '@superlanding/getdompos'
import getScrollTop from '@superlanding/getscrolltop'
import getScrollLeft from '@superlanding/getscrollleft'

// Calculate floated target position for tooltip and dropdown
export default function getFloatedTargetPos(options) {

  const { src, target, place, align, offset = 0, offsetLeft, offsetTop } = options

  const { x: x1, y: y1 } = getDomPos(src)

  const w1 = src.offsetWidth
  const h1 = src.offsetHeight

  const w2 = target.offsetWidth
  const h2 = target.offsetHeight

  let pos = getPos({ x1, y1, w1, h1, w2, h2, place, align, offset })
  let posWithOffsets = addExtraOffsets({ pos, offsetLeft, offsetTop })

  // auto detect the best placement and alignment
  const detectedPlace = detectPlace({ pos: posWithOffsets, place, w2, h2 })
  const detectedAlign = detectAlign({ pos: posWithOffsets, place, align, w2, h2 })

  const placeDifferent = (place !== detectedPlace)
  const alignDifferent = (align !== detectedAlign)

  if (placeDifferent || alignDifferent) {
    pos = getPos({
      x1, y1, w1, h1, w2, h2,
      place: detectedPlace, align: detectedAlign, offset
    })

    let adjustedOffsetLeft = offsetLeft
    let adjustedOffsetTop = offsetTop

    if (placeDifferent && ['left', 'right'].includes(detectedPlace)) {
      adjustedOffsetLeft = -adjustedOffsetLeft
    }
    if (placeDifferent && ['top', 'bottom'].includes(detectedPlace)) {
      adjustedOffsetTop = -adjustedOffsetTop
    }

    posWithOffsets = addExtraOffsets({
      pos,
      offsetLeft: adjustedOffsetLeft,
      offsetTop: adjustedOffsetTop
    })
  }

  const posWithSafeBoundary = adjustToBoundary({
    pos: posWithOffsets,
    w1, h1, w2, h2,
    place, align
  })
  return {
    pos: posWithSafeBoundary,
    place: detectedPlace,
    align: detectedAlign
  }
}

function getTouchedData({ pos, w2, h2 }) {
  const { left, top } = pos
  const scrollTop = getScrollTop()
  const scrollBottom = scrollTop + window.innerHeight
  const scrollLeft = getScrollLeft()
  const scrollRight = scrollLeft + window.innerWidth
  const touchedTop = (top < scrollTop)
  const touchedBottom = ((top + h2) > scrollBottom)
  const touchedLeft = (left < scrollLeft)
  const touchedRight = ((left + w2) > scrollRight)
  return { touchedTop, touchedBottom, touchedLeft, touchedRight }
}

function detectPlace({ pos, place, w2, h2 }) {

  const { touchedTop, touchedBottom,
    touchedLeft, touchedRight } = getTouchedData({ pos, w2, h2 })

  if ((place === 'top') && touchedTop) {
    return 'bottom'
  }
  if ((place === 'bottom') && touchedBottom) {
    return 'top'
  }
  if ((place === 'left') && touchedLeft) {
    return 'right'
  }
  if ((place === 'right') && touchedRight) {
    return 'left'
  }
  return place
}

function detectAlign({ pos, place, align, w2, h2 }) {
  const isVertical = ['top', 'bottom'].includes(place)
  const isHorizontal = ['left', 'right'].includes(place)
  const { touchedTop, touchedBottom,
    touchedLeft, touchedRight } = getTouchedData({ pos, w2, h2 })

  if (isVertical && touchedLeft) {
    return 'left'
  }
  if (isVertical && touchedRight) {
    return 'right'
  }
  if (isHorizontal && touchedTop) {
    return 'top'
  }
  if (isHorizontal && touchedBottom) {
    return 'bottom'
  }
  return align
}

function getPos(options) {

  const { place, align = 'center' } = options

  switch (`${place}_${align}`) {
    case 'top_left':
      return getTopLeftPos(options)
    case 'top_right':
      return getTopRightPos(options)
    case 'top_center':
      return getTopCenterPos(options)
    case 'bottom_left':
      return getBottomLeftPos(options)
    case 'bottom_right':
      return getBottomRightPos(options)
    case 'bottom_center':
      return getBottomCenterPos(options)
    case 'left_top':
      return getLeftTopPos(options)
    case 'left_bottom':
      return getLeftBottomPos(options)
    case 'left_center':
      return getLeftCenterPos(options)
    case 'right_top':
      return getRightTopPos(options)
    case 'right_bottom':
      return getRightBottomPos(options)
    case 'right_center':
      return getRightCenterPos(options)
    default:
      throw new Error(`Unsupported placement and alignment: ${place} ${align}`)
  }
}

function getTopLeftPos({ x1, y1, h2, offset }) {
  const top = y1 - offset - h2
  const left = x1
  return { left, top }
}

function getTopRightPos({ x1, y1, w1, w2, h2, offset }) {
  const top = y1 - offset - h2
  const left = x1 - (w2 - w1)
  return { left, top }
}

function getTopCenterPos({ x1, y1, w1, w2, h2, offset }) {
  const top = y1 - offset - h2
  const left = x1 + (w1 / 2) - (w2 / 2)
  return { left, top }
}

function getBottomLeftPos({ x1, y1, h1, offset }) {
  const top = y1 + h1 + offset
  const left = x1
  return { left, top }
}

function getBottomRightPos({ x1, y1, w1, h1, w2, offset }) {
  const top = y1 + h1 + offset
  const left = x1 - (w2 - w1)
  return { left, top }
}

function getBottomCenterPos({ x1, y1, w1, h1, w2, offset }) {
  const top = y1 + h1 + offset
  const left = x1 + (w1 / 2) - (w2 / 2)
  return { left, top }
}

function getLeftTopPos({ x1, y1, w2, offset }) {
  const left = x1 - offset - w2
  const top = y1
  return { left, top }
}

function getLeftBottomPos({ x1, y1, h1, w2, h2, offset }) {
  const left = x1 - offset - w2
  const top = y1 - (h2 - h1)
  return { left, top }
}

function getLeftCenterPos({ x1, y1, h1, w2, h2, offset }) {
  const left = x1 - offset - w2
  const top = y1 + (h1 / 2) - (h2 / 2)
  return { left, top }
}

function getRightTopPos({ x1, y1, w1, offset }) {
  const left = x1 + w1 + offset
  const top = y1
  return { left, top }
}

function getRightBottomPos({ x1, y1, w1, h1, h2, offset }) {
  const left = x1 + w1 + offset
  const top = y1 - (h2 - h1)
  return { left, top }
}

function getRightCenterPos({ x1, y1, w1, h1, h2, offset }) {
  const left = x1 + w1 + offset
  const top = y1 + (h1 / 2) - (h2 / 2)
  return { left, top }
}

function adjustToBoundary({ pos, w1, w2, h1, h2 }) {

  const { touchedTop, touchedBottom,
    touchedLeft, touchedRight } = getTouchedData({ pos, w2, h2 })

  let left = pos.left
  let top = pos.top
  if (touchedLeft) {
    left = 0
  }
  if (touchedRight) {
    left = window.innerWidth - w2 + w1;
  }
  if (touchedTop) {
    top = 0
  }
  if (touchedBottom) {
    top = window.innerHeight - h2 + h1
  }
  return { top, left }
}

function addExtraOffsets({ pos, offsetLeft = 0, offsetTop = 0 }) {
  return {
    left: pos.left + offsetLeft,
    top: pos.top + offsetTop
  }
}
