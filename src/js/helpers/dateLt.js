import compareAsc from 'date-fns/compareAsc'

export default function dateLt(date1, date2) {
  return compareAsc(date1, date2) === -1
}
