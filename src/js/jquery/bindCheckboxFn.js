import Checkbox from '../components/Checkbox'

export default function bindCheckboxFn($) {
  $.fn.checkbox = function() {

    const checkboxes = this.map((i, dom) => new Checkbox(dom))

    this.destroy = () => checkboxes.each((i, c) => c.destroy())

    return this
  }
}
