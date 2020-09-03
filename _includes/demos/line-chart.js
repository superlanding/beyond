import range from 'lodash.range'
import sample from 'lodash.sample'
import throttle from 'lodash.throttle'

export default function bindCharts() {

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
  const c = new LineChart(dom, {
    toXLabel,
    toYLabel,
    lineLabels: ['線段1', '線段2', '線段3'],
    xStep: fiveMins,
    yStep: 2 * 10000
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

  c.setPoints([points1, points2, points3])

  let domWidth = dom.offsetWidth

  const handleResize = throttle(() => {
    if (dom.offsetWidth !== domWidth) {
      c.refresh()
    }
    domWidth = dom.offsetWidth
  }, 300)
  window.addEventListener('resize', handleResize)

  return function unbindCharts() {
    window.removeEventListener('resize', handleResize)
    c.destroy()
  }
}
