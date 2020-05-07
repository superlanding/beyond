export default function bindIcons() {

  const { Toast } = window.beyond
  const toast = new Toast()

  const divs = Array.from(document.querySelectorAll('div.icon'))

  const getClipboardText = target => {
    switch (target.tagName) {
      case 'I':
        return target.className
      case 'IMG':
        return target.getAttribute('src')
      default:
        throw new Error(`Unhandled tag: ${target.tagName}`)
    }
  }

  const handleClick = event => {
    let { target } = event
    if (target.classList.contains('icon')) {
      target = target.children[0]
    }
    const text = getClipboardText(target)
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.send(`已複製 ${text}`)
      })
  }

  divs.forEach(div => {
    div.addEventListener('click', handleClick)
  })

  return function unbindIcons() {
    divs.forEach(div => {
      div.removeEventListener('click', handleClick)
    })
  }
}
