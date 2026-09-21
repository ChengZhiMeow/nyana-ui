<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyEmpty, NyGrid, NyList } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

type Product = {
  id: number
  name: string
  price: number
  stock: number
}

const products: Product[] = [
  { id: 1, name: '蓝色铃兰香薰', price: 128, stock: 24 },
  { id: 2, name: '白桃乌龙蜡烛', price: 96, stock: 8 },
  { id: 3, name: '雪松护手霜', price: 68, stock: 132 },
  { id: 4, name: '鼠尾草沐浴露', price: 88, stock: 0 },
]

const pairList: Product[] = products.slice(0, 2)

const loading = ref(false)

const loadingText = computed(() => `loading: ${loading.value}`)

const codeBasic = `<NyList :data="products">
  <template #default="{ item }">
    <span>{{ item.name }}</span>
  </template>
</NyList>`

const codeSlots = `<NyList :data="products">
  <template #header>本月热销</template>

  <template #default="{ item }">
    <span>{{ item.name }}</span>
  </template>

  <template #footer>共 4 条</template>
</NyList>`

const codeSplit = `<NyList :data="products" :split="false" :bordered="false" :hoverable="false">
  <template #default="{ item }">
    <span>{{ item.name }}</span>
  </template>
</NyList>`

const codeSize = `<NyList size="sm" :data="pairList">
  <template #default="{ item }">{{ item.name }}</template>
</NyList>`

const codeLoading = `<NyButton @click="loading = !loading">切换加载态</NyButton>

<NyList :data="products" :loading="loading">
  <template #default="{ item }">{{ item.name }}</template>
</NyList>`

const codeEmpty = `<NyList :data="[]">
  <template #empty>
    <NyEmpty title="还没有收藏" desc="在商品详情页点一下收藏按钮, 就会出现在这里。">
      <NyButton size="sm" variant="primary">去逛逛</NyButton>
    </NyEmpty>
  </template>
</NyList>`

const apiProps = [
  { name: 'data', desc: '列表数据, 每项原样交给默认插槽', type: 'Record<string, unknown>[]', default: '[]' },
  { name: 'bordered', desc: '容器外描边', type: 'boolean', default: 'true' },
  { name: 'split', desc: '行与行之间画分隔线', type: 'boolean', default: 'true' },
  { name: 'hoverable', desc: '行悬浮时高亮', type: 'boolean', default: 'true' },
  { name: 'size', desc: '尺寸档', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'loading', desc: '加载态, 用三行骨架顶替列表', type: 'boolean', default: 'false' },
  { name: 'emptyText', desc: '列表为空时的文案', type: 'string', default: "'暂无数据'" },
  { name: 'itemKey', desc: '取唯一值的字段, 取不到时退回下标', type: 'string', default: "'id'" },
]

const apiSlots = [
  { name: 'default', desc: '每行的内容', type: '{ item: Record<string, unknown>; index: number }' },
  { name: 'header', desc: '列表头部, 有内容时自动加下描边', type: '—' },
  { name: 'footer', desc: '列表底部, 有内容时自动加上描边', type: '—' },
  { name: 'empty', desc: '自定义空状态, 替换内置插画与文案', type: '—' },
]
</script>

<template>
  <DocPage title="List 列表" desc="带分隔线与悬浮态的基础列表">

    <DemoBlock title="基础用法" desc="data 传数组, 每行长什么样由默认插槽决定。" :code="codeBasic">
      <NyList :data="products">
        <template #default="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </NyList>
    </DemoBlock>

    <DemoBlock title="页头与页脚" desc="header / footer 插槽用来放标题与统计信息。" :code="codeSlots">
      <NyList :data="products">
        <template #header>本月热销</template>

        <template #default="{ item }">
          <span>{{ item.name }}</span>
        </template>

        <template #footer>共 4 条</template>
      </NyList>
    </DemoBlock>

    <DemoBlock
      title="分隔线与悬浮"
      desc="上面保留分隔线, 下面同时关掉 split / bordered / hoverable。"
      :code="codeSplit"
    >
      <NyList :data="pairList">
        <template #default="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </NyList>

      <NyList :data="pairList" :split="false" :bordered="false" :hoverable="false">
        <template #default="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </NyList>
    </DemoBlock>

    <DemoBlock title="三档尺寸" desc="size 同时影响行内边距与字号。" :code="codeSize">
      <NyGrid :columns="3" :gap="16">
        <NyList size="sm" :data="pairList">
          <template #default="{ item }">{{ item.name }}</template>
        </NyList>

        <NyList size="md" :data="pairList">
          <template #default="{ item }">{{ item.name }}</template>
        </NyList>

        <NyList size="lg" :data="pairList">
          <template #default="{ item }">{{ item.name }}</template>
        </NyList>
      </NyGrid>
    </DemoBlock>

    <DemoBlock
      title="加载中"
      desc="loading 为真时列表自己画骨架行, 不需要额外的占位组件。"
      :code="codeLoading"
      :value="loadingText"
    >
      <p class="ex-note">点按钮切换 loading, 观察骨架与真实内容之间的替换。</p>

      <NyButton size="sm" @click="loading = !loading">切换加载态</NyButton>

      <NyList :data="products" :loading="loading">
        <template #default="{ item }">{{ item.name }}</template>
      </NyList>
    </DemoBlock>

    <DemoBlock
      title="空状态"
      desc="无数据时用 empty 插槽接管, 可以放插画与引导按钮。"
      :code="codeEmpty"
    >
      <NyList :data="[]">
        <template #default="{ item }">{{ item.name }}</template>

        <template #empty>
          <NyEmpty title="还没有收藏" desc="在商品详情页点一下收藏按钮, 就会出现在这里。">
            <NyButton size="sm" variant="primary">去逛逛</NyButton>
          </NyEmpty>
        </template>
      </NyList>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyList Props" :rows="apiProps" />
      <ApiTable title="NyList 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
