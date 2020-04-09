import Autocomplete from '../components/Autocomplete'

export default function bindAutocompleteFn($) {

  $.fn.autocomplete = function(options) {
    this.each((i, dom) => new Autocomplete(dom, options))
    return this
  }
}
