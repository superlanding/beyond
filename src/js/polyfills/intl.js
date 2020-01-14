try {
  new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Taipei'
  }).format()
}
catch (err) {
  require.ensure(['date-time-format-timezone'], (require) => {
    require('date-time-format-timezone')
  }, 'DateTimeFormatTimezone')
}
