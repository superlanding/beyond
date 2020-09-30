import offFns from '../consts/offFns'

export default function allOff() {
  offFns.forEach(fn => fn())
  offFns.length = 0
}
