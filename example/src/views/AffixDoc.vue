<script setup lang="ts">
import { ref } from 'vue'

import { NyAffix, NyButton, NyGrid, NyLayout, NyRow, NyStack } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const lines = [1, 2, 3, 4, 5, 6, 7, 8]

const offsetTop = ref(72)
const offsetBottom = ref(0)
const pageOffsetTop = ref(80)
const zIndex = ref(50)

const codeTop = `<div id="affix-scroll-box" class="ex-preview">
  <NyLayout mode="blank" fill>
    <p class="ex-note">这里是 target 指向的滚动容器</p>
    <div class="ex-box">占位内容</div>

    <NyAffix target="#affix-scroll-box .ny-layout__main" :offset-top="offsetTop">
      <div class="ex-box">固钉内容</div>
    </NyAffix>

    <div v-for="line in lines" :key="line" class="ex-box">占位内容</div>
  </NyLayout>
</div>`

const codeBottom = `<!-- 元素在视口外时贴在视口底部, 滚进视野后落回原位 -->
<NyAffix target="#affix-scroll-box .ny-layout__main" :offset-bottom="offsetBottom">
  <div class="ex-box">常驻底部的操作条</div>
</NyAffix>`

const codePage = `<!-- target 可以是任意选择器, 这里用文档站自身的滚动容器 -->
<NyGrid :columns="3" :gap="16">
  <NyAffix target=".ny-layout__main" :offset-top="pageOffsetTop">
    <div class="ex-box">跟着整页滚动固定</div>
  </NyAffix>
</NyGrid>`

const codeLayer = `<!-- 固定后是视口定位, 层级要自己给 -->
<NyAffix target="#affix-scroll-box .ny-layout__main" :offset-top="0" :z-index="zIndex">
  <div class="ex-box">固钉内容</div>
</NyAffix>`

const apiProps = [
  { name: 'offsetTop', desc: '距视口上边缘的距离 (px), 与 offsetBottom 二选一', type: 'number', default: '0' },
  { name: 'offsetBottom', desc: '距视口下边缘的距离 (px), 给了它就固定在底部', type: 'number', default: 'undefined' },
  { name: 'target', desc: '监听滚动的容器, 选择器或元素; 不传时监听 window', type: 'string | HTMLElement', default: 'undefined' },
  { name: 'zIndex', desc: '固定后的层级, 不传则不写 z-index', type: 'number', default: 'undefined' },
]

const apiSlots = [
  { name: '#default', desc: '固钉内容, 固定后宽度保持原样, 原位留下等高的占位元素', type: '—' },
]
</script>

