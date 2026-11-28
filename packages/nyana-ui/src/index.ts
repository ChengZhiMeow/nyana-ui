import type { App, Component, Plugin } from 'vue'

import { NyAffix } from './components/affix'
import { NyAlert } from './components/alert'
import { NyAnchor } from './components/anchor'
import { NyAutoComplete } from './components/auto-complete'
import { NyAvatar, NyAvatarGroup } from './components/avatar'
import { NyAvatarCropper } from './components/avatar-cropper'
import { NyBackTop } from './components/back-top'
import { NyBadge } from './components/badge'
import { NyBreadcrumb } from './components/breadcrumb'
import { NyButton } from './components/button'
import { NyCalendar } from './components/calendar'
import { NyCard } from './components/card'
import { NyCarousel } from './components/carousel'
import { NyCascader } from './components/cascader'
import { NyCheckbox, NyCheckboxGroup } from './components/checkbox'
import { NyChoiceCard, NyChoiceGroup } from './components/choice'
import { NyCollapse, NyCollapseItem } from './components/collapse'
import { NyColorPanel, NyColorPicker } from './components/color-picker'
import { NyCommandBlock } from './components/command-block'
import { NyContainer } from './components/container'
import { NyCopyButton, NyCopyField } from './components/copy'
import { NyDateTimePicker } from './components/date-picker'
import { NyDescriptions } from './components/descriptions'
import { NyDivider } from './components/divider'
import { NyDrawer } from './components/drawer'
import { NyDropdown } from './components/dropdown'
import { NyEmpty } from './components/empty'
import { NyField } from './components/field'
import { NyFlex } from './components/flex'
import { NyFloatButton } from './components/float-button'
import { NyForm, NyFormItem } from './components/form'
import { NyGrid, NyGridItem } from './components/grid'
import { NyIcon } from './components/icon'
import { NyImage } from './components/image'
import { NyInput, NyInputShell } from './components/input'
import { NyKeyValue } from './components/key-value'
import { NyLayout } from './components/layout'
import { NyList } from './components/list'
import { NyMasonry } from './components/masonry'
import { NyMentions } from './components/mentions'
import { NyMeter } from './components/meter'
import { NyMetricCard } from './components/metric-card'
import { NyModal } from './components/modal'
import { NyNumberInput } from './components/number-input'
import { NyPageHeader } from './components/page-header'
import { NyPagination } from './components/pagination'
import { NyPill } from './components/pill'
import { NyPopconfirm } from './components/popconfirm'
import { NyPopover } from './components/popover'
import { NyProgress } from './components/progress'
import { NyRadio, NyRadioGroup } from './components/radio'
import { NyRate } from './components/rate'
import { NyRegexInput } from './components/regex-input'
import { NyResult } from './components/result'
import { NyRow } from './components/row'
import { NySegmented } from './components/segmented'
import { NySelect } from './components/select'
import { NySkeleton } from './components/skeleton'
import { NySlider } from './components/slider'
import { NySpace } from './components/space'
import { NySpin } from './components/spin'
import { NySplit } from './components/split'
import { NyStack } from './components/stack'
import { NyStatistic } from './components/statistic'
import { NySteps } from './components/steps'
import { NySwitch } from './components/switch'
import { NyTable } from './components/table'
import { NyTabs } from './components/tabs'
import { NyTag } from './components/tag'
import { NyTagInput } from './components/tag-input'
import { NyTaskSteps } from './components/task-steps'
import { NyTerminal } from './components/terminal'
import { NyTextarea } from './components/textarea'
import { NyThemeToggle } from './components/theme-toggle'
import { NyTimePicker } from './components/time-picker'
import { NyTimeline } from './components/timeline'
import { NyTooltip } from './components/tooltip'
import { NyTransfer } from './components/transfer'
import { NyTree } from './components/tree'
import { NyParagraph, NyText, NyTitle } from './components/typography'
import { NyUpload } from './components/upload'
import { NyUserCard } from './components/user-card'
import { NyWatermark } from './components/watermark'

import NyDatePicker from './components/date-picker/NyDatePicker.vue'

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
  NyColorPanel,
  NyColorPicker,
  NyDatePicker,
  NyDateTimePicker,
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
  NyPill,
  NyMeter,
  NyMetricCard,
  NyCopyButton,
  NyCopyField,
  NyKeyValue,
  NyChoiceGroup,
  NyChoiceCard,
  NyTerminal,
  NyCommandBlock,
  NyTaskSteps,
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
  NyColorPanel,
  NyColorPicker,
  NyContainer,
  NyDatePicker,
  NyDateTimePicker,
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
  NyPill,
  NyMeter,
  NyMetricCard,
  NyCopyButton,
  NyCopyField,
  NyKeyValue,
  NyChoiceGroup,
  NyChoiceCard,
  NyTerminal,
  NyCommandBlock,
  NyTaskSteps,
}

export { nyMessage } from './components/message/message'
export { nyCopy } from './components/copy/copy'
export type { NyKeyValueItem } from './components/key-value/NyKeyValue.vue'
export type { NyTerminalLine } from './components/terminal/NyTerminal.vue'
export type { NyCommandOption } from './components/command-block/NyCommandBlock.vue'
export type { NyTaskStep } from './components/task-steps/NyTaskSteps.vue'
export type { NyMessageOptions } from './components/message/message'
export type { NyMessageConfig, NyMessageItem, NyMessageType } from './components/message/messageStore'

export { nyNotification } from './components/notification/notification'
export type { NyNotificationItem, NyNotificationOptions, NyNotificationPlacement } from './components/notification/notification'
export type { NyUploadFile } from './components/upload/uploadTypes'

export { useBelow, useMediaQuery } from './composables/useMediaQuery'
export { useFocusTrap } from './composables/useFocusTrap'
export { usePopup } from './composables/usePopup'
export type { NyPopupInstance, NyPopupOptions } from './composables/usePopup'
export { lockScroll, unlockScroll, useScrollLock } from './composables/useScrollLock'
export { useValidation } from './composables/useValidation'
export type { NyValidationOptions } from './composables/useValidation'

export {
  isBrandIcon,
  isFilledIcon,
  nyBrandIcons,
  nyBrandPrefix,
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
  colorBrightness,
  hexToHsv,
  hexToRgb,
  hsvToHex,
  hsvToRgb,
  isHexColor,
  normalizeHex,
  rgbToHex,
  rgbToHsv,
} from './utils/color'
export type { NyHsv, NyRgb } from './utils/color'

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

export { describeRules, nyRuleMessages, runRules } from './utils/rule'
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
export type { NyBreadcrumbItem } from './components/breadcrumb'
export type { NyCalendarEvent } from './components/calendar'
export type { NyCascaderOption } from './components/cascader'
export type { NyDropdownItem } from './components/dropdown'
export type { NyStepItem } from './components/steps'
export type { NyTablePagination } from './components/table'
export type { NyTabItem } from './components/tabs'
export type { NyTransferItem } from './components/transfer'
export type { NyUserCardItem } from './components/user-card'
