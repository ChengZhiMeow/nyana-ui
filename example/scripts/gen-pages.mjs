// 按 src/docs/registry.ts 生成文档页: components/<key>.md 与 scenes/<名称>.md, 每页只挂载对应的 Vue 文档组件
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const registry = readFileSync(join(root, 'src/docs/registry.ts'), 'utf8')

const entries = [...registry.matchAll(/\{ key: '([^']+)', title: '([^']+)',[^}]*?file: '([^']+)'[^}]*\}/g)].map((m) => ({
  key: m[1],
  title: m[2],
  file: m[3],
  scene: m[0].includes('scene: true'),
}))

mkdirSync(join(root, 'components'), { recursive: true })
mkdirSync(join(root, 'scenes'), { recursive: true })

for (const entry of entries) {
  const name = entry.file.replace('.vue', '')
  const front = ['---', `title: ${entry.title}`, ...(entry.scene ? ['scene: true'] : []), '---', ''].join('\n')
  const body = `\n<script setup>\nimport ${name} from '../src/views/${entry.file}'\n</script>\n\n<${name} />\n`
  const file = entry.scene ? `scenes/${entry.key.replace(/^scene-/, '')}.md` : `components/${entry.key}.md`
  writeFileSync(join(root, file), front + body)
}

console.log(`${entries.length} 个文档页 (其中 ${entries.filter((e) => e.scene).length} 个场景)`)
