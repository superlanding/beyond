import Modal from '../components/Modal'

export default function bindModalFn($) {

  $.fn.modal = function(settings) {

    const options = $.extend({}, $.fn.modal.defaults, settings)
    const modals = this.map((i, dom) => new Modal(dom, options))

    this.destroy = () => modals.each((i, m) => m.destroy())

    return this
  }
}
