export default function bindModalFn(beyond, $) {

  const { Modal } = beyond

  $.fn.modal = function(settings) {

    const options = $.extend({}, $.fn.modal.defaults, settings)
    const modals = this.map((i, dom) => new Modal(dom, options))

    this.destroy = () => modals.each((i, m) => m.destroy())

    return this
  }
}
