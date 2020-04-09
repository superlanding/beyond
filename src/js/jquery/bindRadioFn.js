import Radio from '../components/Radio'

export default function bindRadioFn($) {

  $.fn.radio = function() {

    const radios = this.map((i, dom) => new Radio(dom))

    this.destroy = () => radios.each((i, r) => r.destroy())

    return this
  }
}
