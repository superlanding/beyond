import Datepicker from '../components/Datepicker'

export default function bindDatepickerFn($) {

  $.fn.datepicker = function(timestamp, settings) {

    const options = $.extend({}, $.fn.datepicker.defaults, settings)
    const datepickers = this.map((i, dom) => new Datepicker(dom, timestamp, options))

    this.destroy = () => datepickers.each((i, d) => d.destroy())

    return this
  }
}
