(function(beyond) {
  class Codebox {

    constructor(dom) {
      this.dom = dom
      this.currentIndex = 0
      this.init()
    }

    removeCurrentClass() {
      if (this.currentIndex !== null) {
        this.tabs[this.currentIndex].classList.remove('js-active')
      }
    }

    setBoxHeight() {
      const i = this.currentIndex
      const transform = (i === 0) ? 'none' : `translateX(-${i * 100}%)`
      this.panesBox.style.transform = transform
      // ie9
      this.panesBox.style.msTransform = transform
      this.panesBox.style.height = this.panes[i].offsetHeight + 'px'
    }

    init() {
      this.tabs = this.dom.querySelectorAll('[data-tabs] > a')
      this.panes = this.dom.querySelectorAll('[data-panes] > div')
      this.panesBox = this.dom.querySelector('[data-panes]')
      this.tabs.forEach((a, i) => {
        a._handleTabClick = () => {
          this.removeCurrentClass()
          this.currentIndex = i
          a.classList.add('js-active')
          this.setBoxHeight()
        }
        a.addEventListener('click', a._handleTabClick, false)
      })

      const [firstTab] = this.tabs
      if (firstTab) {
        firstTab.classList.add('js-active')
      }
      this.setBoxHeight()
      this.addEvents()
    }

    addEvents() {
      const { dom } = this
      if (typeof window.MutationObserver !== 'undefined') {
        const config = { attributes: true, childList: true, subtree: true }
        this.mutationObserver = new MutationObserver((mutationsList, observer) => {
          for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
              this.setBoxHeight()
            }
            else if (mutation.type === 'attributes') {
              this.setBoxHeight()
            }
          }
        })
        this.mutationObserver.observe(this.dom, config)
      }
      this._handleWindowResize = () => this.setBoxHeight()
      window.addEventListener('resize', this._handleWindowResize)
    }

    destroy() {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect()
      }
      window.removeEventListener('resize', this._handleWindowResize)
    }
  }
  beyond.Codebox = Codebox
})(window.beyond = window.beyond || {});
