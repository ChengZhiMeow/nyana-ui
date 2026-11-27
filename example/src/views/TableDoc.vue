<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { NyButton, NyTag, NyTable } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

type Flower = {
  id: number
  name: string
  category: string
  price: number
  stock: number
  state: '在售' | '补货' | '下架'
}

const flowers: Flower[] = [
  { id: 1, name: '蓝色铃兰', category: '鲜花', price: 128, stock: 24, state: '在售' },
  { id: 2, name: '白桃乌龙', category: '香薰', price: 96, stock: 8, state: '补货' },
  { id: 3, name: '雪松手霜', category: '护理', price: 68, stock: 0, state: '下架' },
  { id: 4, name: '鼠尾草沐浴露', category: '护理', price: 88, stock: 45, state: '在售' },
]

const columnsBasic = [
  { key: 'name', title: '商品', width: 200 },
  { key: 'category', title: '分类', width: 120 },
  { key: 'price', title: '价格', width: 120, align: 'end' as const },
  { key: 'stock', title: '库存', width: 120, align: 'end' as const },
]

const columnsSort = [
  { key: 'name', title: '商品' },
  { key: 'price', title: '价格', align: 'end' as const, sortable: true },
  { key: 'stock', title: '库存', align: 'end' as const, sortable: true },
]

const sortRows = ref<Flower[]>([...flowers])

const sortText = ref('未排序')

function onSortChange(payload: { key: string; order: 'asc' | 'desc' | null }) {
  const { key, order } = payload

  sortText.value = order ? `${key} ${order}` : `已取消 ${key} 排序`

  if (!order) {
    sortRows.value = [...flowers]

    return
  }

  const direction = order === 'asc' ? 1 : -1
  const field = key as keyof Flower

  sortRows.value = [...flowers].sort((left, right) => {
    const a = left[field]
    const b = right[field]

    if (typeof a === 'number' && typeof b === 'number') {
      return (a - b) * direction
    }

    return String(a).localeCompare(String(b)) * direction
  })
}

const selectedKeys = ref<(string | number)[]>([])

const lastClicked = ref('')

const selectionText = computed(() => {
  const keys = selectedKeys.value.length > 0 ? selectedKeys.value.join(', ') : '无'
  const clicked = lastClicked.value ? `; 最后点击 ${lastClicked.value}` : ''

  return `已选 ${selectedKeys.value.length} 行: ${keys}${clicked}`
})

function isRowDisabled(row: Record<string, unknown>) {
  return row.stock === 0
}

function onRowClick(payload: { row: Record<string, unknown>; index: number }) {
  lastClicked.value = String(payload.row.name ?? payload.index)
}

const columnsCell = [
  { key: 'name', title: '商品', width: 180 },
  { key: 'state', title: '状态', width: 120, align: 'center' as const },
  { key: 'price', title: '价格', width: 120, align: 'end' as const },
  { key: 'actions', title: '操作', width: 140, align: 'end' as const },
]

const cellRows = ref<Flower[]>([...flowers])

const cellEmpty = ref(false)

function stateStatus(state: unknown): 'success' | 'warning' | 'danger' {
  if (state === '在售') {
    return 'success'
  }

  if (state === '补货') {
    return 'warning'
  }

  return 'danger'
}

const manyRows: Flower[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: `花束 ${index + 1} 号`,
  category: index % 2 === 0 ? '鲜花' : '绿植',
  price: 58 + index * 10,
  stock: 6 + index * 3,
  state: index % 4 === 0 ? '补货' : '在售',
}))

const loading = ref(false)

const loadingText = computed(() => `loading: ${loading.value}`)

const syncPage = ref(1)
const syncPageSize = ref(4)

const remoteAll: Flower[] = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  name: `远程花束 ${index + 1} 号`,
  category: index % 3 === 0 ? '鲜花' : '绿植',
  price: 46 + index * 7,
  stock: 4 + index * 2,
  state: index % 5 === 0 ? '补货' : '在售',
}))

const remoteRows = ref<Flower[]>([])
const remoteLoading = ref(false)
const remotePage = ref(1)
const remotePageSize = ref(5)
const remoteLog = ref('等待翻页')

async function fetchRemote(page: number, pageSize: number) {
  remoteLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 280))

  const from = (page - 1) * pageSize

  remoteRows.value = remoteAll.slice(from, from + pageSize)
  remoteLoading.value = false
}

function onRemotePageChange(payload: { page: number; pageSize: number }) {
  remoteLog.value = `请求第 ${payload.page} 页, 每页 ${payload.pageSize} 条`
  void fetchRemote(payload.page, payload.pageSize)
}

onMounted(() => {
  void fetchRemote(remotePage.value, remotePageSize.value)
})

