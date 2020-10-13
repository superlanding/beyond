export default function bindTagInput() {

  const { TagInput } = window.beyond

  const tagInputs = Array.from(document.querySelectorAll('[data-tag-input]'))
    .map(dom => {
      const tagInput = new TagInput(dom, {
        validate(v) {
          if (['apple', 'lemon', 'love'].includes(v)) {
            return { isTag: true, classname: 'tag-extra' }
          }
          return { isTag: false }
        },
        change(tags) {
          console.log('change', tags)
        }
      })
      return tagInput
    })

  return function unbindTagInput() {
    tagInputs.forEach(input => input.destroy())
  }
}
