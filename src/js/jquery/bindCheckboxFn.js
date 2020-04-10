export default function bindCheckboxFn(beyond, $) {

  const { Checkbox } = beyond

  $.fn.checkbox = function() {

    const checkboxes = this.map((i, dom) => new Checkbox(dom))

    this.destroy = () => checkboxes.each((i, c) => c.destroy())

    return this
  }
}