const capRows: Flower[] = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  name: `工单 ${String(index + 1).padStart(3, '0')}`,
  category: index % 2 === 0 ? '售前' : '售后',
  price: 120 + index * 3,
  stock: index * 2,
  state: '在售',
}))

const capMaxPage = ref(2)

const capConfig = computed(() => ({
  mode: 'sync' as const,
  pageSize: 8,
  maxPage: capMaxPage.value,
}))

const codeBasic = `<NyTable :columns="columnsBasic" :data="flowers" />`

const codeStriped = `<NyTable :columns="columnsBasic" :data="flowers" striped bordered size="sm" />`

const codeSort = `<NyTable
  :columns="columnsSort"
  :data="sortRows"
  @sort-change="onSortChange"
/>`

const codeSelect = `<NyTable
  v-model:selectedKeys="selectedKeys"
  :columns="columnsBasic"
  :data="flowers"
  selectable
  :row-disabled="isRowDisabled"
  @row-click="onRowClick"
/>`

const codeCell = `<NyTable :columns="columnsCell" :data="cellRows">
  <template #state="{ row }">
    <NyTag :status="stateStatus(row.state)">{{ row.state }}</NyTag>
  </template>

  <template #actions="{ row }">
    <NyButton size="sm" variant="text" @click="edit(row)">编辑</NyButton>
  </template>

  <template #empty>
    <p class="ex-note">筛选条件太窄, 一条也没剩下。</p>
    <NyButton size="sm" @click="cellEmpty = false">重置筛选</NyButton>
  </template>
</NyTable>`

const codeFixed = `<NyTable :columns="columnsBasic" :data="manyRows" :max-height="200" :loading="loading" />`

const codeSync = `const pagination = { mode: 'sync', pageSize: 4, showSizeChanger: true }

<NyTable
  v-model:page="page"
  v-model:page-size="pageSize"
  :columns="columns"
  :data="rows"
  :pagination="pagination"
/>`

const codeAsync = `const rows = ref([])
const total = 24
const loading = ref(false)

async function fetchPage(page, pageSize) {
  loading.value = true
  const { list, total } = await api.list({ page, pageSize })
  rows.value = list
  loading.value = false
}

<NyTable
  v-model:page="page"
  :columns="columnsBasic"
  :data="rows"
  :loading="loading"
  :pagination="{ mode: 'async', total, pageSize: 5 }"
  @page-change="({ page, pageSize }) => fetchPage(page, pageSize)"
/>`

const codeCap = `// 40 条数据, 每页 8 条本来 5 页, maxPage 压在 2 页
<NyTable :columns="columnsBasic" :data="rows" :pagination="{ mode: 'sync', pageSize: 8, maxPage: 2 }">
  <template #footer>超过 2 页的部分不再展示</template>
</NyTable>`

const apiProps = [
  { name: 'columns', desc: '列配置, 字段见下一张表', type: 'NyTableColumn[]' },
  { name: 'data', desc: '行数据, 单元格默认取 row[column.key] 并转成文本; async 分页时只放当前页', type: 'Record<string, unknown>[]' },
  { name: 'rowKey', desc: '取行唯一值的字段, 取不到时退回下标', type: 'string', default: "'id'" },
  { name: 'size', desc: '尺寸档, 影响单元格内边距与字号', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'bordered', desc: '外描边加纵向分隔线', type: 'boolean', default: 'false' },
  { name: 'striped', desc: '偶数行加底色', type: 'boolean', default: 'false' },
  { name: 'hoverable', desc: '行悬浮时高亮', type: 'boolean', default: 'true' },
  { name: 'loading', desc: '加载态, 按列铺骨架条顶替数据', type: 'boolean', default: 'false' },
  { name: 'emptyText', desc: '无数据时的文案, 被 empty 插槽覆盖', type: 'string', default: "'暂无数据'" },
  { name: 'maxHeight', desc: '有值时表头吸顶, 内容区纵向滚动', type: 'number', default: '—' },
  { name: 'selectable', desc: '首列加上复选框', type: 'boolean', default: 'false' },
  { name: 'rowDisabled', desc: '返回真值的行不可勾选, 也会被全选跳过', type: '(row: Record<string, unknown>, index: number) => boolean', default: '—' },
  { name: 'pagination', desc: '内建分页, 传 true 用默认配置; 对象字段见下一张表', type: 'boolean | NyTablePagination', default: 'false' },
  { name: 'v-model:selectedKeys', desc: '选中行的 key 列表', type: '(string | number)[]', default: '[]' },
  { name: 'v-model:page', desc: '当前页码, 双向绑定', type: 'number', default: '1' },
  { name: 'v-model:pageSize', desc: '每页条数, 双向绑定, 优先于 pagination.pageSize', type: 'number', default: '10' },
]

