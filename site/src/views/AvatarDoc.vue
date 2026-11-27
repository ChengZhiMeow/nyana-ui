<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyAvatar, NyAvatarGroup, NyButton } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const POOL = ['林清', '陈夕', '赵屿', '钱舟', '孙禾', '周野']
const members = ref(POOL.slice(0, 5).map((name, index) => ({ id: index + 1, name })))

const MAX_STEPS = [2, 3, 5]
const maxVisible = ref(3)

let nextId = members.value.length

function addMember() {
  nextId += 1
  members.value = [
    ...members.value,
    { id: nextId, name: POOL[members.value.length % POOL.length] },
  ]
}

function removeMember() {
  members.value = members.value.slice(0, -1)
}

function cycleMax() {
  const index = MAX_STEPS.indexOf(maxVisible.value)
  maxVisible.value = MAX_STEPS[(index + 1) % MAX_STEPS.length]
}

const groupInfo = computed(
  () =>
    `成员 ${members.value.length} 人, max = ${maxVisible.value} → 折叠 ${Math.max(
      0,
      members.value.length - maxVisible.value,
    )} 人`,
)

const codeImage = `<div class="ex-group">
  <NyAvatar src="https://picsum.photos/seed/nyana-1/80" alt="阿澈" />
  <NyAvatar src="https://picsum.photos/seed/nyana-2/80" alt="小满" />
  <NyAvatar src="https://picsum.photos/seed/nyana-3/80" alt="白露" />
</div>

<div class="ex-group">
  <!-- 图片加载失败时自动回退到文字, 文字缺省取 alt 的首字 -->
  <NyAvatar src="https://example.invalid/avatar.png" alt="加载失败" />
</div>`

const codeText = `<div class="ex-group">
  <NyAvatar text="林" />
  <NyAvatar text="陈" />
  <NyAvatar alt="赵屿" />
  <NyAvatar icon="user" />
</div>`

const codeSize = `<div class="ex-group">
  <NyAvatar size="xs" text="小" />
  <NyAvatar size="sm" text="小" />
  <NyAvatar size="md" text="中" />
  <NyAvatar size="lg" text="大" />
  <NyAvatar size="xl" text="大" />
</div>

<div class="ex-group">
  <NyAvatar :size="64" text="64" />
</div>`
const codeShape = `<div class="ex-group">
  <NyAvatar shape="circle" text="圆" />
  <NyAvatar shape="square" text="方" />
  <NyAvatar shape="square" color="var(--ny-accent)" text="色" />
</div>`

const codeGroup = `<div class="ex-group">
  <NyAvatarGroup :max="3">
    <NyAvatar text="林清" />
    <NyAvatar text="陈夕" />
    <NyAvatar text="赵屿" />
    <NyAvatar text="钱舟" />
    <NyAvatar text="孙禾" />
  </NyAvatarGroup>

  <NyAvatarGroup :max="2" shape="square">
    <NyAvatar text="林清" />
    <NyAvatar text="陈夕" />
    <NyAvatar text="赵屿" />
  </NyAvatarGroup>
</div>`

const codeGroupLive = `const members = ref([
  { id: 1, name: '林清' },
  { id: 2, name: '陈夕' },
  { id: 3, name: '赵屿' },
])

const maxVisible = ref(3)

<div class="ex-group">
  <NyAvatarGroup :max="maxVisible">
    <NyAvatar v-for="member in members" :key="member.id" :text="member.name" />
  </NyAvatarGroup>

  <NyButton size="sm" @click="addMember">加一位</NyButton>
  <NyButton size="sm" :disabled="!members.length" @click="removeMember">减一位</NyButton>
  <NyButton size="sm" variant="text" @click="cycleMax">切换 max</NyButton>
</div>`

const apiProps = [
  { name: 'src', desc: '图片地址, 加载失败时回退到图标或文字', type: 'string', default: "''" },
  { name: 'alt', desc: '图片替代文本, 同时用作回退文字的首字来源', type: 'string', default: "''" },
  { name: 'text', desc: '无图时显示的首字, 缺省取 alt 的首字', type: 'string', default: "''" },
  { name: 'icon', desc: '图标名, 优先级高于文字', type: 'string', default: "''" },
  { name: 'size', desc: '五档尺寸或直接给像素值', type: "NySize | 'xs' | 'xl' | number", default: "'md'" },
  { name: 'shape', desc: '外形', type: "'circle' | 'square'", default: "'circle'" },
  { name: 'color', desc: '自定义主色, 会像色卡一样铺成浅底 + 同色系深字; 缺省按文字自动取色', type: 'string', default: "''" },
]

const apiGroupProps = [
  { name: 'max', desc: '最多露几个, 其余折叠成 +N', type: 'number', default: '3' },
  { name: 'size', desc: '五档尺寸或像素值, 折叠头像与之同尺寸', type: "NySize | 'xs' | 'xl' | number", default: "'md'" },
  { name: 'shape', desc: '外形, 同时作用于折叠头像', type: "'circle' | 'square'", default: "'circle'" },
]

