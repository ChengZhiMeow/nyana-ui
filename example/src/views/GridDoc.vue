<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyGrid, NyGridItem, NyRow, NyStack } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const tiles = [1, 2, 3, 4, 5, 6]

const columns = ref<number | 'auto'>(3)

const minItemWidth = ref(160)

const gap = ref<number | [number, number]>(16)

const dense = ref(true)

const gapText = computed(() =>
  Array.isArray(gap.value) ? `[${gap.value[0]}, ${gap.value[1]}]` : String(gap.value),
)

const codeColumns = `<NyGrid :columns="columns" :gap="16">
  <div v-for="tile in tiles" :key="tile" class="ex-tile">{{ tile }}</div>
</NyGrid>`

const codeAuto = `<NyGrid columns="auto" :min-item-width="minItemWidth" :gap="16">
  <div v-for="tile in tiles" :key="tile" class="ex-tile">{{ tile }}</div>
</NyGrid>`

const codeGap = `<!-- 行间距 8, 列间距 28 -->
<NyGrid :columns="3" :gap="[8, 28]">
  <div v-for="tile in tiles" :key="tile" class="ex-tile">{{ tile }}</div>
</NyGrid>`

const codeSpan = `<NyGrid :columns="4" :gap="12">
  <NyGridItem :row-span="2">
    <div class="ex-tile ex-tile--tall">跨两行</div>
  </NyGridItem>

  <NyGridItem :span="2">
    <div class="ex-box">跨两列</div>
  </NyGridItem>

  <div class="ex-box">1 列</div>
  <NyGridItem :start="3" :span="2">
    <div class="ex-box">从第 3 列开始, 跨两列</div>
  </NyGridItem>
</NyGrid>`

const codeDense = `<!-- dense 让小项回填前面留下的空位 -->
<NyGrid :columns="4" :gap="12" :dense="dense">
  <NyGridItem :span="3"><div class="ex-box">宽 3 列</div></NyGridItem>
  <NyGridItem :span="3"><div class="ex-box">宽 3 列</div></NyGridItem>
  <div class="ex-box">1 列</div>
  <div class="ex-box">1 列</div>
</NyGrid>`

const codeResponsive = `<!-- 窄屏 1 列, 640 / 768 / 1024 起分别 2 / 3 / 4 列 -->
<NyGrid :columns="1" :responsive="{ sm: 2, md: 3, lg: 4 }" :gap="16">
  <div v-for="tile in tiles" :key="tile" class="ex-tile">{{ tile }}</div>
</NyGrid>`

const apiProps = [
  { name: 'columns', desc: '固定列数, auto 按最小项宽自动排布', type: "number | 'auto'", default: "'auto'" },
  { name: 'minItemWidth', desc: 'columns 为 auto 时的最小项宽 (px)', type: 'number', default: '280' },
  { name: 'gap', desc: '行间距与列间距, 数组时是 [行, 列]', type: 'number | [number, number]', default: '18' },
  { name: 'dense', desc: '列数固定时允许小项回填空位', type: 'boolean', default: 'false' },
  { name: 'responsive', desc: '各断点下的列数覆盖: sm 640 / md 768 / lg 1024', type: "Partial<Record<'sm' | 'md' | 'lg', number>>", default: '—' },
]

const apiItemProps = [
  { name: 'span', desc: '跨列数', type: 'number', default: '1' },
  { name: 'start', desc: '起始列, 不填按顺序排布', type: 'number', default: '—' },
  { name: 'rowSpan', desc: '跨行数', type: 'number', default: '—' },
]

const apiSlots = [
  { name: 'NyGrid #default', desc: '网格项, 直接放内容或包一层 NyGridItem', type: '—' },
  { name: 'NyGridItem #default', desc: '网格项内容', type: '—' },
]
</script>

