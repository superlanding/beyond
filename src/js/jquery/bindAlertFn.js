export default function bindAlertFn(beyond, $) {

  const { Alert } = beyond

  $.fn.alert = function() {

    const alerts = this.map((i, dom) => new Alert(dom))

    this.destroy = () => alerts.each((i, a) => a.destroy())

    return this
  }
}
