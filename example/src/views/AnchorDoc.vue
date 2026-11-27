<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { NyAnchor, NyButton, NyLayout, NyRow, NySpace, NyStack } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

import type { NySize } from '@chengzhimeow/nyana-ui'

const sizes: { value: NySize; label: string }[] = [
  { value: 'sm', label: '小' },
  { value: 'md', label: '中' },
  { value: 'lg', label: '大' },
]

const PARAGRAPHS = [
  '目录项的 key 就是目标元素的 id, 组件只按这个 id 去找, 不做任何推断。',
  '判定线默认贴在容器顶部, offset 往下挪一点, 免得吸顶的目录盖住刚滚上来的标题。',
  '一段内容够长时高亮会在滚动过程中自动切换, 使用方不需要自己写滚动监听。',
]

const basicItems = [
  {
    key: 'anchor-basic-start',
    title: '快速开始',
    children: [
      { key: 'anchor-basic-install', title: '安装' },
      { key: 'anchor-basic-import', title: '引入' },
    ],
  },
  { key: 'anchor-basic-usage', title: '使用方式' },
  { key: 'anchor-basic-limit', title: '限制' },
]

const basicSections = [
  { key: 'anchor-basic-start', title: '快速开始' },
  { key: 'anchor-basic-install', title: '安装' },
  { key: 'anchor-basic-import', title: '引入' },
  { key: 'anchor-basic-usage', title: '使用方式' },
  { key: 'anchor-basic-limit', title: '限制' },
]

const horizontalItems = [
  { key: 'anchor-horizontal-overview', title: '概览' },
  { key: 'anchor-horizontal-config', title: '配置' },
  { key: 'anchor-horizontal-changelog', title: '更新日志' },
]

const offsetItems = [
  { key: 'anchor-offset-first', title: '第一段' },
  { key: 'anchor-offset-second', title: '第二段' },
  { key: 'anchor-offset-third', title: '第三段' },
]

const missingItems = [
  { key: 'anchor-missing-exists', title: '存在的锚点' },
  { key: 'anchor-missing-typo', title: '拼错的锚点' },
  { key: 'anchor-missing-other', title: '未渲染的锚点' },
]

const eventItems = [
  { key: 'anchor-event-first', title: '第一章' },
  { key: 'anchor-event-second', title: '第二章' },
  { key: 'anchor-event-third', title: '第三章' },
]

const pageItems = [
  { key: 'anchor-box-basic', title: '基础用法' },
  { key: 'anchor-box-horizontal', title: '横向目录' },
  { key: 'anchor-box-offset', title: '判定线与尺寸' },
  { key: 'anchor-box-missing', title: '缺失锚点' },
  { key: 'anchor-box-events', title: '事件' },
]

const basicActive = ref('')
const horizontalActive = ref('')
const offsetActive = ref('')
const eventActive = ref('')
const pageActive = ref('')

const offset = ref(12)
const size = ref<NySize>('md')
const ink = ref(true)
const clickCount = ref(0)
const changeCount = ref(0)

const pageScroller = ref<HTMLElement>()

const offsetInfo = computed(
  () => `offset = ${offset.value} · size = ${size.value} · ink = ${ink.value ? 'on' : 'off'} · activeKey = ${offsetActive.value || '(空)'}`,
)

const eventInfo = computed(
  () => `activeKey = ${eventActive.value || '(空)'} · click = ${clickCount.value} · change = ${changeCount.value}`,
)

const pageInfo = computed(() => `target = .ny-layout__main · activeKey = ${pageActive.value || '(空)'}`)

function onItemClick() {
  clickCount.value += 1
}

function onChange() {
  changeCount.value += 1
}

onMounted(() => {
  const el = document.querySelector<HTMLElement>('.ny-layout__main')

  if (el) {
    pageScroller.value = el
  }
})

onBeforeUnmount(() => {
  pageScroller.value = undefined
})