<template>
  <DocPage title="Grid 栅格" desc="固定列数与自适应列宽, 支持断点覆盖">

    <DemoBlock
      title="固定列数"
      desc="columns 给数字时按固定列数平分宽度。"
      :code="codeColumns"
      :value="`columns = ${columns}, gap = ${gapText}`"
    >
      <NyStack :gap="14">
        <NyRow :gap="8">
          <NyButton
            v-for="item in [1, 2, 3, 4]"
            :key="item"
            size="sm"
            :variant="columns === item ? 'primary' : 'default'"
            @click="columns = item"
          >
            {{ item }} 列
          </NyButton>
        </NyRow>

        <NyGrid :columns="columns" :gap="16">
          <div v-for="tile in tiles" :key="tile" class="ex-tile">{{ tile }}</div>
        </NyGrid>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="自适应列宽"
      desc="columns 给 auto 时按最小项宽决定一行能放几列。"
      :code="codeAuto"
      :value="`min-item-width = ${minItemWidth}px`"
    >
      <NyStack :gap="14">
        <NyRow :gap="8">
          <NyButton
            v-for="item in [110, 160, 240]"
            :key="item"
            size="sm"
            :variant="minItemWidth === item ? 'primary' : 'default'"
            @click="minItemWidth = item"
          >
            最小项宽 {{ item }}
          </NyButton>
        </NyRow>

        <NyGrid columns="auto" :min-item-width="minItemWidth" :gap="16">
          <div v-for="tile in tiles" :key="tile" class="ex-tile">{{ tile }}</div>
        </NyGrid>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="行间距与列间距"
      desc="gap 给数组时第一个是行间距, 第二个是列间距。"
      :code="codeGap"
      :value="`gap = ${gapText}`"
    >
      <NyStack :gap="14">
        <NyRow :gap="8">
          <NyButton size="sm" :variant="gap === 16 ? 'primary' : 'default'" @click="gap = 16">
            等距 16
          </NyButton>

          <NyButton
            size="sm"
            :variant="Array.isArray(gap) ? 'primary' : 'default'"
            @click="gap = [8, 28]"
          >
            行 8 / 列 28
          </NyButton>
        </NyRow>

        <NyGrid :columns="3" :gap="gap">
          <div v-for="tile in tiles" :key="tile" class="ex-tile">{{ tile }}</div>
        </NyGrid>
      </NyStack>
    </DemoBlock>

    <DemoBlock title="跨列与跨行" desc="NyGridItem 控制跨列 span, 起始列 start 与跨行 rowSpan。" :code="codeSpan">
      <NyGrid :columns="4" :gap="12">
        <NyGridItem :row-span="2">
          <div class="ex-tile ex-tile--tall">跨两行</div>
        </NyGridItem>

        <NyGridItem :span="2">
          <div class="ex-box">跨两列</div>
        </NyGridItem>

        <div class="ex-box">1 列</div>

        <NyGridItem :span="2">
          <div class="ex-box">跨两列</div>
        </NyGridItem>

        <NyGridItem :start="3" :span="2">
          <div class="ex-box">从第 3 列开始, 跨两列</div>
        </NyGridItem>
      </NyGrid>
    </DemoBlock>

    <DemoBlock
      title="紧凑回填"
      desc="dense 打开后, 后面的小项会回填前面留下的空位。"
      :code="codeDense"
      :value="`dense = ${dense}`"
    >
      <NyStack :gap="14">
        <NyRow :gap="8">
          <NyButton size="sm" :variant="dense ? 'primary' : 'default'" @click="dense = true">
            开启 dense
          </NyButton>

          <NyButton size="sm" :variant="dense ? 'default' : 'primary'" @click="dense = false">
            关闭 dense
          </NyButton>
        </NyRow>

        <NyGrid :columns="4" :gap="12" :dense="dense">
          <NyGridItem :span="3">
            <div class="ex-box">宽 3 列</div>
          </NyGridItem>

          <NyGridItem :span="3">
            <div class="ex-box">宽 3 列</div>
          </NyGridItem>

          <div class="ex-box">1 列</div>
          <div class="ex-box">1 列</div>
        </NyGrid>
      </NyStack>
    </DemoBlock>

    <DemoBlock title="断点覆盖" desc="responsive 按 640 / 768 / 1024 三档覆盖列数, 拖动窗口宽度看变化。" :code="codeResponsive">
      <NyStack :gap="12">
        <NyGrid :columns="1" :responsive="{ sm: 2, md: 3, lg: 4 }" :gap="16">
          <div v-for="tile in tiles" :key="tile" class="ex-tile">{{ tile }}</div>
        </NyGrid>

        <p class="ex-note">窄屏 1 列, 640px 起 2 列, 768px 起 3 列, 1024px 起 4 列。</p>
      </NyStack>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyGrid Props" :rows="apiProps" />
      <ApiTable title="NyGridItem Props" :rows="apiItemProps" />
      <ApiTable title="插槽" :rows="apiSlots" kind="slots" />
    </template>
  </DocPage>
</template>
