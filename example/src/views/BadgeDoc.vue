<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyBadge, NyButton, NyIcon } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const count = ref(12)
const max = ref(99)

const label = computed(() => (count.value > max.value ? `${max.value}+` : String(count.value)))
const countInfo = computed(
  () => `count = ${count.value}, max = ${max.value} → 角标显示 ${label.value}`,
)

const offset: [number, number] = [14, 4]

const codeBasic = `<div class="ex-group">
  <NyBadge :count="5">
    <NyButton>消息</NyButton>
  </NyBadge>

  <NyBadge :count="3">
    <NyIcon name="bell" :size="20" />
  </NyBadge>

  <NyBadge :count="128">
    <NyButton>待办</NyButton>
  </NyBadge>
</div>`

const codeCount = `const count = ref(12)
const max = ref(99)

<div class="ex-group">
  <NyBadge :count="count" :max="max">
    <NyButton>待办</NyButton>
  </NyBadge>

  <NyButton size="sm" @click="count += 10">+10</NyButton>
  <NyButton size="sm" @click="count = Math.max(0, count - 10)">-10</NyButton>
  <NyButton size="sm" variant="text" @click="max = max === 99 ? 9 : 99">切换 max</NyButton>
</div>

<div class="ex-group">
  <NyBadge :count="0">
    <NyButton>0 默认隐藏</NyButton>
  </NyBadge>

  <NyBadge :count="0" show-zero>
    <NyButton>showZero 显示 0</NyButton>
  </NyBadge>
</div>`

const codeDot = `<div class="ex-group">
  <NyBadge dot>
    <NyIcon name="bell" :size="20" />
  </NyBadge>

  <NyBadge dot>
    <NyButton>有新消息</NyButton>
  </NyBadge>

  <NyBadge dot />
</div>`

const codeStatus = `const statuses = [
  { status: 'success', text: '在线' },
  { status: 'warning', text: '延迟' },
  { status: 'danger', text: '离线' },
  { status: 'default', text: '未部署' },
]

<div class="ex-group">
  <NyBadge v-for="item in statuses" :key="item.status" :status="item.status" :text="item.text" />
</div>

<div class="ex-group">
  <NyBadge dot status="success" text="只想要小圆点" />
</div>`

const codeSkin = `<div class="ex-group">
  <NyBadge :count="6" size="sm">
    <NyButton size="sm">小</NyButton>
  </NyBadge>

  <NyBadge :count="6" size="md">
    <NyButton size="md">中</NyButton>
  </NyBadge>

  <NyBadge :count="6" size="lg">
    <NyButton size="lg">大</NyButton>
  </NyBadge>
</div>

<div class="ex-group">
  <NyBadge :count="3" color="var(--ny-accent)">
    <NyButton>自定义底色</NyButton>
  </NyBadge>

  <NyBadge :count="9" :offset="[14, 4]">
    <NyButton>自定义偏移</NyButton>
  </NyBadge>
</div>`

const apiProps = [
  { name: 'count', desc: '数字角标, 0 默认隐藏', type: 'number', default: '—' },
  { name: 'max', desc: '超过这个值显示成 max+', type: 'number', default: '99' },
  { name: 'dot', desc: '只显示小圆点, 不显示数字', type: 'boolean', default: 'false' },
  { name: 'status', desc: '状态点形态, 有值时忽略 count', type: 'NyStatus', default: '—' },
  { name: 'text', desc: '状态形态或纯文字徽标的文案', type: 'string', default: "''" },
  { name: 'size', desc: '尺寸档', type: 'NySize', default: "'md'" },
  { name: 'showZero', desc: 'count 为 0 时也显示', type: 'boolean', default: 'false' },
  { name: 'offset', desc: '相对右上角的偏移, [x, y]', type: '[number, number]', default: '—' },
  { name: 'color', desc: '自定义底色, 覆盖状态色; 默认取色卡里的红 --ny-red', type: 'string', default: "''" },
]

const apiSlots = [
  { name: 'default', desc: '角标挂载的内容, 给了内容就贴到它的右上角, 不给则独立显示' },
]
</script>

<template>
  <DocPage title="Badge 徽标" desc="数字, 小圆点与状态点">

    <DemoBlock
      title="数字徽标"
      desc="默认插槽里的内容就是角标的挂载点, 不给内容时角标独立显示。"
      :code="codeBasic"
    >
      <div class="ex-group">
        <NyBadge :count="5">
          <NyButton>消息</NyButton>
        </NyBadge>

        <NyBadge :count="3">
          <NyIcon name="bell" :size="20" />
        </NyBadge>

        <span class="ex-note">独立使用: </span>
        <NyBadge :count="128" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="最大值与零值"
      desc="超过 max 显示成 max+, count 为 0 默认隐藏, showZero 才显示 0。"
      :code="codeCount"
      :value="countInfo"
      backdrop="muted"
    >
      <div class="ex-group">
        <NyBadge :count="count" :max="max">
          <NyButton>待办</NyButton>
        </NyBadge>

        <NyButton size="sm" @click="count += 10">+10</NyButton>
        <NyButton size="sm" :disabled="count === 0" @click="count = Math.max(0, count - 10)">
          -10
        </NyButton>
        <NyButton size="sm" variant="text" @click="max = max === 99 ? 9 : 99">
          max 切到 {{ max === 99 ? 9 : 99 }}
        </NyButton>
      </div>

      <div class="ex-group">
        <NyBadge :count="0">
          <NyButton>0 默认隐藏</NyButton>
        </NyBadge>

        <NyBadge :count="0" show-zero>
          <NyButton>showZero 显示 0</NyButton>
        </NyBadge>
      </div>
    </DemoBlock>

    <DemoBlock title="小圆点" desc="dot 用来表示有新内容, 不带数字。" :code="codeDot">
      <div class="ex-group">
        <NyBadge dot>
          <NyIcon name="bell" :size="20" />
        </NyBadge>

        <NyBadge dot>
          <NyButton>有新消息</NyButton>
        </NyBadge>

        <span class="ex-note">独立使用: </span>
        <NyBadge dot />
      </div>
    </DemoBlock>

    <DemoBlock title="状态点" desc="status 有值时切成状态点加文字, 此时忽略 count。" :code="codeStatus">
      <div class="ex-group">
        <NyBadge status="success" text="在线" />
        <NyBadge status="warning" text="延迟" />
        <NyBadge status="danger" text="离线" />
        <NyBadge status="primary" text="主节点" />
        <NyBadge status="default" text="未部署" />
      </div>

      <div class="ex-group">
        <NyBadge dot status="success" text="只要圆点不要文字" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="尺寸, 颜色与偏移"
      desc="size 与内容尺寸一起调最好看, color 接任意 CSS 颜色, 推荐用主题令牌。"
      :code="codeSkin"
    >
      <div class="ex-group">
        <NyBadge :count="6" size="sm">
          <NyButton size="sm">小</NyButton>
        </NyBadge>

        <NyBadge :count="6" size="md">
          <NyButton size="md">中</NyButton>
        </NyBadge>

        <NyBadge :count="6" size="lg">
          <NyButton size="lg">大</NyButton>
        </NyBadge>
      </div>

      <div class="ex-group">
        <NyBadge :count="3" color="var(--ny-accent)">
          <NyButton>自定义底色</NyButton>
        </NyBadge>

        <NyBadge :count="9" :offset="offset">
          <NyButton>自定义偏移</NyButton>
        </NyBadge>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyBadge Props" :rows="apiProps" />
      <ApiTable title="NyBadge 插槽" kind="slots" compact :rows="apiSlots" />
    </template>
  </DocPage>
</template>