const apiEvents = [
  { name: 'sort-change', desc: '点击带 sortable 的表头时触发, order 为 null 表示取消排序', type: '{ key: string; order: \'asc\' | \'desc\' | null }' },
  { name: 'row-click', desc: '点击行或在该行按回车时触发, 点复选框不触发', type: '{ row: Record<string, unknown>; index: number }' },
  { name: 'selection-change', desc: '勾选、取消勾选或全选后触发', type: '(string | number)[]' },
  { name: 'page-change', desc: '翻页或改每页条数后触发; sync 用来同步状态, async 用来拉这一页的数据', type: '{ page: number; pageSize: number }' },
]

const apiSlots = [
  { name: 'header-extra', desc: '表格上方的工具栏, 常放筛选与刷新按钮', type: '—' },
  { name: '[column.key]', desc: '自定义单元格, 插槽名就是列的 key', type: '{ row: Record<string, unknown>; value: unknown; index: number; column: NyTableColumn }' },
  { name: 'empty', desc: '自定义空状态, 顶替 emptyText', type: '—' },
  { name: 'footer', desc: '分页条左侧的补充内容, 只有开了分页才显示', type: '—' },
]

const apiPagination = [
  { name: 'mode', desc: "sync 把 data 整份切片, 翻页不发请求; async 认为 data 就是当前页, 翻页只发 page-change", type: "'sync' | 'async'", default: "'sync'" },
  { name: 'total', desc: '总条数, sync 默认取 data.length, async 必须给, 用来算总页数', type: 'number', default: '—' },
  { name: 'pageSize', desc: '每页条数, 被 v-model:pageSize 绑定的值覆盖', type: 'number', default: '10' },
  { name: 'maxPage', desc: '最大页数, 给分页器封顶, 超出的页不再可达', type: 'number', default: '—' },
  { name: 'pageSizes', desc: '每页条数候选, 配合 showSizeChanger 使用', type: 'number[]', default: '[10, 20, 50, 100]' },
  { name: 'showSizeChanger', desc: '显示每页条数下拉', type: 'boolean', default: 'false' },
  { name: 'showTotal', desc: '显示"共 N 条", 总条数未知时自动隐藏', type: 'boolean', default: 'true' },
  { name: 'align', desc: '分页条在表格底部的对齐方式', type: "'start' | 'center' | 'end'", default: "'end'" },
]

const apiColumn = [
  { name: 'key', desc: '列的取值字段, 同时是自定义单元格的插槽名', type: 'string' },
  { name: 'title', desc: '表头文案', type: 'string' },
  { name: 'width', desc: '列宽, 数字按 px 处理; 表格是 fixed 布局', type: 'number | string' },
  { name: 'align', desc: '单元格对齐方式', type: "'start' | 'center' | 'end'", default: "'start'" },
  { name: 'sortable', desc: '表头变成排序按钮, 点击只上报 sort-change', type: 'boolean', default: 'false' },
  { name: 'ellipsis', desc: '内容超长时省略号截断, 需要配合列宽使用', type: 'boolean', default: 'false' },
]
</script>

