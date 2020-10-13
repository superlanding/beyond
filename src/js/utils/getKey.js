const keyMap = {
  8: 'backspace',
  13: 'enter',
  17: 'ctrl',
  27: 'esc',
  38: 'up',
  40: 'down',
  70: 'f',
  91: 'left-meta',
  93: 'right-meta'
}

export default function getKey(event) {
  return keyMap[event.keyCode] || ''
}
