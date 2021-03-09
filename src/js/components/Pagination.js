import supportDom from '../decorators/supportDom'
import { range, noop } from '../utils'
import { $, $$ } from '../utils/dom'

@supportDom
export default class Pagination {

  constructor(config) {

    this.dom = config.dom
    this.page = config.page || 1
    this.total = config.total || 0
    this.maxVisiblePage = config.maxVisiblePage || 7
    this.currentPageItem = null
    this.nextBtnClick = config.nextBtnClick || noop
    this.pageClick = config.pageClick || noop
    this.prevBtnClick = config.prevBtnClick || noop

    this.init()
    this.addEvents()
  }

  init() {
    const { dom } = this
    this.container = $('[data-pagination]', dom)
    this.prevBtn = $('[data-prev]', dom)
    this.nextBtn = $('[data-next]', dom)
    this.drawPages()
  }

  drawPages() {
    const { container, nextBtn } = this

    $$('[data-page-item]', container)
      .map(item => item.parentNode)
      .forEach(item => item.remove())

    const fragment = document.createDocumentFragment()
    const currentPage = this.page

    range(1, this.total + 1)
      .forEach(page => {
        const li = document.createElement('li')
        li.className = 'page-item'
        const anchor = document.createElement('a')
        anchor.className = 'page-link'
        anchor.setAttribute('data-page-item', page)
        anchor.textContent = page

        if (page === currentPage) {
          anchor.classList.add('js-active')
          this.currentPageItem = anchor
        }
        li.appendChild(anchor)
        fragment.appendChild(li)
      })

    container.appendChild(fragment)
    container.removeChild(nextBtn.parentNode)
    container.appendChild(nextBtn)
  }

  isPrevBtn(target) {
    return ('prev' in target.dataset)
  }

  isNextBtn(target) {
    return ('next' in target.dataset)
  }

  isPageBtn(target) {
    return ('pageItem' in target.dataset)
  }

  handlePageClick(target) {
    const page = parseInt(target.dataset.pageItem, 10)
    if (page === this.page) {
      return
    }
    this.currentPageItem.classList.remove('js-active')
    const nextPageItem = $(`[data-page-item="${page}"]`, this.container)
    nextPageItem.classList.add('js-active')
    this.page = page
    this.currentPageItem = nextPageItem
    this.pageClick(page)
  }

  addEvents() {
    this.addEvent(this.container, 'click', event => {
      let { target } = event
      if (target.tagName === 'I') {
        target = target.parentNode
      }

      if (this.isNextBtn(target)) {
        this.nextBtnClick(target)
      }
      else if (this.isPageBtn(target)) {
        this.handlePageClick(target)
      }
      else if (this.isPrevBtn(target)) {
        this.prevBtnClick(target)
      }
    })
  }
}
