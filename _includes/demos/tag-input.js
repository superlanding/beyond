export default function bindTagInput() {

  const { TagInput } = window.beyond

  const fruits = ['apple', 'lemon', 'love']

  const tagInputs = Array.from(document.querySelectorAll('[data-tag-input]'))
    .map(dom => {
      const tagInput = new TagInput(dom, {
        suggest(v) {
          if (v) {
            const fruid = fruits.find(f => f.startsWith(v))
            return fruid
          }
          return ''
        },
        validate(v) {
          if (fruits.includes(v)) {
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
