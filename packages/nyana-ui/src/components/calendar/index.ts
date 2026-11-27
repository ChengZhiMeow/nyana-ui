import { withInstall } from '../../utils/install'

import _NyCalendar from './NyCalendar.vue'

export const NyCalendar = withInstall(_NyCalendar, 'NyCalendar')
export type { NyCalendarEvent } from './NyCalendar.vue'
