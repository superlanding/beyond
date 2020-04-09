import Radio from '../components/Radio'

export default function bindRadioFn($) {

  $.fn.radio = function() {
    this.each((i, dom) => new Radio(dom))
    return this
  }
}
