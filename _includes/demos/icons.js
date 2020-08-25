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

  const icons = document.querySelectorAll('.codebox-result > .icon > i')
  const svgs = document.querySelectorAll('.codebox-result > .icon > .svg')

  const handleInput = event => {
    const keyword = event.target.value

    svgs.forEach(svg => {
      const svgName = svg.alt
      if (svgName.startsWith(keyword)) {
        svg.parentNode.style.display = 'inline-block'
      }
      else {
        svg.parentNode.style.display = 'none'
      }
    })

    icons.forEach(icon => {
      const iconName = icon.className.replace(/^icon-/, '')
      if (iconName.startsWith(keyword)) {
        icon.parentNode.style.display = 'inline-block'
      }
      else {
        icon.parentNode.style.display = 'none'
      }
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
