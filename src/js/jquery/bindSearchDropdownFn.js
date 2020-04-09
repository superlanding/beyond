import SearchDropdown from '../components/SearchDropdown'

export default function bindSearchDropdownFn($) {

  $.fn.searchDropdown = function(settings) {

    const options = $.extend({}, $.fn.searchDropdown.defaults, settings)
    const searchDropdowns = this.map((i, dom) => new SearchDropdown(dom, options))

    this.destroy = () => searchDropdowns.each((i, s) => s.destroy())

    return this
  }
}
