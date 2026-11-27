<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyCard, NyContainer, NyGrid, NyRow, NyStack, NySwitch } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const sizes: ('sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full')[] = ['sm', 'md', 'lg', 'xl', '2xl', 'full']

const max = ref<'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'>('md')

const padding = ref(true)

const tiles = [1, 2, 3]

const codeMax = `<NyContainer max="md">
  <div class="ex-box">内容在这个宽度里居中</div>
</NyContainer>`

const codePadding = `<!-- padding 关掉后内容贴边 -->
<NyContainer max="md" :padding="padding">
  <div class="ex-box">左右留白: {{ padding }}</div>
</NyContainer>`

const codeGrid = `<NyContainer max="lg">
  <NyGrid :columns="3" :gap="16">
    <div v-for="tile in tiles" :key="tile" class="ex-tile">{{ tile }}</div>
  </NyGrid>
</NyContainer>`

const codeArticle = `<NyContainer max="md">
  <NyStack :gap="16">
    <NyCard title="标题" desc="说明文字">正文</NyCard>
    <NyCard title="标题" desc="说明文字">正文</NyCard>
  </NyStack>
</NyContainer>`

const codeFull = `<!-- max 为 full 时不限制宽度, 只保留左右留白 -->
<NyContainer max="full">
  <div class="ex-box">铺满可用宽度</div>
</NyContainer>`

const apiProps = [
  { name: 'max', desc: '最大宽度档位, full 表示不限制', type: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'", default: "'xl'" },
  { name: 'padding', desc: '左右留白, 20px, 768px 以下收窄到 14px', type: 'boolean', default: 'true' },
]

const apiSlots = [{ name: '#default', desc: '容器里的内容', type: '—' }]

const widthOf: Record<'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full', string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '不限制',
}
</script>

<template>
  <DocPage title="Container 容器" desc="限制内容最大宽度并居中">

    <DemoBlock
      title="最大宽度"
      desc="max 控制内容最大宽度, 超出部分由左右留白吃掉。"
      :code="codeMax"
      :value="`max = ${max}, 对应宽度 ${widthOf[max]}`"
    >
      <NyStack :gap="14">
        <NyRow :gap="8">
          <NyButton
            v-for="item in sizes"
            :key="item"
            size="sm"
            :variant="max === item ? 'primary' : 'default'"
            @click="max = item"
          >
            {{ item }}
          </NyButton>
        </NyRow>

        <NyContainer :max="max">
          <div class="ex-box">内容宽度受 max 限制, 并在可用宽度里居中</div>
        </NyContainer>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="左右留白"
      desc="padding 关掉后内容直接贴到容器边缘。"
      :code="codePadding"
      :value="`padding = ${padding}`"
    >
      <NyStack :gap="14">
        <NySwitch v-model:checked="padding" label="左右留白" />

        <NyContainer max="md" :padding="padding">
          <div class="ex-box">左右留白: {{ padding ? '已开启' : '已关闭' }}</div>
        </NyContainer>
      </NyStack>
    </DemoBlock>

    <DemoBlock title="与栅格组合" desc="容器负责限宽, 里面的分栏交给 NyGrid。" :code="codeGrid">
      <NyContainer max="lg">
        <NyGrid :columns="3" :gap="16">
          <div v-for="tile in tiles" :key="tile" class="ex-tile">{{ tile }}</div>
        </NyGrid>
      </NyContainer>
    </DemoBlock>

    <DemoBlock title="中栏内容页" desc="max 取 sm / md 时适合正文阅读, 一屏里只有一条主内容流。" :code="codeArticle">
      <NyContainer max="md">
        <NyStack :gap="16">
          <NyCard title="容器用法" desc="先限宽, 再在内部堆叠">
            页面主体用 NyContainer 包一层, 内部的内容区不再各自限宽, 视觉上就有一条统一的中轴线。
          </NyCard>

          <NyCard title="不要嵌套" desc="一层容器就够了">
            容器只负责最大宽度与居中, 嵌套多层只会让宽度互相压缩, 分栏请改用 NyGrid 或 NySplit。
          </NyCard>
        </NyStack>
      </NyContainer>
    </DemoBlock>

    <DemoBlock title="铺满宽度" desc="max 为 full 时不限制宽度, 需要通栏时使用。" :code="codeFull">
      <NyContainer max="full">
        <div class="ex-box">铺满可用宽度</div>
      </NyContainer>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyContainer Props" :rows="apiProps" />
      <ApiTable title="插槽" :rows="apiSlots" kind="slots" />
    </template>
  </DocPage>
</template>
