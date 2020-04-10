export default function bindRadioFn(beyond, $) {

  const { Radio } = beyond

  $.fn.radio = function() {

    const radios = this.map((i, dom) => new Radio(dom))

    this.destroy = () => radios.each((i, r) => r.destroy())

    return this
  }
}
