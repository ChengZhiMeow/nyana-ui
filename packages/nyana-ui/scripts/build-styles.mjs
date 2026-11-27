// 编译按需引入用的样式: dist/core.css 与 dist/components/<组件>/style.css
// 完整的 dist/style.css 由 vite 构建 (入口导入了 styles/index.scss)
import { mkdirSync, readdirSync, existsSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import * as sass from 'sass'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'src')
const dist = join(root, 'dist')

function emit(from, to) {
  const { css } = sass.compile(from, { loadPaths: [src], style: 'compressed' })
  mkdirSync(dirname(to), { recursive: true })
  writeFileSync(to, css)
}

emit(join(src, 'styles', 'core.scss'), join(dist, 'core.css'))

let count = 0
for (const name of readdirSync(join(src, 'components'))) {
  const file = join(src, 'components', name, 'style.scss')
  if (!existsSync(file)) continue
  emit(file, join(dist, 'components', name, 'style.css'))
  count++
}
console.log(`core.css + ${count} 个组件样式`)
