import Alert from '../components/Alert'

export default function bindAlertFn($) {
  $.fn.alert = function() {
    this.each((i, dom) => new Alert(dom))
    return this
  }
}
