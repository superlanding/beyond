(function() {
  class Tabbox {

    constructor(dom) {
      this.currentNode = null
      this.dom = dom
      this.init()
    }

    init() {
      this.btns = Array.from(this.dom.querySelectorAll('button[data-tabbox-item]'))
      this.selectBoxes = Array.from(this.dom.querySelectorAll('div[data-tabbox-item]'))
      this.selects = Array.from(this.dom.querySelectorAll('div[data-tabbox-item] select'))
      this.appendSlider()
      this.addEvents()
    }

    appendSlider() {
      this.slider = document.createElement('div')
      this.slider.classList.add('js-slider')
      this.dom.appendChild(this.slider)
    }

    setSliderColor(color) {
      this.slider.style.backgroundColor = color
    }

    moveSlider({ left, width, color = '#858585' }) {
      this.slider.style.transform = `translateX(${left}px)`
      this.slider.style.width = width + 'px'
      this.slider.style.backgroundColor = color
    }

    clearSelects(args) {
      const except = args ? args.except : null
      this.selects.forEach(select => {
        if (except && (select === except)) {
          return
        }
        select.value = ''
      })
    }

    addEvents() {
      this.btns.forEach(btn => {
        const handleBtnClick = () => {
          this.clearSelects()
          this.moveSlider({
            left: btn.offsetLeft,
            width: btn.offsetWidth,
            color: btn.dataset.activeColor
          })
          this.currentNode = btn
        }
        btn._handleBtnClick = handleBtnClick
        btn.addEventListener('click', handleBtnClick, false)
      })

      this.selectBoxes.forEach(div => {
        const select = div.querySelector('select')
        const handleSelectChange = event => {
          if (event.target.value) {
            this.clearSelects({ except: select })
            this.moveSlider({
              left: div.offsetLeft,
              width: div.offsetWidth,
              color: div.dataset.activeColor
            })
            this.currentNode = select
          }
        }
        div._handleSelectChange = handleSelectChange
        select.addEventListener('change', handleSelectChange, false)
      })
    }

    destroy() {
      this.currentNode = null
      this.slider.parentNode.removeChild(this.slider)
      this.btns.forEach(btn => btn.removeEventListener('click', btn._handleBtnClick, false))
    }
  }
  const doms = document.querySelectorAll('[data-tabbox]')
  doms.forEach(dom => {
    const tabbox = new Tabbox(dom)
  })
})();
