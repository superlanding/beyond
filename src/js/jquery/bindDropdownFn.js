export default function bindDropdownFn(beyond, $) {

  const { Dropdown } = beyond

  $.fn.dropdown = function() {

    const dropdowns = this.map((i, dom) => new Dropdown(dom))

    this.destroy = () => dropdowns.each((i, d) => d.destroy())

    return this
  }
}
