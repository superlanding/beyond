import compareAsc from 'date-fns/compareAsc'

export default function dateEq(date1, date22) {
  return compareAsc(date1, date2) === 0
}
