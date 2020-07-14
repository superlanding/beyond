import { test } from '~/test/utils'
import getKey from '~/src/js/utils/getKey'

test('getKey', t => {

  const keyMap = {
    13: 'enter',
    17: 'ctrl',
    27: 'esc',
    38: 'up',
    40: 'down',
    70: 'f',
    91: 'left-meta',
    93: 'right-meta'
  }

  for (const [k, v] of Object.entries(keyMap)) {
    const keyCode = parseInt(k, 10)
    const event = { keyCode }
    t.is(getKey(event), v)
  }

  // Return empty string when keyCode is not found.
  t.is(getKey({ keyCode: 9999 }), '')
})