<template>
  <DocPage title="Table 表格" desc="排序, 选择, 固定表头与自定义单元格">

    <DemoBlock
      title="基础用法"
      desc="columns 描述列, data 描述行; 列宽用 width 给, 对齐用 align 给。表格自带分页, 见下面三节。"
      :code="codeBasic"
    >
      <NyTable :columns="columnsBasic" :data="flowers" />
    </DemoBlock>

    <DemoBlock
      title="斑马纹与描边"
      desc="striped 隔行加底色, bordered 补上外框与纵向线, 一起用在密集数据上更清楚。"
      :code="codeStriped"
    >
      <NyTable :columns="columnsBasic" :data="flowers" striped bordered size="sm" />
    </DemoBlock>

    <DemoBlock
      title="排序"
      desc="表头点一下升序, 再点降序, 第三下取消; 组件只发 sort-change, 顺序由页面自己重排。"
      :code="codeSort"
      :value="sortText"
    >
      <NyTable :columns="columnsSort" :data="sortRows" @sort-change="onSortChange" />
    </DemoBlock>

    <DemoBlock
      title="勾选"
      desc="selectable 加复选框, 表头那个支持全选与半选; 库存为 0 的行通过 rowDisabled 禁用。"
      :code="codeSelect"
      :value="selectionText"
    >
      <NyTable
        v-model:selectedKeys="selectedKeys"
        :columns="columnsBasic"
        :data="flowers"
        selectable
        :row-disabled="isRowDisabled"
        @row-click="onRowClick"
      />

      <p class="ex-note">点行本身会触发 row-click, 点复选框不会。</p>
    </DemoBlock>

    <DemoBlock
      title="自定义单元格"
      desc="插槽名就是列的 key, 状态列换成 NyTag, 操作列放按钮; 空数据由 empty 插槽接管。"
      :code="codeCell"
      :value="cellEmpty ? '数据条数: 0' : '数据条数: 4'"
    >
      <NyButton size="sm" @click="cellEmpty = !cellEmpty">
        {{ cellEmpty ? '恢复数据' : '清空数据' }}
      </NyButton>

      <NyTable :columns="columnsCell" :data="cellEmpty ? [] : cellRows">
        <template #state="{ row }">
          <NyTag :status="stateStatus(row.state)">{{ row.state }}</NyTag>
        </template>

        <template #actions>
          <NyButton size="sm" variant="text">编辑</NyButton>
        </template>

        <template #empty>
          <p class="ex-note">筛选条件太窄, 一条也没剩下。</p>
          <NyButton size="sm" @click="cellEmpty = false">重置筛选</NyButton>
        </template>
      </NyTable>
    </DemoBlock>

    <DemoBlock
      title="固定表头与加载中"
      desc="maxHeight 让表头吸顶、内容区自己滚动; loading 期间整表换成骨架行。"
      :code="codeFixed"
      :value="loadingText"
    >
      <NyButton size="sm" @click="loading = !loading">切换加载态</NyButton>

      <NyTable :columns="columnsBasic" :data="manyRows" :max-height="200" :loading="loading" />
    </DemoBlock>

    <DemoBlock
      title="内建分页 · sync"
      desc="mode 为 sync: 数据整份交给表格, 表格按当前页切一段渲染, 翻页不发请求。pageSize 也可以只写在 pagination 里。"
      :code="codeSync"
      :value="`第 ${syncPage} 页, 每页 ${syncPageSize} 条, 共 ${manyRows.length} 条`"
    >
      <NyTable
        v-model:page="syncPage"
        v-model:page-size="syncPageSize"
        :columns="columnsBasic"
        :data="manyRows"
        :pagination="{ mode: 'sync', pageSize: 4, showSizeChanger: true }"
      />
    </DemoBlock>

    <DemoBlock
      title="内建分页 · async"
      desc="mode 为 async: data 只放当前页, total 由服务端给, 翻页时用 page-change 去拉这一页。这里用 280ms 的假接口模拟。"
      :code="codeAsync"
      :value="`${remoteLog} · 当前 ${remoteRows.length} 行`"
    >
      <NyTable
        v-model:page="remotePage"
        v-model:page-size="remotePageSize"
        :columns="columnsBasic"
        :data="remoteRows"
        :loading="remoteLoading"
        :pagination="{ mode: 'async', total: remoteAll.length, pageSize: 5 }"
        @page-change="onRemotePageChange"
      />
    </DemoBlock>

    <DemoBlock
      title="最大页数"
      desc="maxPage 给总页数封顶: 40 条按 8 条一页本来 5 页, 压到 2 页后就只剩两页可翻。再点一次取消封顶。"
      :code="codeCap"
      :value="`maxPage: ${capMaxPage} (总页数上限)`"
    >
      <NyButton size="sm" @click="capMaxPage = capMaxPage === 2 ? 5 : 2">
        {{ capMaxPage === 2 ? '取消封顶(5 页)' : '封顶到 2 页' }}
      </NyButton>

      <NyTable :columns="columnsBasic" :data="capRows" :pagination="capConfig">
        <template #footer>每页 8 条, 共 {{ capRows.length }} 条</template>
      </NyTable>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyTable Props" :rows="apiProps" />
      <ApiTable title="NyTable 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyTable 插槽" kind="slots" :rows="apiSlots" />
      <ApiTable title="NyTableColumn 列配置" :rows="apiColumn" />
      <ApiTable title="pagination 分页配置" :rows="apiPagination" />
    </template>

    <template #faq>
      <p class="ex-note">
        sync 与 async 的区别只有一句话: sync 是"数据都在手上", 表格自己按当前页切一段出来渲染;
        async 是"手上只有当前页", 表格不切片, 翻页时把页码通过 page-change 抛给页面去请求接口。
      </p>
      <p class="ex-note">
        async 模式一定要给 total, 否则算不出总页数; 只想知道大概页数就传 maxPage,
        表格会按 maxPage 兜底渲染页数。maxPage 不管哪种模式都是硬上限, 超出的页翻不到。
      </p>
      <p class="ex-note">
        想跨页保留选中, 把 v-model:selectedKeys 提到页面层, 别跟着切片的数据一起重置;
        排序同样是"组件报意图、页面定顺序": 前端排序在 sort-change 里重排整个数组再交给表格切片,
        服务端排序把 key 与 order 发给接口, 拿回的新数据直接替换 data。
      </p>
    </template>
  </DocPage>
</template>
