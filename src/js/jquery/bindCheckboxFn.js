import Checkbox from '../components/Checkbox'

export default function bindCheckboxFn($) {
  $.fn.checkbox = function() {
    this.each((i, dom) => new Checkbox(dom))
  }
}
