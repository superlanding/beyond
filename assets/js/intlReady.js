export default function intlReady() {
  return new Promise(resolve => {
    try {
      new Intl.DateTimeFormat('en', {
        timeZone: 'Asia/Taipei'
      }).format()
      resolve()
    }
    catch (err) {
      require.ensure(['date-time-format-timezone'], (require) => {
        require('date-time-format-timezone')
        resolve()
      }, 'DateTimeFormatTimezone')
    }
  })
}
