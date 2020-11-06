import supportDom from '../decorators/supportDom'
import chartCommon from '../decorators/chartCommon'
import isDef from '../utils/isDef'
import isUndef from '../utils/isUndef'

const defaultStyles = [
  '#5469d4',
  '#7c54d4',
  '#a254d4'
]

@supportDom
@chartCommon
export default class PieChart {

  constructor(dom, options = {}) {
    this.dom = dom
    this.options = options
    this.data = []
    this.height = options.height
    this.width = options.width

    this.xPadding = isDef(options.xPadding) ? options.xPadding : 20
    this.yPadding = isDef(options.yPadding) ? options.yPadding : 20

    this.styles = options.styles || defaultStyles
    this.bgColor = options.bgColor || '#fff'

    this.init()
  }

  init() {
    this.setDpr()
    this.setDomSizeIfNeeded()
    this.setCanvas()
    this.clear()
    this.bindMedia()
    this.bindPointMouseOver()
  }

  get contentWidth() {
    return this.width - (this.xPadding * 2)
  }

  get contentHeight() {
    return this.height - (this.yPadding * 2)
  }

  bindPointMouseOver() {
    if (isUndef(this.options.onPointMouseOver)) {
      return
    }
    if (! ('onmousemove' in this.canvas)) {
      return
    }
    this.addLayer()
    const canvas = this.getHighestCanvas()
    this.addEvent(canvas, 'mousemove', throttle(this.handleMouseMove.bind(this), 30))
  }

  draw() {
    this.clear()
  }

  handleDprChange() {
    this.setDpr()
    this.refresh()
  }

  handleMouseMove(event) {
  }

  refresh() {
  }

  setData(data) {
    this.data = data
  }

  destroy() {
    const { dom, canvas } = this

    this.unbindMedia()
    this.removeAllLayers()

    if (dom.contains(canvas)) {
      dom.removeChild(canvas)
      dom.style.removeProperty('position')
    }
  }
}
