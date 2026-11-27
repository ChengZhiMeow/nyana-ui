import { withInstall } from '../../utils/install'

import _NyCollapse from './NyCollapse.vue'
import _NyCollapseItem from './NyCollapseItem.vue'

export const NyCollapse = withInstall(_NyCollapse, 'NyCollapse')
export const NyCollapseItem = withInstall(_NyCollapseItem, 'NyCollapseItem')
