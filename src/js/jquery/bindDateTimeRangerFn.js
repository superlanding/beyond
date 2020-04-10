export default function bindDateTimeRangerFn(beyond, $) {

  const { DateTimeRanger } = beyond

  $.fn.dateTimeRanger = function(settings) {

    const options = $.extend({}, $.fn.dateTimeRanger.defaults, settings)
    const dateTimeRangers = this.map((i, dom) => new DateTimeRanger(dom, options))

    this.destroy = () => dateTimeRangers.each((i, d) => d.destroy())

    return this
  }
}
