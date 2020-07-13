import test from 'ava'
import msToS from '../../utils/msToS'

test('msToS', t => {
  t.is(msToS(1000), 1)
  t.is(msToS(1200), 1)
  t.is(msToS(900), 0)
})
