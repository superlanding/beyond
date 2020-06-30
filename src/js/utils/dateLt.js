import { compareAsc } from './index'

export default function dateLt(date1, date2) {
  return compareAsc(date1, date2) === -1
}
