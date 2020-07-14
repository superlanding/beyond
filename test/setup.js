// Set up JSDom.
require('jsdom-global')()

// Fix the Date object
// see <https://github.com/vuejs/vue-test-utils/issues/936#issuecomment-415386167>.
window.Date = Date
