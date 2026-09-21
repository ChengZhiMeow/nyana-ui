<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyPagination, NySpace } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const total = 120
const page = ref(1)

const sizedPage = ref(1)
const sizedPageSize = ref(20)
const sizedTotal = 260
const sizedCount = computed(() => Math.ceil(sizedTotal / sizedPageSize.value))

const foldedPage = ref(6)
const foldedTotal = 500
const foldedCount = foldedTotal / 10

const simplePage = ref(3)
const simpleTotal = 96

const smallPage = ref(2)
const largePage = ref(4)

const eventPage = ref(1)
const eventTotal = 88
const lastChange = ref('还没有触发')

function onChange(payload: { page: number; pageSize: number }) {
  lastChange.value = `page ${payload.page} · pageSize ${payload.pageSize}`
}

const codeBasic = `const page = ref(1)

<NyPagination v-model:page="page" :total="120" />`

const codeSize = `const page = ref(1)
const pageSize = ref(20)

<NyPagination
  v-model:page="page"
  v-model:page-size="pageSize"
  :total="260"
  :page-sizes="[10, 20, 50]"
  show-size-changer
/>`

const codeFolded = `<!-- 页数超过 maxButtons 时首尾各留一个, 当前页前后各留一个 -->
<NyPagination v-model:page="page" :total="500" :max-buttons="7" />`

const codeSimple = `<!-- 精简模式: 只留上一页 / 当前页与总页数 / 下一页 -->
<NyPagination v-model:page="page" :total="96" simple />`

const codeState = `<NyPagination v-model:page="page" :total="120" size="sm" />
<NyPagination v-model:page="page" :total="120" size="lg" />
<NyPagination v-model:page="page" :total="120" disabled />`

const codeEvent = `<NyPagination
  v-model:page="page"
  :total="88"
  :show-total="false"
  @change="onChange"
/>

function onChange(payload: { page: number; pageSize: number }) {
  console.log(payload.page, payload.pageSize)
}`

const apiProps = [
  { name: 'total', desc: '总条数, 为 0 时整个分页不渲染', type: 'number', default: '—' },
  { name: 'pageSize', desc: '每页条数, 与 v-model:pageSize 同源', type: 'number', default: '10' },
  { name: 'size', desc: '尺寸档位', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'showTotal', desc: '左侧显示 "共 N 条"', type: 'boolean', default: 'true' },
  { name: 'showSizeChanger', desc: '显示每页条数下拉', type: 'boolean', default: 'false' },
  { name: 'pageSizes', desc: '每页条数的可选项', type: 'number[]', default: '[10, 20, 50, 100]' },
  { name: 'simple', desc: '精简模式, 只留上一页与下一页', type: 'boolean', default: 'false' },
  { name: 'disabled', desc: '整组禁用', type: 'boolean', default: 'false' },
  { name: 'maxButtons', desc: '最多几个页码按钮, 超出折成省略号', type: 'number', default: '7' },
  { name: 'maxPage', desc: '最大页数, 给总页数封顶; 只传 maxPage 不传 total 时按 maxPage 渲染', type: 'number', default: '—' },
  { name: 'v-model:page', desc: '当前页, 双向绑定; 越界值会被拉回合法区间', type: 'number', default: '1' },
  { name: 'v-model:pageSize', desc: '每页条数, 双向绑定; 改变后回到第 1 页', type: 'number', default: '10' },
]

const apiEvents = [
  { name: 'change', desc: '翻页或改每页条数时触发', type: '{ page: number; pageSize: number }' },
]
</script>

<template>
  <DocPage title="Pagination 分页" desc="页码折叠, 每页条数与总数">

    <DemoBlock
      title="基础用法"
      desc="页码与每页条数都是双向绑定, 越界的 page 会被自动拉回来。"
      :code="codeBasic"
      :value="`当前第 ${page} 页 · 共 ${total} 条`"
    >
      <NyPagination v-model:page="page" :total="total" />
    </DemoBlock>

    <DemoBlock
      title="每页条数"
      desc="showSizeChanger 打开下拉, 换页长后页码回到第 1 页。"
      :code="codeSize"
      :value="`当前第 ${sizedPage} / ${sizedCount} 页 · 每页 ${sizedPageSize} 条`"
    >
      <NyPagination
        v-model:page="sizedPage"
        v-model:page-size="sizedPageSize"
        :total="sizedTotal"
        :page-sizes="[10, 20, 50]"
        show-size-changer
      />
    </DemoBlock>

    <DemoBlock
      title="页码折叠"
      desc="页数多于 maxButtons 时首尾各留一个, 当前页前后各留一个, 其余折成省略号。"
      :code="codeFolded"
      :value="`当前第 ${foldedPage} 页 · 共 ${foldedCount} 页`"
    >
      <NyPagination v-model:page="foldedPage" :total="foldedTotal" />
    </DemoBlock>

    <DemoBlock
      title="精简模式"
      desc="simple 只保留上一页 / 当前页与总页数 / 下一页, 适合空间紧张的场景。"
      :code="codeSimple"
      :value="`当前第 ${simplePage} 页 · 共 ${simpleTotal} 条`"
    >
      <NyPagination v-model:page="simplePage" :total="simpleTotal" simple />
    </DemoBlock>

    <DemoBlock
      title="尺寸与禁用"
      desc="三档尺寸与整组禁用, 禁用时所有按钮不可点。"
      :code="codeState"
      :value="`小号第 ${smallPage} 页 · 大号第 ${largePage} 页 · 禁用组固定在第 ${page} 页`"
    >
      <NySpace direction="vertical" align="start" block>
        <NyPagination v-model:page="smallPage" :total="total" size="sm" />
        <NyPagination v-model:page="largePage" :total="total" size="lg" />
        <NyPagination v-model:page="page" :total="total" disabled />
      </NySpace>
    </DemoBlock>

    <DemoBlock
      title="事件与总数"
      desc="showTotal 关掉后左侧不留文案, change 里能同时拿到页码与每页条数。"
      :code="codeEvent"
      :value="`最近一次 change: ${lastChange}`"
    >
      <NySpace direction="vertical" align="start">
        <NyPagination
          v-model:page="eventPage"
          :total="eventTotal"
          :show-total="false"
          @change="onChange"
        />

        <span class="ex-note">当前第 {{ eventPage }} 页</span>
      </NySpace>
    </DemoBlock>

    <template #api>
      <NySpace direction="vertical" align="start" size="lg" block>
        <ApiTable title="NyPagination Props" :rows="apiProps" />
        <ApiTable title="NyPagination 事件" kind="events" :rows="apiEvents" />
      </NySpace>

      <p class="ex-note">没有插槽: 文案与结构全部内置, 只通过 props 调整。</p>
    </template>
  </DocPage>
</template>
