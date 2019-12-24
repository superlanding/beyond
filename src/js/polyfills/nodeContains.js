if (! ('contains' in Node.prototype)) {

  Node.prototype.contains = function contains(node) {

    if (typeof node === 'undefined') {
      throw new TypeError('1 argument is required')
    }
    do {
      if (this === node) {
        return true
      }
    }
    while (node = node && node.parentNode)

    return false
  }
}
