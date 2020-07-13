import { test } from '../../../../test/utils'
import dateLt from '../../utils/dateLt'

test('dateLt', t => {

  // Sun Jul 12 2020 18:31:43 GMT+0800 (Taipei Standard Time)
  const date1 = new Date(1594549903944)

  // Mon Jul 13 2020 18:31:43 GMT+0800 (Taipei Standard Time)
  const date2 = new Date(1594636303944)
  t.true(dateLt(date1, date2))
})
