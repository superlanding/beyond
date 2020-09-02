import range from 'lodash.range'

export default function bindCharts() {

  const { Chart } = window.beyond
  const dom = document.getElementById('line-chart')
  const padZero = v => v.toString().padStart(2, '0')
  const xLabel = v => {
    const d = new Date(v)
    return padZero(d.getHours()) + ':' + padZero(d.getMinutes())
  }
  const yLabel = v => {
    return (v / 10000).toFixed(1) + '萬'
  }

  const fiveMins = 5 * 60 * 1000
  const c = new Chart(dom, {
    xLabel,
    yLabel,
    width: 400,
    xStep: fiveMins,
    yStep: 2 * 10000
  })

  const now = +new Date()
  const points1 = range(1, 20 + 1)
    .map(i => {
      return {
        x: now + (i * fiveMins),
        y: i * 5000
      }
    })
  const points2 = range(1, 20 + 1)
    .map(i => {
      return {
        x: now + (i * fiveMins),
        y: i * 5000
      }
    })

  c.setPoints([points1, points2])

  return function unbindCharts() {
  }
}
