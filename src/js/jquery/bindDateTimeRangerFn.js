import DateTimeRanger from '../components/DateTimeRanger'

export default function bindDateTimeRangerFn($) {

  $.fn.dateTimeRanger = function(settings) {

    const options = $.extend({}, $.fn.dateTimeRanger.defaults, settings)
    const dateTimeRangers = this.map((i, dom) => new DateTimeRanger(dom, options))

    this.destroy = () => dateTimeRangers.each((i, d) => d.destroy())

    return this
  }
}
