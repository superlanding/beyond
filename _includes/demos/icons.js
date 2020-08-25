export default function bindIcons() {

  const { Toast } = window.beyond
  const toast = new Toast()

  const divs = Array.from(document.querySelectorAll('div.icon'))

  const searchInput = document.getElementById('icon-search')

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

  const icons = document.querySelectorAll('.codebox-result > .icon > .icon-content > i')
  const svgs = document.querySelectorAll('.codebox-result > .icon > .icon-content > .svg')

  const toggle = (name, keyword, dom) => {
    if (name.toLowerCase().startsWith(keyword.toLowerCase())) {
      dom.parentNode.parentNode.style.display = 'inline-block'
    }
    else {
      dom.parentNode.parentNode.style.display = 'none'
    }
  }

  const handleInput = event => {
    const keyword = event.target.value

    svgs.forEach(svg => toggle(svg.alt, keyword, svg))

    icons.forEach(icon => {
      const iconName = icon.className.replace(/^icon-/, '')
      toggle(iconName, keyword, icon)
    })
  }

  searchInput.addEventListener('input', handleInput, false)

  return function unbindIcons() {
    divs.forEach(div => {
      div.removeEventListener('click', handleClick)
    })
    searchInput.removeEventListener('input', handleInput, false)
  }
}
