export default function bindDropdownFn(beyond, $) {

  const { Dropdown } = beyond

  $.fn.dropdown = function(settings) {

    const options = $.extend({}, $.fn.dropdown.defaults, settings)
    const dropdowns = this.map((i, dom) => new Dropdown(dom, options))

    this.destroy = () => dropdowns.each((i, d) => d.destroy())

    return this
  }
}
