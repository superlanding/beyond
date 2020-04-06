import Dropdown from '../components/Dropdown'

export default function bindDropdownFn($) {
  $.fn.dropdown = function() {
    this.each((i, dom) => new Dropdown(dom))
  }
}
