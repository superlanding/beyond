export default function dateToTimestamp(date) {
  return parseInt(+date / 1000, 10)
}
