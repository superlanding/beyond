// 1. String.prototype.trim polyfill
if (! ''.trim) {
  // eslint-disable-next-line no-extend-native
  String.prototype.trim = function() {
    // eslint-disable-next-line no-irregular-whitespace
    return this.replace(/^[\s﻿]+|[\s﻿]+$/g, '')
  }
}
(function(window) {
  // prevent global namespace pollution
  'use strict';

  if (! window.DOMException) {
    DOMException = function(reason) {
      this.message = reason
    }
    DOMException.prototype = new Error;
  }

  let wsIndex = 0
  const wsRE = /[\11\12\14\15\40]/
  const checkIfValidClassListEntry = function(O, V) {
    if (V === '') {
      throw new DOMException(`Failed to execute '${O}' on` +
        ` 'DOMTokenList': The token provided must not be empty.`)
    }
    if ((wsIndex = V.search(wsRE)) !== -1) {
      throw new DOMException(`Failed to execute '${O}' on 'DOMTokenList': ` +
        `The token provided ('${V[wsIndex]}') contains HTML space characters,` +
        ` which are not valid in tokens.`)
    }
  }

  // 2. Implement the barebones DOMTokenList livelyness polyfill
  if (typeof DOMTokenList !== 'function') {

    (function(window) {

      const document = window.document
      const Object = window.Object
      const hasOwnProp = Object.prototype.hasOwnProperty
      const defineProperty = Object.defineProperty

      let allowTokenListConstruction = 0
      let skipPropChange = 0

      function DOMTokenList() {
        if (! allowTokenListConstruction) {
          // internally let it through
          throw new TypeError('Illegal constructor')
        }
      }
      DOMTokenList.prototype.toLocaleString = function() {
        return this.value
      }
      DOMTokenList.prototype.toString = DOMTokenList.prototype.toLocaleString

      DOMTokenList.prototype.add = function(...args) {

        const argLen = args.length
        const ele = this[' uCL']
        const proto = ele[' uCLp']
        let val = ''

        a:
        for (let v = 0; v !== argLen; ++v) {
          val = args[v] + ''
          checkIfValidClassListEntry('add', val)
          const Len = proto.length
          let resStr = val
          for (let i = 0; i !== Len; ++i) {
            if (this[i] === val) {
              continue a
            }
            else {
              resStr += ' ' + this[i]
            }
          }
          this[Len] = val
          proto.length += 1
          proto.value = resStr;
        }
        skipPropChange = 1
        ele.className = proto.value
        skipPropChange = 0
      }
      DOMTokenList.prototype.remove = function(...args) {
        const argLen = args.length
        const ele = this[' uCL']
        const proto = ele[' uCLp']
        let val = ''
        for (let v = 0; v !== argLen; ++v) {
          val = args[v] + ''
          checkIfValidClassListEntry('remove', val)
          const Len = proto.length
          let resStr = ''
          let is = 0
          for (let i = 0; i !== Len; ++i) {
            if (is) {
              this[i - 1] = this[i]
            }
            else if (this[i] !== val) {
              resStr += this[i] + ' '
            }
            else {
              is = 1
            }
          }
          if (! is) {
            continue
          }
          delete this[Len]
          proto.length -= 1
          proto.value = resStr
        }
        skipPropChange = 1
        ele.className = proto.value
        skipPropChange = 0
      }
      window.DOMTokenList = DOMTokenList

      function whenPropChanges() {
        const evt = window.event
        const prop = evt.propertyName

        if (!skipPropChange && (prop === 'className' || (prop === 'classList' && !defineProperty))) {
          const target = evt.srcElement
          const protoObjProto = target[' uCLp']
          const strval = '' + target[prop]
          const tokens = strval.trim().split(wsRE)
          const resTokenList = target[prop === 'classList' ? ' uCL' : 'classList']
          const oldLen = protoObjProto.length
          const cLen = tokens.length
          protoObjProto.length = tokens.length

          let sub = 0

          a:
          for (let cI = 0; cI !== cLen; ++cI) {
            for (let innerI = 0; innerI !== cI; ++innerI) {
              if (tokens[innerI] === tokens[cI]) {
                sub++
                continue a
              }
            }
            resTokenList[cI - sub] = tokens[cI]
          }
          for (let i = cLen - sub; i < oldLen; ++i) {
            // remove trailing indices
            delete resTokenList[i]
          }
          if (prop !== 'classList') {
            return
          }
          skipPropChange = 1, target.classList = resTokenList, target.className = strval;
          skipPropChange = 0, resTokenList.length = tokens.length - sub;
        }
      }
      function polyfillClassList(ele) {
        if ((! ele) || (!('innerHTML' in ele))) {
          throw new TypeError('Illegal invocation')
        }
        // prevent duplicate handler infinite loop
        ele.detachEvent('onpropertychange', whenPropChanges)
        allowTokenListConstruction = 1
        function ProtoObj() {
        }
        try {
          ProtoObj.prototype = new DOMTokenList()
        }
        finally {
          allowTokenListConstruction = 0
        }

        const protoObjProto = ProtoObj.prototype
        const resTokenList = new ProtoObj()
        const toks = ele.className.trim().split(wsRE)
        const cLen = toks.length
        let sub = 0

        a:
        for (let cI = 0; cI !== cLen; ++cI) {
          for (let innerI = 0; innerI !== cI; ++innerI) {
            if (toks[innerI] === toks[cI]) {
              sub++
              continue a
            }
          }
          // eslint-disable-next-line no-invalid-this
          this[cI - sub] = toks[cI]
        }
        protoObjProto.length = cLen - sub
        protoObjProto.value = ele.className
        protoObjProto[' uCL'] = ele

        if (defineProperty) {
          // IE8 & IE9 allow defineProperty on the DOM
          defineProperty(ele, 'classList', {
            enumerable: 1,
            get: function() {
              return resTokenList
            },
            configurable: 0,
            set: function(newVal) {
              skipPropChange = 1
              protoObjProto.value = (newVal += '')
              ele.className = protoObjProto.value
              skipPropChange = 0
              const toks = newVal.trim().split(wsRE)
              const oldLen = protoObjProto.length

              protoObjProto.length = toks.length
              const cLen = toks.length
              let sub = 0
              a:
              for (let cI = 0; cI !== cLen; ++cI) {
                for (let innerI=0; innerI!==cI; ++innerI) {
                  if (toks[innerI] === toks[cI]) {
                    sub++
                    continue a
                  }
                }
                resTokenList[cI-sub] = toks[cI]
              }
              for (let i = cLen-sub; i < oldLen; ++i) {
                // remove trailing indexs
                delete resTokenList[i]
              }
            }
          })

          // for accessing the hidden prototype
          defineProperty(ele, ' uCLp', {
            enumerable: 0,
            configurable: 0,
            writeable: 0,
            value: protoObj.prototype
          })

          defineProperty(protoObjProto, ' uCL', {
            enumerable: 0,
            configurable: 0,
            writeable: 0,
            value: ele
          })
        }
        else {
          ele.classList = resTokenList
          ele[' uCL'] = resTokenList
          ele[' uCLp'] = protoObj.prototype
        }
        ele.attachEvent('onpropertychange', whenPropChanges)
      }
      // Much faster & cleaner version for IE8 & IE9:
      try {
        // Should work in IE8 because Element.prototype
        // instanceof Node is true according to the specs
        window.Object.defineProperty(window.Element.prototype, 'classList', {
          enumerable: 1,
          get: function(val) {
            if (! hasOwnProp.call(this, 'classList')) {
              polyfillClassList(this)
            }
            return this.classList
          },
          configurable: 0,
          set: function(val) {
            this.className = val
          }
        })
      }
      catch (e) {
        // Less performant fallback for older browsers (IE 6-8):
        window[' uCL'] = polyfillClassList
        // the below code ensures polyfillClassList is applied to all current and future elements in the doc.
        document.documentElement.firstChild.appendChild(document.createElement('style'))
          .styleSheet.cssText = (
            // IE6
            '_*{x-uCLp:expression(!this.hasOwnProperty("classList")&&window[" uCL"](this))}' +
            // IE7-8
            '[class]{x-uCLp/**/:expression(!this.hasOwnProperty("classList")&&window[" uCL"](this))}'
          )
      }
    })(window)
  }
  // 3. Patch in unsupported methods in DOMTokenList
  (function(DOMTokenListProto, testClass) {
    if (! DOMTokenListProto.item) {
      DOMTokenListProto.item = function(i) {
        function nullCheck(n) {
          return n === void 0 ? null : n
        }
        return nullCheck(this[i])
      }
    }
    if ((! DOMTokenListProto.toggle) || (testClass.toggle('a', 0) !== false)) {
      DOMTokenListProto.toggle = function(...args) {
        const val = args[0]
        if (args.length > 1) {
          this[args[1] ? 'add' : 'remove'](val)
          return (!! args[1])
        }
        const oldValue = this.value;
        this.remove(oldValue)
        if (oldValue === this.value) {
          this.add(val)
        }
        return true
      }
    }
    if (! DOMTokenListProto.replace || typeof testClass.replace('a', 'b') !== 'boolean') {
      DOMTokenListProto.replace = function(oldToken, newToken) {
        checkIfValidClassListEntry('replace', oldToken)
        checkIfValidClassListEntry('replace', newToken)
        const oldValue = this.value;
        this.remove(oldToken)
        if (this.value !== oldValue) {
          this.add(newToken)
        }
        return true
      }
    }
    if (! DOMTokenListProto.contains) {
      DOMTokenListProto.contains = function(value) {
        const Len = this.length
        for (let i = 0; i !== Len; ++i) {
          if (this[i] === value) {
            return true
          }
        }
        return false;
      }
    }
    if (! DOMTokenListProto.forEach) {
      DOMTokenListProto.forEach = function(...args) {
        const f = args[0]
        if (args.length === 1) {
          for (let i = 0, Len = this.length; i !== Len; ++i) {
            f(this[i], i, this)
          }
        }
        else {
          for (let i = 0, Len = this.length, tArg = args[1]; i !== Len; ++i) {
            f.call(tArg, this[i], i, this)
          }
        }
      }
    }
    if (! DOMTokenListProto.entries) {
      DOMTokenListProto.entries = function() {
        const nextIndex = 0
        const that = this
        return {
          next: function() {
            return nextIndex < that.length ?
              { value: [nextIndex, that[nextIndex]], done: false } : { done: true }
          }
        }
      }
    }
    if (! DOMTokenListProto.values) {
      DOMTokenListProto.values = function() {
        const nextIndex = 0
        const that = this
        return {
          next: function() {
            return nextIndex < that.length ?
              { value: that[nextIndex], done: false } : { done: true }
          }
        }
      }
    }
    if (! DOMTokenListProto.keys) {
      DOMTokenListProto.keys = function() {
        const nextIndex = 0
        const that = this
        return {
          next: function() {
            return nextIndex < that.length ?
              { value: nextIndex, done: false } : { done: true }
          }
        }
      }
    }
  })(window.DOMTokenList.prototype, window.document.createElement('div').classList)
})(window)
