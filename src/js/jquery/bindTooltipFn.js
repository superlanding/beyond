export default function bindTooltipFn(beyond, $) {

  const { Tooltip } = beyond

  $.fn.tooltip = function() {

    const tooltips = this.map((i, dom) => new Tooltip(dom))

    this.destroy = () => tooltips.each((i, t) => t.destroy())

    return this
  }
}
