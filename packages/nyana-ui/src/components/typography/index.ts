import { withInstall } from '../../utils/install'

import _NyTitle from './NyTitle.vue'
import _NyText from './NyText.vue'
import _NyParagraph from './NyParagraph.vue'

export const NyTitle = withInstall(_NyTitle, 'NyTitle')
export const NyText = withInstall(_NyText, 'NyText')
export const NyParagraph = withInstall(_NyParagraph, 'NyParagraph')
