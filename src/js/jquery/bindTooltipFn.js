import Tooltip from '../components/Tooltip'

export default function bindTooltipFn($) {

  $.fn.tooltip = function() {
    this.each((i, dom) => new Tooltip(dom))
    return this
  }
}
