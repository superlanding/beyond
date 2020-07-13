import { test } from '~/test/utils'
import dateGt from '~/src/js/utils/dateGt'

test('dateGt', t => {

  // Sun Jul 12 2020 18:31:43 GMT+0800 (Taipei Standard Time)
  const date1 = new Date(1594549903944)

  // Mon Jul 13 2020 18:31:43 GMT+0800 (Taipei Standard Time)
  const date2 = new Date(1594636303944)
  t.true(dateGt(date2, date1))
})
