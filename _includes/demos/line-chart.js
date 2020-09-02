import range from 'lodash.range'

export default function bindCharts() {

  const { Chart } = window.beyond
  const dom = document.getElementById('line-chart')
  const xLabel = v => {
    const d = new Date(v)
    return d.getHours() + ':' + d.getMinutes()
  }
  const yLabel = v => {
    return (v / 10000).toFixed(1) + '萬'
  }
  const c = new Chart(dom, { xLabel, yLabel })

  const now = +new Date()
  const fiveMins = 5 * 60 * 1000
  const points = range(1, 20 + 1)
    .map(i => {
      return {
        x: now + (i * fiveMins),
        y: i * 5000
      }
    })

  c.setPoints([points])

  return function unbindCharts() {
  }
}
