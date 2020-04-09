import Autocomplete from '../components/Autocomplete'

export default function bindAutocompleteFn($) {

  $.fn.autocomplete = function(options) {

    const autocompletes = this.map((i, dom) => new Autocomplete(dom, options))

    this.destroy = () => autocompletes.each((i, a) => a.destroy())

    return this
  }
}
