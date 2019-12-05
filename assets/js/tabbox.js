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
      const [firstBtn] = this.btns
      if (firstBtn) {
        this.slider.style.top = (firstBtn.offsetHeight - this.slider.offsetHeight) + 'px'
      }
    }

    setSliderColor(color) {
      this.slider.style.backgroundColor = color
    }

    moveSlider({ top, left, width, color = '#858585' }) {
      this.slider.style.transform = `translate(${left}px, ${top}px)`
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

    removeCurrentClass() {
      if (this.currentNode) {
        this.currentNode.classList.remove('js-current')
      }
    }

    addCurrentClass() {
      if (this.currentNode) {
        this.currentNode.classList.add('js-current')
      }
    }

    addEvents() {
      this.btns.forEach(btn => {
        const handleBtnClick = () => {
          this.removeCurrentClass()
          this.clearSelects()
          this.moveSlider({
            top: btn.offsetTop,
            left: btn.offsetLeft,
            width: btn.offsetWidth,
            color: btn.dataset.activeColor
          })
          this.currentNode = btn
          this.addCurrentClass()
        }
        btn._handleBtnClick = handleBtnClick
        btn.addEventListener('click', handleBtnClick, false)
      })

      this.selectBoxes.forEach(div => {
        const select = div.querySelector('select')
        const handleSelectChange = event => {
          if (event.target.value) {
            this.removeCurrentClass()
            this.clearSelects({ except: select })
            this.moveSlider({
              top: div.offsetTop,
              left: div.offsetLeft,
              width: div.offsetWidth,
              color: div.dataset.activeColor
            })
            this.currentNode = select
            this.addCurrentClass()
          }
        }
        select._handleSelectChange = handleSelectChange
        select.addEventListener('change', handleSelectChange, false)

        const handleSelectFocus = () => {
          select.parentNode.classList.add('js-focus')
        }
        select._handleSelectFocus = handleSelectFocus
        select.addEventListener('focus', handleSelectFocus, false)

        const handleSelectBlur = () => {
          select.parentNode.classList.remove('js-focus')
        }
        select._handleSelectBlur = handleSelectBlur
        select.addEventListener('blur', handleSelectBlur, false)
      })
    }

    destroy() {
      this.currentNode = null
      this.slider.parentNode.removeChild(this.slider)
      this.btns.forEach(btn => btn.removeEventListener('click', btn._handleBtnClick, false))
      this.selects.forEach(select => {
        select.removeEventListener('change', select._handleSelectChange, false)
        select.removeEventListener('focus', select._handleSelectFocus, false)
        select.removeEventListener('blur', select._handleSelectBlur, false)
      })
    }
  }
  const doms = document.querySelectorAll('[data-tabbox]')
  doms.forEach(dom => {
    const tabbox = new Tabbox(dom)
  })
})();
