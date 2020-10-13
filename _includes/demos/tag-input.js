export default function bindTagInput() {

  const { TagInput } = window.beyond

  const tagInputs = Array.from(document.querySelectorAll('[data-tag-input]'))
    .forEach(dom => {
      const tagInput = new TagInput(dom)
      return tagInput
    })

  return function unbindTagInput() {
    tagInputs.forEach(input => input.destroy())
  }
}
