export default function bindCodeboxes() {

  const { Codebox } = window.beyond
  const codeboxes = Array.from(document.querySelectorAll('[data-codebox]'))
    .map(dom => new Codebox(dom))

  return function unbindCodeboxes() {
    codeboxes.forEach(codebox => codebox.destroy())
  }
}
