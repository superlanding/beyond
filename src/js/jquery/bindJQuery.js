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
import bindTooltipFn from './bindTooltipFn'

export default function bindJQuery(jQuery) {

  if (typeof window === 'undefined') {
    return
  }
  const $ = jQuery || (window.jQuery)

  if (typeof $ === 'undefined') {
    return
  }
  bindAutocompleteFn($)
  bindAlertFn($)
  bindBtnFn($)
  bindCheckboxFn($)
  bindDateTimeRangerFn($)
  bindDatepickerFn($)
  bindDropdownFn($)
  bindModalFn($)
  bindMenuFn($)
  bindNavbarFn($)
  bindRadioFn($)
  bindSearchDropdownFn($)
  bindSidebarFn($)
  bindTabboxFn($)
  bindTooltipFn($)
}