const apiGroupSlots = [{ name: 'default', desc: '一组 NyAvatar, 只渲染前 max 个, 多出来的收成 +N' }]
</script>

<template>
  <DocPage title="Avatar 头像" desc="图片, 文字与图标头像, 支持叠放">

    <DemoBlock
      title="图片头像"
      desc="给 src 就显示图片, 加载失败时自动退回文字或图标。"
      :code="codeImage"
    >
      <div class="ex-group">
        <NyAvatar src="https://picsum.photos/seed/nyana-1/80" alt="阿澈" />
        <NyAvatar src="https://picsum.photos/seed/nyana-2/80" alt="小满" />
        <NyAvatar src="https://picsum.photos/seed/nyana-3/80" alt="白露" />
      </div>

      <div class="ex-group">
        <span class="ex-note">故意写错的地址: </span>
        <NyAvatar src="https://example.invalid/avatar.png" alt="加载失败" />
        <span class="ex-note">图片报错后落到 alt 的首字, 换地址会重新尝试加载</span>
      </div>
    </DemoBlock>

    <DemoBlock
      title="文字与图标头像"
      desc="text 给首字, alt 也能兜底, icon 优先于文字。"
      :code="codeText"
    >
      <div class="ex-group">
        <NyAvatar text="林" />
        <NyAvatar text="陈" />
        <NyAvatar alt="赵屿" />
        <NyAvatar icon="user" />
        <NyAvatar icon="star" color="var(--ny-primary)" />
      </div>

      <p class="ex-note">底色按字符算出来, 同一段文字每次都是同一种颜色, 列表刷新不会闪色。</p>
    </DemoBlock>

    <DemoBlock title="尺寸" desc="五档预设尺寸, 也可以直接给像素值。" :code="codeSize">
      <div class="ex-group">
        <NyAvatar size="xs" text="小" />
        <span class="ex-note">xs 24</span>
        <NyAvatar size="sm" text="小" />
        <span class="ex-note">sm 28</span>
        <NyAvatar size="md" text="中" />
        <span class="ex-note">md 36</span>
        <NyAvatar size="lg" text="大" />
        <span class="ex-note">lg 44</span>
        <NyAvatar size="xl" text="大" />
        <span class="ex-note">xl 56</span>
      </div>

      <div class="ex-group">
        <NyAvatar :size="64" text="64" />
        <span class="ex-note">数值尺寸, 字号按比例跟着放大</span>
      </div>
    </DemoBlock>

    <DemoBlock title="形状与底色" desc="默认圆形, square 换成圆角方形; color 只当主色用, 底色铺它的浅调, 文字配同色系深调。" :code="codeShape">
      <div class="ex-group">
        <NyAvatar shape="circle" text="圆" />
        <NyAvatar shape="square" text="方" />
        <NyAvatar shape="square" color="var(--ny-accent)" text="色" />
        <NyAvatar shape="square" size="lg" icon="user" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="头像组"
      desc="超过 max 的成员收成一个 +N 假头像, 相邻头像用负边距叠起来。"
      :code="codeGroup"
    >
      <div class="ex-group">
        <NyAvatarGroup :max="3">
          <NyAvatar text="林清" />
          <NyAvatar text="陈夕" />
          <NyAvatar text="赵屿" />
          <NyAvatar text="钱舟" />
          <NyAvatar text="孙禾" />
        </NyAvatarGroup>

        <span class="ex-note">max = 3</span>
      </div>

      <div class="ex-group">
        <NyAvatarGroup :max="2" shape="square" size="lg">
          <NyAvatar text="林清" />
          <NyAvatar text="陈夕" />
          <NyAvatar text="赵屿" />
        </NyAvatarGroup>

        <span class="ex-note">max = 2, 方形 + lg</span>
      </div>
    </DemoBlock>

    <DemoBlock
      title="动态头像组"
      desc="成员数量与 max 都是响应式的, +N 会跟着重算。"
      :code="codeGroupLive"
      :value="groupInfo"
      backdrop="muted"
    >
      <div class="ex-group">
        <NyAvatarGroup :max="maxVisible">
          <NyAvatar v-for="member in members" :key="member.id" :text="member.name" />
        </NyAvatarGroup>

        <NyButton size="sm" @click="addMember">加一位</NyButton>
        <NyButton size="sm" :disabled="!members.length" @click="removeMember">减一位</NyButton>
        <NyButton size="sm" variant="text" @click="cycleMax">切换 max</NyButton>
      </div>

      <p class="ex-note">叠放的头像会盖住前一位, 组内每个头像带一圈底色描边, 前后层次才看得出来。</p>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyAvatar Props" :rows="apiProps" />
      <ApiTable title="NyAvatarGroup Props" :rows="apiGroupProps" />
      <ApiTable title="NyAvatarGroup 插槽" kind="slots" compact :rows="apiGroupSlots" />
    </template>
  </DocPage>
</template>
