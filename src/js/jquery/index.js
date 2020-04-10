import bindAutocompleteFn from './bindAutocompleteFn'
import bindAlertFn from './bindAlertFn'
import bindBtnFn from './bindBtnFn'
import bindDateTimeRangerFn from './bindDateTimeRangerFn'
import bindDatepickerFn from './bindDatepickerFn'
import bindCheckboxFn from './bindCheckboxFn'
import bindDropdownFn from './bindDropdownFn'
import bindMenuFn from './bindMenuFn'
import bindModalFn from './bindModalFn'
import bindNavbarFn from './bindNavbarFn'
import bindRadioFn from './bindRadioFn'
import bindSearchDropdownFn from './bindSearchDropdownFn'
import bindSidebarFn from './bindSidebarFn'
import bindTabboxFn from './bindTabboxFn'
import bindToastFn from './bindToastFn'
import bindTooltipFn from './bindTooltipFn'

export default function bindJQuery(beyond, jQuery) {

  if (typeof window === 'undefined') {
    return
  }
  const $ = jQuery || (window.jQuery)

  if (typeof $ === 'undefined') {
    return
  }

  // avoid duplicated jquery bindings
  if (beyond._boundJQuery) {
    return
  }

  bindAutocompleteFn(beyond, $)
  bindAlertFn(beyond, $)
  bindBtnFn(beyond, $)
  bindCheckboxFn(beyond, $)
  bindDateTimeRangerFn(beyond, $)
  bindDatepickerFn(beyond, $)
  bindDropdownFn(beyond, $)
  bindModalFn(beyond, $)
  bindMenuFn(beyond, $)
  bindNavbarFn(beyond, $)
  bindRadioFn(beyond, $)
  bindSearchDropdownFn(beyond, $)
  bindSidebarFn(beyond, $)
  bindTabboxFn(beyond, $)
  bindToastFn(beyond, $)
  bindTooltipFn(beyond, $)

  beyond._boundJQuery = true
}
