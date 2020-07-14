import { test } from '~/test/utils'
import dateEq from '~/src/js/utils/dateEq'

test('dateEq', t => {

  // Sun Jul 12 2020 18:31:43 GMT+0800 (Taipei Standard Time)
  const date1 = new Date(1594549903944)

  // Sun Jul 12 2020 18:31:43 GMT+0800 (Taipei Standard Time)
  const date2 = new Date(1594549903944)
  t.true(dateEq(date1, date2))
})
