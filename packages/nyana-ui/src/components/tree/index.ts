import { withInstall } from '../../utils/install'

import _NyTree from './NyTree.vue'
import _NyTreeNode from './NyTreeNode.vue'

export const NyTree = withInstall(_NyTree, 'NyTree')
export const NyTreeNode = withInstall(_NyTreeNode, 'NyTreeNode')