const codeBasic = `const basicSections = [
  { key: 'anchor-basic-start', title: '快速开始' },
  { key: 'anchor-basic-install', title: '安装' },
  { key: 'anchor-basic-import', title: '引入' },
  { key: 'anchor-basic-usage', title: '使用方式' },
  { key: 'anchor-basic-limit', title: '限制' },
]

const basicItems = [
  {
    key: 'anchor-basic-start',
    title: '快速开始',
    children: [
      { key: 'anchor-basic-install', title: '安装' },
      { key: 'anchor-basic-import', title: '引入' },
    ],
  },
  { key: 'anchor-basic-usage', title: '使用方式' },
  { key: 'anchor-basic-limit', title: '限制' },
]

const basicActive = ref('')

<!-- 目录项的 key 就是下面每一段的 id, 外层容器自己滚动时 target 指向它的内容区 -->
<div id="anchor-box-basic" class="ex-preview ex-preview--tall">
  <NyLayout mode="blank" fill>
    <NyStack :gap="12">
      <NyAnchor
        v-model:activeKey="basicActive"
        target="#anchor-box-basic .ny-layout__main"
        :items="basicItems"
        :offset="12"
      />

      <section v-for="section in basicSections" :key="section.key" :id="section.key" class="ex-panel">
        <h4>{{ section.title }}</h4>
      </section>
    </NyStack>
  </NyLayout>
</div>`

const codeHorizontal = `const horizontalItems = [
  { key: 'anchor-horizontal-overview', title: '概览' },
  { key: 'anchor-horizontal-config', title: '配置' },
  { key: 'anchor-horizontal-changelog', title: '更新日志' },
]

<!-- 横向时指示条贴在底部当滑动下划线, 目录本身仍然可以吸顶 -->
<NyAnchor
  v-model:activeKey="horizontalActive"
  target="#anchor-box-horizontal .ny-layout__main"
  direction="horizontal"
  :items="horizontalItems"
  :offset="8"
/>`

const codeConfig = `const offsetActive = ref('')
const offset = ref(12)
const size = ref('md')
const ink = ref(true)

<NyAnchor
  v-model:activeKey="offsetActive"
  target="#anchor-box-offset .ny-layout__main"
  :items="offsetItems"
  :offset="offset"
  :size="size"
  :ink="ink"
/>`

const codeMissing = `const missingItems = [
  { key: 'anchor-missing-exists', title: '存在的锚点' },
  { key: 'anchor-missing-typo', title: '拼错的锚点' },
  { key: 'anchor-missing-other', title: '未渲染的锚点' },
]

<!-- 后两项在页面上找不到元素, 会置灰并标注 "未找到元素", 点击也不跳转 -->
<NyAnchor target="#anchor-box-missing .ny-layout__main" :items="missingItems" :affix="false" />`

const codeEvents = `const eventItems = [
  { key: 'anchor-event-first', title: '第一章' },
  { key: 'anchor-event-second', title: '第二章' },
  { key: 'anchor-event-third', title: '第三章' },
]

const eventActive = ref('')
const clickCount = ref(0)
const changeCount = ref(0)

function onItemClick() {
  clickCount += 1
}

function onChange() {
  changeCount += 1
}

<NyAnchor
  v-model:activeKey="eventActive"
  target="#anchor-box-events .ny-layout__main"
  :items="eventItems"
  @click="onItemClick"
  @change="onChange"
/>`

const codePage = `// 文档站的滚动发生在布局容器的内容区里, 所以 target 显式指向它
// 这里传的是元素本身, target 也接受 '.ny-layout__main' 这样的选择器
const pageScroller = ref<HTMLElement>()
const pageActive = ref('')

onMounted(() => {
  const el = document.querySelector<HTMLElement>('.ny-layout__main')

  if (el) {
    pageScroller.value = el
  }
})

<NyAnchor v-model:activeKey="pageActive" :target="pageScroller" :items="pageItems" :affix="false" :offset="12" />`

const apiProps = [
  {
    name: 'items',
    desc: '目录数据, key 即目标元素的 id',
    type: '{ key: string; title: string; href?: string; children?: { key: string; title: string }[] }[]',
    default: '[]',
  },
  { name: 'target', desc: '滚动容器的选择器或元素, 缺省监听 window', type: 'string | HTMLElement', default: "''" },
  { name: 'offset', desc: '判定线相对容器顶部的偏移, 也是点击后滚动停靠的位置 (px)', type: 'number', default: '0' },
  { name: 'affix', desc: '在容器内吸顶 (position: sticky)', type: 'boolean', default: 'true' },
  { name: 'direction', desc: '目录方向', type: "'vertical' | 'horizontal'", default: "'vertical'" },
  { name: 'ink', desc: '显示当前项的滑动指示条', type: 'boolean', default: 'true' },
  { name: 'size', desc: '尺寸档, 影响字号与行距', type: 'NySize', default: "'md'" },
  { name: 'activeKey', desc: '当前高亮的锚点, 支持 v-model:activeKey', type: 'string', default: "''" },
]

