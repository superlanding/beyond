import range from 'lodash.range'
import sample from 'lodash.sample'
import throttle from 'lodash.throttle'
import toPixel from '@superlanding/topixel'
import Theme from '../../assets/js/models/Theme'

export default function bindLineCharts() {

  const { LineChart } = window.beyond
  const dom = document.getElementById('line-chart')

  if (! dom) {
    return () => {}
  }

  const padZero = v => v.toString().padStart(2, '0')
  const toXLabel = v => {
    const d = new Date(v)
    return padZero(d.getHours()) + ':' + padZero(d.getMinutes())
  }
  const toYLabel = v => {
    const numStr = (v / 10000).toFixed(1)
    const [firstNum, secondNum] = numStr.split('.')
    if ((firstNum === '0') && (secondNum === '0')) {
      return '0'
    }
    if (secondNum === '0') {
      return firstNum + '萬'
    }
    return numStr + '萬'
  }

  const fiveMins = 5 * 60 * 1000
  const chartMenu = document.getElementById('chart-menu')
  const theme = Theme.get()
  const c = new LineChart(dom, {
    theme,
    toXLabel,
    toYLabel,
    lineLabels: ['線段1', '線段2', '線段3'],
    yStep: 2 * 10000,
    onPointMouseOver(mousePos, res) {
      if (res) {
        const { point } = res
        chartMenu.innerHTML = `
          <div>時間: ${toXLabel(point.x)}</div>
          <div>金錢: ${point.y}</div>
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

  const now = +new Date()
  const getSampleValue = () => sample([1000, 2000, 3000, 4000, 500])
  const points1 = range(1, 20 + 1)
    .map(i => {
      return {
        x: now + (i * fiveMins),
        y: i * getSampleValue()
      }
    })

  const points2 = range(1, 20 + 1)
    .map(i => {
      return {
        x: now + (i * fiveMins),
        y: i * getSampleValue()
      }
    })

  const points3 = range(1, 20 + 1)
    .map(i => {
      return {
        x: now + (i * fiveMins),
        y: i * getSampleValue()
      }
    })

  c.setData([points1, points2, points3])

  let domWidth = dom.offsetWidth

  const handleResize = throttle(() => {
    if (dom.offsetWidth !== domWidth) {
      c.refresh()
    }
    domWidth = dom.offsetWidth
  }, 300)
  window.addEventListener('resize', handleResize)

  const handleThemeChange = () => {
    const theme = Theme.get()
    c.setTheme({ theme })
    c.refresh()
  }
  document.addEventListener('beyond-theme-change', handleThemeChange)

  return function unbindLineCharts() {
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('beyond-theme-change', handleThemeChange)
    c.destroy()
  }
}
