import type { App, Component, Plugin } from 'vue'

import NyButton from './components/basic/NyButton.vue'
import NyFloatButton from './components/basic/NyFloatButton.vue'
import NyIcon from './components/basic/NyIcon.vue'
import NyParagraph from './components/basic/NyParagraph.vue'
import NyText from './components/basic/NyText.vue'
import NyThemeToggle from './components/basic/NyThemeToggle.vue'
import NyAvatarCropper from './components/display/NyAvatarCropper.vue'
import NyUserCard from './components/display/NyUserCard.vue'
import NyTagInput from './components/form/NyTagInput.vue'
import NyTitle from './components/basic/NyTitle.vue'

import NyAffix from './components/layout/NyAffix.vue'
import NyCard from './components/layout/NyCard.vue'
import NyContainer from './components/layout/NyContainer.vue'
import NyDivider from './components/layout/NyDivider.vue'
import NyFlex from './components/layout/NyFlex.vue'
import NyGrid from './components/layout/NyGrid.vue'
import NyGridItem from './components/layout/NyGridItem.vue'
import NyLayout from './components/layout/NyLayout.vue'
import NyMasonry from './components/layout/NyMasonry.vue'
import NyPageHeader from './components/layout/NyPageHeader.vue'
import NyRow from './components/layout/NyRow.vue'
import NySpace from './components/layout/NySpace.vue'
import NySplit from './components/layout/NySplit.vue'
import NyStack from './components/layout/NyStack.vue'

import NyAnchor from './components/nav/NyAnchor.vue'
import NyBackTop from './components/nav/NyBackTop.vue'
import NyBreadcrumb from './components/nav/NyBreadcrumb.vue'
import NyDropdown from './components/nav/NyDropdown.vue'
import NyPagination from './components/nav/NyPagination.vue'
import NySegmented from './components/nav/NySegmented.vue'
import NySteps from './components/nav/NySteps.vue'
import NyTabs from './components/nav/NyTabs.vue'

import NyAvatar from './components/display/NyAvatar.vue'
import NyAvatarGroup from './components/display/NyAvatarGroup.vue'
import NyBadge from './components/display/NyBadge.vue'
import NyCalendar from './components/display/NyCalendar.vue'
import NyCarousel from './components/display/NyCarousel.vue'
import NyCollapse from './components/display/NyCollapse.vue'
import NyCollapseItem from './components/display/NyCollapseItem.vue'
import NyDescriptions from './components/display/NyDescriptions.vue'
import NyEmpty from './components/display/NyEmpty.vue'
import NyImage from './components/display/NyImage.vue'
import NyList from './components/display/NyList.vue'
import NyPopover from './components/display/NyPopover.vue'
import NySkeleton from './components/display/NySkeleton.vue'
import NyStatistic from './components/display/NyStatistic.vue'
import NyTable from './components/display/NyTable.vue'
import NyTag from './components/display/NyTag.vue'
import NyTimeline from './components/display/NyTimeline.vue'
import NyTooltip from './components/display/NyTooltip.vue'
import NyTree from './components/display/NyTree.vue'
import NyWatermark from './components/display/NyWatermark.vue'

import NyAutoComplete from './components/form/NyAutoComplete.vue'
import NyCascader from './components/form/NyCascader.vue'
import NyCheckbox from './components/form/NyCheckbox.vue'
import NyCheckboxGroup from './components/form/NyCheckboxGroup.vue'
import NyColorPicker from './components/form/NyColorPicker.vue'
import NyDatePicker from './components/form/NyDatePicker.vue'
import NyField from './components/form/NyField.vue'
import NyForm from './components/form/NyForm.vue'
import NyFormItem from './components/form/NyFormItem.vue'
import NyInput from './components/form/NyInput.vue'
import NyInputShell from './components/form/NyInputShell.vue'
import NyMentions from './components/form/NyMentions.vue'
import NyNumberInput from './components/form/NyNumberInput.vue'
import NyRadio from './components/form/NyRadio.vue'
import NyRadioGroup from './components/form/NyRadioGroup.vue'
import NyRate from './components/form/NyRate.vue'
import NyRegexInput from './components/form/NyRegexInput.vue'
import NySelect from './components/form/NySelect.vue'
import NySlider from './components/form/NySlider.vue'
import NySwitch from './components/form/NySwitch.vue'
import NyTextarea from './components/form/NyTextarea.vue'
import NyTimePicker from './components/form/NyTimePicker.vue'
import NyTransfer from './components/form/NyTransfer.vue'
import NyUpload from './components/form/NyUpload.vue'

import NyAlert from './components/feedback/NyAlert.vue'
import NyDrawer from './components/feedback/NyDrawer.vue'
import NyModal from './components/feedback/NyModal.vue'
import NyPopconfirm from './components/feedback/NyPopconfirm.vue'
import NyProgress from './components/feedback/NyProgress.vue'
import NyResult from './components/feedback/NyResult.vue'
import NySpin from './components/feedback/NySpin.vue'

import './styles/index.scss'

