export default function bindTabboxFn(beyond, $) {

  const { Tabbox } = beyond

  $.fn.tabbox = function() {

    const tabboxes = this.map((i, dom) => new Tabbox(dom))

    this.destroy = () => tabboxes.each((i, t) => t.destroy())

    return this
  }
}