const apiEvents = [
  { name: 'change', desc: '当前锚点变化时触发, 点击与滚动都会走到这里', type: 'string' },
  { name: 'click', desc: '点击目录项时触发, 平滑滚动已经在组件里发起', type: '{ key: string; event: MouseEvent }' },
]

const apiItem = [
  { name: 'key', desc: '锚点标识, 也就是目标元素的 id', type: 'string', default: '必填' },
  { name: 'title', desc: '目录里显示的文案', type: 'string', default: '必填' },
  { name: 'href', desc: '自定义跳转地址; 目标元素不存在时交给浏览器跳这个地址', type: 'string', default: "'#' + key" },
  { name: 'children', desc: '二级目录, 只支持一层, 每项只有 key 与 title', type: '{ key: string; title: string }[]', default: '[]' },
]
</script>

<template>
  <DocPage title="Anchor 锚点" desc="长页面里的目录导航与滚动高亮">

    <DemoBlock
      title="基础用法"
      desc="目录项的 key 就是目标元素的 id; 演示框内部由 NyLayout 的内容区滚动, 所以 target 写的是 #anchor-box-basic .ny-layout__main。"
      :code="codeBasic"
      :value="`activeKey = ${basicActive || '(空)'}`"
    >
      <div id="anchor-box-basic" class="ex-preview ex-preview--tall">
        <NyLayout mode="blank" fill>
          <NyStack :gap="12">
            <NyAnchor
              v-model:activeKey="basicActive"
              target="#anchor-box-basic .ny-layout__main"
              :items="basicItems"
              :offset="12"
            />

            <section v-for="section in basicSections" :key="section.key" :id="section.key" class="ex-panel">
              <h4>{{ section.title }}</h4>

              <p v-for="line in PARAGRAPHS" :key="line" class="ex-note">{{ line }}</p>
            </section>
          </NyStack>
        </NyLayout>
      </div>

      <p class="ex-note">手动滚动预览框, 或者点目录里的任意一项, 高亮都会跟着走。</p>
    </DemoBlock>

    <DemoBlock
      title="横向目录"
      desc="direction 换成 horizontal 后目录排列成一行, 指示条从左侧的竖条变成底部的下划线。"
      :code="codeHorizontal"
      :value="`activeKey = ${horizontalActive || '(空)'}`"
    >
      <div id="anchor-box-horizontal" class="ex-preview ex-preview--tall">
        <NyLayout mode="blank" fill>
          <NyStack :gap="12">
            <NyAnchor
              v-model:activeKey="horizontalActive"
              target="#anchor-box-horizontal .ny-layout__main"
              direction="horizontal"
              :items="horizontalItems"
              :offset="8"
            />

            <section v-for="item in horizontalItems" :key="item.key" :id="item.key" class="ex-panel">
              <h4>{{ item.title }}</h4>

              <p v-for="line in PARAGRAPHS" :key="line" class="ex-note">{{ line }}</p>
            </section>
          </NyStack>
        </NyLayout>
      </div>
    </DemoBlock>

    <DemoBlock
      title="判定线与尺寸"
      desc="offset 决定判定线离容器顶部多远, size 控字号, ink 关掉就没有滑动指示条。"
      :code="codeConfig"
      :value="offsetInfo"
    >
      <NyRow :gap="8">
        <NyButton
          v-for="item in [12, 160]"
          :key="item"
          size="sm"
          :variant="offset === item ? 'primary' : 'default'"
          @click="offset = item"
        >
          offset = {{ item }}
        </NyButton>

        <NyButton
          v-for="item in sizes"
          :key="item.value"
          size="sm"
          :variant="size === item.value ? 'primary' : 'default'"
          @click="size = item.value"
        >
          {{ item.label }}
        </NyButton>

        <NyButton size="sm" :variant="ink ? 'primary' : 'default'" @click="ink = !ink">
          指示条 {{ ink ? '开' : '关' }}
        </NyButton>
      </NyRow>

      <div id="anchor-box-offset" class="ex-preview ex-preview--tall">
        <NyLayout mode="blank" fill>
          <NyStack :gap="12">
            <NyAnchor
              v-model:activeKey="offsetActive"
              target="#anchor-box-offset .ny-layout__main"
              :items="offsetItems"
              :offset="offset"
              :size="size"
              :ink="ink"
            />

            <section v-for="item in offsetItems" :key="item.key" :id="item.key" class="ex-panel">
              <h4>{{ item.title }}</h4>

              <p v-for="line in PARAGRAPHS" :key="line" class="ex-note">{{ line }}</p>
            </section>
          </NyStack>
        </NyLayout>
      </div>

      <p class="ex-note">offset 调大后判定线压得更低, 要滚过一段才会切换高亮; 点击目录项时也按这条线停靠。</p>
    </DemoBlock>

    <DemoBlock
      title="缺失的锚点"
      desc="目标元素不存在时目录项置灰并标注原因, 点击不跳转, 也不会让高亮卡在一个到不了的位置。"
      :code="codeMissing"
      value="缺失的锚点: anchor-missing-typo / anchor-missing-other"
    >
      <div id="anchor-box-missing" class="ex-preview">
        <NyLayout mode="blank" fill>
          <NyStack :gap="12">
            <NyAnchor target="#anchor-box-missing .ny-layout__main" :items="missingItems" :affix="false" />

            <section id="anchor-missing-exists" class="ex-panel">
              <h4>存在的锚点</h4>

              <p class="ex-note">只有这一项在页面上找得到元素, 所以它可点; 另外两项会显示成灰色并带上 "未找到元素"。</p>
            </section>
          </NyStack>
        </NyLayout>
      </div>
    </DemoBlock>

    <DemoBlock
      title="事件与双向绑定"
      desc="click 在平滑滚动发起后抛出, change 在锚点真正变化时抛出, 两者都可以拿来做埋点。"
      :code="codeEvents"
      :value="eventInfo"
    >
      <div id="anchor-box-events" class="ex-preview ex-preview--tall">
        <NyLayout mode="blank" fill>
          <NyStack :gap="12">
            <NyAnchor
              v-model:activeKey="eventActive"
              target="#anchor-box-events .ny-layout__main"
              :items="eventItems"
              :offset="12"
              @click="onItemClick"
              @change="onChange"
            />

            <section v-for="item in eventItems" :key="item.key" :id="item.key" class="ex-panel">
              <h4>{{ item.title }}</h4>

              <p v-for="line in PARAGRAPHS" :key="line" class="ex-note">{{ line }}</p>
            </section>
          </NyStack>
        </NyLayout>
      </div>
    </DemoBlock>

    <DemoBlock
      title="监听文档站自身的滚动"
      desc="target 也可以直接给元素: 这里拿到文档站的内容区, 目录项指向本页上方的几个演示框。"
      :code="codePage"
      :value="pageInfo"
    >
      <div class="ex-panel">
        <NyAnchor
          v-model:activeKey="pageActive"
          :target="pageScroller"
          :items="pageItems"
          :affix="false"
          :offset="12"
        />
      </div>

      <p class="ex-note">
        点上面的目录项会把文档站内容区滚到对应的演示框, 滚动整页时高亮同样会跟着切换。
      </p>

      <p class="ex-note">
        演示块自身是 overflow: hidden 的容器, 里面做不出吸顶效果, 所以这里把 affix 关掉了;
        真实页面里把 Anchor 放在侧栏并开启 affix, 它就会一直吸在滚动容器顶部。
      </p>
    </DemoBlock>

    <template #api>
      <NySpace direction="vertical" align="start" size="lg" block>
        <ApiTable title="NyAnchor Props" :rows="apiProps" />
        <ApiTable title="NyAnchor 事件" kind="events" :rows="apiEvents" />
        <ApiTable title="AnchorItem 字段" :rows="apiItem" />
      </NySpace>

      <p class="ex-note">目录项渲染成 a 标签, href 缺省是 #key, 所以键盘 Tab 与回车都能用。</p>
    </template>
  </DocPage>
</template>
