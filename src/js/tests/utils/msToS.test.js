import { test } from '../../../../test/utils'
import msToS from '../../utils/msToS'

test('msToS', t => {
  t.is(msToS(1000), 1)
  t.is(msToS(1200), 1)
  t.is(msToS(900), 0)
})
