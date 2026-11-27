import { withInstall } from '../../utils/install'

import _NyGrid from './NyGrid.vue'
import _NyGridItem from './NyGridItem.vue'

export const NyGrid = withInstall(_NyGrid, 'NyGrid')
export const NyGridItem = withInstall(_NyGridItem, 'NyGridItem')