<template>
  <DocPage title="Affix 固钉" desc="滚动到阈值后固定在视口边缘">

    <DemoBlock
      title="固定在容器顶部"
      desc="target 指向预览框里的滚动容器; 容器向下滚到阈值后固钉固定在视口顶部, 滚回原处落回原位。"
      :code="codeTop"
      :value="`offset-top = ${offsetTop}`"
    >
      <NyStack :gap="12">
        <NyRow :gap="8">
          <NyButton
            v-for="item in [72, 96, 120]"
            :key="item"
            size="sm"
            :variant="offsetTop === item ? 'primary' : 'default'"
            @click="offsetTop = item"
          >
            offset-top = {{ item }}
          </NyButton>
        </NyRow>

        <div id="affix-top-box" class="ex-preview">
          <NyLayout mode="blank" fill>
            <NyStack :gap="12">
              <p class="ex-note">
                预览框自身固定 360px 高, 内部由 NyLayout 的内容区滚动,
                所以 target 写的是 #affix-top-box .ny-layout__main。
              </p>

              <div class="ex-box">占位内容 1</div>
              <div class="ex-box">占位内容 2</div>

              <NyAffix target="#affix-top-box .ny-layout__main" :offset-top="offsetTop">
                <div class="ex-box">固钉: offset-top = {{ offsetTop }}</div>
              </NyAffix>

              <div v-for="line in lines" :key="line" class="ex-box">占位内容 {{ line }}</div>
            </NyStack>
          </NyLayout>
        </div>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="固定在视口底部"
      desc="给 offsetBottom 时, 元素在视口外就贴在底部; 把容器滚到底部它就落回原位。"
      :code="codeBottom"
      :value="`offset-bottom = ${offsetBottom}`"
    >
      <NyStack :gap="12">
        <NyRow :gap="8">
          <NyButton
            v-for="item in [0, 16, 32]"
            :key="item"
            size="sm"
            :variant="offsetBottom === item ? 'primary' : 'default'"
            @click="offsetBottom = item"
          >
            offset-bottom = {{ item }}
          </NyButton>
        </NyRow>

        <div id="affix-bottom-box" class="ex-preview">
          <NyLayout mode="blank" fill>
            <NyStack :gap="12">
              <p class="ex-note">常驻底部的操作条: 元素自然位置在视口下方时先贴在底部, 滚进视野后回到文档流。</p>

              <div v-for="line in lines" :key="line" class="ex-box">占位内容 {{ line }}</div>

              <NyAffix target="#affix-bottom-box .ny-layout__main" :offset-bottom="offsetBottom">
                <div class="ex-box">固钉: offset-bottom = {{ offsetBottom }}</div>
              </NyAffix>

              <p class="ex-note">结尾说明: 容器滚到底部后固钉落回这里。</p>
            </NyStack>
          </NyLayout>
        </div>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="跟随页面滚动"
      desc="target 也可以是文档站自身的滚动容器, 这时固钉跟着整页滚动固定。"
      :code="codePage"
      :value="`offset-top = ${pageOffsetTop}`"
    >
      <NyStack :gap="12">
        <NyRow :gap="8">
          <NyButton
            v-for="item in [80, 120, 160]"
            :key="item"
            size="sm"
            :variant="pageOffsetTop === item ? 'primary' : 'default'"
            @click="pageOffsetTop = item"
          >
            offset-top = {{ item }}
          </NyButton>
        </NyRow>

        <NyGrid :columns="3" :gap="16">
          <NyAffix target=".ny-layout__main" :offset-top="pageOffsetTop">
            <div class="ex-box">固钉: 随页面滚动固定, offset-top = {{ pageOffsetTop }}</div>
          </NyAffix>
        </NyGrid>

        <p class="ex-note">
          不传 target 时 Affix 只监听 window 滚动; 文档站的滚动发生在布局容器的内容区里,
          所以这里显式给出 target。固钉放在一列里, 固定后宽度仍是这一列的宽度。
        </p>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="固定层级"
      desc="固定后是视口定位, 层级要自己给: zIndex 不够时会被文档站顶栏盖住。"
      :code="codeLayer"
      :value="`z-index = ${zIndex}`"
    >
      <NyStack :gap="12">
        <NyRow :gap="8">
          <NyButton
            v-for="item in [0, 50]"
            :key="item"
            size="sm"
            :variant="zIndex === item ? 'primary' : 'default'"
            @click="zIndex = item"
          >
            z-index = {{ item }}
          </NyButton>
        </NyRow>

        <div id="affix-layer-box" class="ex-preview">
          <NyLayout mode="blank" fill>
            <NyStack :gap="12">
              <p class="ex-note">offset-top 给 0: 固钉正好落在顶栏的位置上, z-index 为 0 时被顶栏盖住。</p>

              <div class="ex-box">占位内容 1</div>
              <div class="ex-box">占位内容 2</div>

              <NyAffix target="#affix-layer-box .ny-layout__main" :offset-top="0" :z-index="zIndex">
                <div class="ex-box">固钉: z-index = {{ zIndex }}</div>
              </NyAffix>

              <div v-for="line in lines" :key="line" class="ex-box">占位内容 {{ line }}</div>
            </NyStack>
          </NyLayout>
        </div>
      </NyStack>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyAffix Props" :rows="apiProps" />
      <ApiTable title="插槽" :rows="apiSlots" kind="slots" />
    </template>
  </DocPage>
</template>
