import throttle from 'lodash.throttle'
import toPixel from '@superlanding/topixel'
import Theme from '../../assets/js/models/Theme'

export default function bindBarCharts() {

  const { BarChart } = window.beyond
  const dom = document.getElementById('bar-chart')

  if (! dom) {
    return () => {}
  }

  const chartMenu = document.getElementById('chart-menu')
  const theme = Theme.get()

  const b = new BarChart(dom, {
    theme,
    onBarMouseOver(mousePos, res) {
      if (res) {
        const { index, bar } = res
        chartMenu.innerHTML = `
          <div>index: ${index}</div>
          <div>時間: ${bar.label}</div>
          <div>數字: ${bar.value}</div>
        `
        chartMenu.style.left = toPixel(mousePos.x)
        chartMenu.style.top = toPixel(mousePos.y + 20)
        chartMenu.style.display = 'block'
      }
      else {
        chartMenu.style.display = 'none'
      }
    }
  })

  b.setData([
    { label: '1 個月內', value: 0.8 },
    { label: '3 個月內', value: 1.7 },
    { label: '6 個月內', value: 1.1 }
  ])

  let domWidth = dom.offsetWidth

  const handleResize = throttle(() => {
    if (dom.offsetWidth !== domWidth) {
      b.refresh()
    }
    domWidth = dom.offsetWidth
  }, 300)
  window.addEventListener('resize', handleResize)

  return function unbindBarCharts() {
    window.removeEventListener('resize', handleResize)
    b.destroy()
  }
}
