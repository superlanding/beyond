function polyfillIntl() {
  return new Promise(resolve => {
    if (typeof Intl === 'undefined') {
      require.ensure([
        'intl',
        'intl/locale-data/jsonp/en.js'
      ], require => {
        require('intl')
        require('intl/locale-data/jsonp/en.js');
        resolve()
      })
    }
    else {
      resolve()
    }
  })
}

function polyfillTimezone() {
  return new Promise(resolve => {
    try {
      new Intl.DateTimeFormat('en', {
        timeZone: 'Asia/Taipei'
      }).format()
      resolve()
    }
    catch (err) {
      require.ensure(['date-time-format-timezone'], require => {
        require('date-time-format-timezone')
        resolve()
      }, 'DateTimeFormatTimezone')
    }
  })
}

export default function intlReady() {
  return polyfillIntl()
    .then(polyfillTimezone)
}
