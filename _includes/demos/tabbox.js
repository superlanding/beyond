document.querySelectorAll('[data-tabbox]').forEach(dom => {
  const tabbox = new Tabbox(dom)
  // you may call destroy method before the dom node is removed
  // tabbox.destroy()
})
