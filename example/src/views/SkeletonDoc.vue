<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyCard, NyGrid, NySkeleton } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const loading = ref(true)

const loadingText = computed(() => `loading: ${loading.value}`)

const codeBasic = `<NySkeleton :rows="3" />`

const codeAvatar = `<NySkeleton avatar button :rows="2" />`

const codeActive = `<NySkeleton active :rows="3" />`

const codeWidth = `<NySkeleton :width="280" :row-widths="['100%', '78%', '46%']" />`

const codeLoading = `<NyButton @click="loading = !loading">切换 loading</NyButton>

<NySkeleton :loading="loading" avatar :rows="2">
  <p>蓝色铃兰香薰上架了, 前 100 件第二件半价。</p>
</NySkeleton>`

const codeParagraph = `<NySkeleton :title="false" :rows="4" />`

const apiProps = [
  { name: 'loading', desc: '为真时渲染骨架, 为假时直接把默认插槽交出去', type: 'boolean', default: 'true' },
  { name: 'rows', desc: '段落行数, 向下取整', type: 'number', default: '3' },
  { name: 'title', desc: '是否显示标题块', type: 'boolean', default: 'true' },
  { name: 'avatar', desc: '左侧是否显示圆形头像块', type: 'boolean', default: 'false' },
  { name: 'button', desc: '右下角是否显示假按钮块', type: 'boolean', default: 'false' },
  { name: 'active', desc: '是否开启微光流动画', type: 'boolean', default: 'false' },
  { name: 'width', desc: '骨架整体宽度, 数字按 px 处理', type: 'string | number', default: '—' },
  { name: 'rowWidths', desc: '逐行宽度, 缺省时最后一行短一些', type: '(string | number)[]', default: '—' },
]

const apiSlots = [
  { name: 'default', desc: 'loading 为假时渲染的真实内容', type: '—' },
]
</script>

<template>
  <DocPage title="Skeleton 骨架屏" desc="加载中的占位结构">

    <DemoBlock title="基础骨架" desc="默认三段文字加一条标题块。" :code="codeBasic">
      <NySkeleton :rows="3" />
    </DemoBlock>

    <DemoBlock title="头像与按钮" desc="avatar 加左侧圆形块, button 加右下角假按钮。" :code="codeAvatar">
      <NyCard>
        <NySkeleton avatar button :rows="2" />
      </NyCard>
    </DemoBlock>

    <DemoBlock title="微光动效" desc="active 打开微光; 内容扫一眼就够时保持静态更安静。" :code="codeActive">
      <NyGrid :columns="2" :gap="16">
        <div>
          <p class="ex-note">active: false</p>
          <NySkeleton :rows="3" />
        </div>

        <div>
          <p class="ex-note">active: true</p>
          <NySkeleton active :rows="3" />
        </div>
      </NyGrid>
    </DemoBlock>

    <DemoBlock title="宽度与逐行宽度" desc="rowWidths 撑出长短不一的段落感。" :code="codeWidth">
      <NySkeleton :width="280" :row-widths="['100%', '78%', '46%']" />
    </DemoBlock>

    <DemoBlock
      title="切换真实内容"
      desc="loading 为假时骨架整体让位给默认插槽。"
      :code="codeLoading"
      :value="loadingText"
    >
      <NyButton size="sm" @click="loading = !loading">切换 loading</NyButton>

      <NyCard>
        <NySkeleton :loading="loading" avatar :rows="2">
          <p>蓝色铃兰香薰上架了, 前 100 件第二件半价。</p>
        </NySkeleton>
      </NyCard>
    </DemoBlock>

    <DemoBlock title="纯段落" desc="title 关掉后就是一段多行占位, 适合详情页正文。" :code="codeParagraph">
      <NySkeleton :title="false" :rows="4" />
    </DemoBlock>

    <template #api>
      <ApiTable title="NySkeleton Props" :rows="apiProps" />
      <ApiTable title="NySkeleton 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