export const components: Record<string, Component> = {
  NyButton,
  NyFloatButton,
  NyIcon,
  NyParagraph,
  NyText,
  NyThemeToggle,
  NyTitle,
  NyAffix,
  NyCard,
  NyContainer,
  NyDivider,
  NyFlex,
  NyGrid,
  NyGridItem,
  NyLayout,
  NyMasonry,
  NyPageHeader,
  NyRow,
  NySpace,
  NySplit,
  NyStack,
  NyAnchor,
  NyBackTop,
  NyBreadcrumb,
  NyDropdown,
  NyPagination,
  NySegmented,
  NySteps,
  NyTabs,
  NyAvatar,
  NyAvatarCropper,
  NyAvatarGroup,
  NyBadge,
  NyCalendar,
  NyCarousel,
  NyCollapse,
  NyCollapseItem,
  NyDescriptions,
  NyEmpty,
  NyImage,
  NyList,
  NyPopover,
  NySkeleton,
  NyStatistic,
  NyTable,
  NyTag,
  NyTimeline,
  NyTooltip,
  NyTree,
  NyWatermark,
  NyUserCard,
  NyAutoComplete,  NyCascader,
  NyCheckbox,
  NyCheckboxGroup,
  NyColorPicker,
  NyDatePicker,
  NyField,
  NyForm,
  NyFormItem,
  NyInput,
  NyInputShell,
  NyMentions,
  NyNumberInput,
  NyRadio,
  NyRadioGroup,
  NyRate,
  NyRegexInput,
  NySelect,
  NySlider,
  NySwitch,
  NyTagInput,
  NyTextarea,
  NyTimePicker,
  NyTransfer,
  NyUpload,
  NyAlert,
  NyDrawer,
  NyModal,
  NyPopconfirm,
  NyProgress,
  NyResult,
  NySpin,
}

export const NyanaUI: Plugin = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
}

export {
  NyAffix,
  NyAlert,
  NyAnchor,
  NyAutoComplete,
  NyAvatar,
  NyAvatarCropper,
  NyAvatarGroup,
  NyBackTop,
  NyBadge,
  NyBreadcrumb,
  NyButton,
  NyCalendar,
  NyCard,
  NyCarousel,
  NyCascader,
  NyCheckbox,
  NyCheckboxGroup,
  NyCollapse,
  NyCollapseItem,
  NyColorPicker,
  NyContainer,
  NyDatePicker,
  NyDescriptions,
  NyDivider,
  NyDrawer,
  NyDropdown,
  NyEmpty,
  NyField,
  NyFlex,
  NyFloatButton,
  NyForm,
  NyFormItem,
  NyGrid,
  NyGridItem,
  NyIcon,
  NyImage,
  NyInput,
  NyInputShell,
  NyLayout,
  NyList,
  NyMasonry,
  NyMentions,
  NyModal,
  NyNumberInput,
  NyPageHeader,
  NyPagination,
  NyParagraph,
  NyPopconfirm,
  NyPopover,
  NyProgress,
  NyRadio,
  NyRadioGroup,
  NyRate,
  NyRegexInput,
  NyResult,
  NyRow,
  NySegmented,
  NySelect,
  NySkeleton,
  NySlider,
  NySpace,
  NySpin,
  NySplit,
  NyStack,
  NyStatistic,
  NySteps,
  NySwitch,
  NyTable,
  NyTabs,
  NyTag,
  NyTagInput,
  NyText,
  NyTextarea,
  NyThemeToggle,
  NyTimePicker,
  NyTimeline,
  NyTitle,
  NyTooltip,
  NyTransfer,
  NyTree,
  NyUpload,
  NyUserCard,
  NyWatermark,
}

export { nyMessage } from './components/feedback/message'
export type { NyMessageOptions } from './components/feedback/message'
export type { NyMessageConfig, NyMessageItem, NyMessageType } from './components/feedback/messageStore'

export { nyNotification } from './components/feedback/notification'
export type { NyNotificationItem, NyNotificationOptions, NyNotificationPlacement } from './components/feedback/notification'
export type { NyUploadFile } from './components/form/uploadTypes'

export { useBelow, useMediaQuery } from './composables/useMediaQuery'
export { useFocusTrap } from './composables/useFocusTrap'
export { usePopup } from './composables/usePopup'
export type { NyPopupInstance, NyPopupOptions } from './composables/usePopup'
export { lockScroll, unlockScroll, useScrollLock } from './composables/useScrollLock'
export { useValidation } from './composables/useValidation'
export type { NyValidationOptions } from './composables/useValidation'

export {
  isFilledIcon,
  nyBrandIcons,
  nyBrandViewBoxes,
  nyExtraIcons,
  nyIconFallback,
  nyIconPaths,
  nyIconViewBox,
  nyIcons,
} from './icons'
export type { NyIconName } from './icons'

export { nyPalette, nyPaletteColor, nyPaletteText } from './palette'
export type { NyPaletteColor } from './palette'

export {
  clampNumber,
  decimalPlaces,
  formatNumberText,
  normalizeNumber,
  nyNumberMessages,
  parseNumberText,
  roundNumber,
  sanitizeNumberText,
  stepNumber,
  validateNumber,
} from './utils/number'
export type { NyNumberConstraint } from './utils/number'

export {
  nyPatternPresets,
  presetConstraints,
  resolvePattern,
} from './utils/pattern'
export type { NyMatchMode, NyPatternPreset, NyPatternPresetName } from './utils/pattern'

export { nyRuleMessages, runRules } from './utils/rule'
export type { NyRuleContext } from './utils/rule'

export {
  constraintHint,
  countText,
  nyTextMessages,
  sanitizeText,
  validateText,
} from './utils/text'
export type { NyTextConstraint } from './utils/text'

export type {
  NyAlign,
  NyControlProps,
  NyDirection,
  NyFormRule,
  NyFormRules,
  NyJustify,
  NyLayoutMode,
  NyNavGroup,
  NyNavItem,
  NyOption,
  NyPlacement,
  NySize,
  NyStatus,
  NyTrigger,
  NyValidateResult,
  NyValidateTrigger,
  NyVariant,
} from './types'

export default NyanaUI
