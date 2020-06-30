import { compareAsc } from './index'

export default function dateEq(date1, date2) {
  return compareAsc(date1, date2) === 0
}
