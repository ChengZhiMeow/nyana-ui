<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyAvatar, NyAvatarCropper, NyButton, NySpace, NyStack, NyText } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const SAMPLE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><rect width="900" height="600" fill="#5bcffa"/><circle cx="220" cy="180" r="120" fill="#f5a9b8"/><circle cx="680" cy="440" r="150" fill="#7c6bf5"/><text x="450" y="320" font-size="72" fill="#0d5f7d" text-anchor="middle" font-family="sans-serif">Nyana</text></svg>',
  )

const open = ref(false)
const shape = ref<'circle' | 'square'>('circle')
const source = ref(SAMPLE)
const result = ref('')
const lastShape = ref('—')

const codeBasic = `const open = ref(false)
const source = ref('')   // 本地图用 URL.createObjectURL(file), 远程图直接给地址

<NyButton @click="open = true">选择图片</NyButton>

<NyAvatarCropper v-model:open="open" :src="source" @confirm="onConfirm" />

function onConfirm({ blob, dataUrl }) {
  // blob 直接丢给上传接口, dataUrl 用来立即预览
  avatar.value = dataUrl
}`

const codeShape = `<!-- shape 只影响裁剪框的展示, 导出的永远是正方形 -->
<NyAvatarCropper v-model:open="open" :src="source" shape="circle" />
<NyAvatarCropper v-model:open="open" :src="source" shape="square" :viewport="280" />`

const codeExport = `<!-- 导出尺寸可以比裁剪框大, 头像显示小图但保存清晰 -->
<NyAvatarCropper v-model:open="open" :src="source" :output="512" />`

function pickFile() {
  const input = document.createElement('input')

  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    const file = input.files?.[0]

    if (file) {
      source.value = URL.createObjectURL(file)
    }

    open.value = true
  }

  input.click()
}

function onConfirm(payload: { blob: Blob; dataUrl: string }) {
  result.value = payload.dataUrl
  lastShape.value = `${shape.value} · ${Math.round(payload.blob.size / 1024)} KB`
}

const apiProps = [
  { name: 'v-model:open', desc: '是否显示裁剪面板', type: 'boolean', default: 'false' },
  { name: 'src', desc: '待裁剪的图片地址, 支持 blob: 与 dataURL', type: 'string', default: "''" },
  { name: 'viewport', desc: '裁剪框在页面上的边长(px)', type: 'number', default: '320' },
  { name: 'output', desc: '导出图片的边长(px), 比裁剪框大更清晰', type: 'number', default: '400' },
  { name: 'shape', desc: '裁剪框形状, 只影响预览, 导出始终是正方形', type: "'circle' | 'square'", default: "'circle'" },
  { name: 'maxZoom', desc: '最大放大倍数', type: 'number', default: '4' },
  { name: 'title', desc: '面板标题', type: 'string', default: "'裁剪头像'" },
  { name: 'desc', desc: '标题下面的说明', type: 'string', default: '拖拽与缩放说明' },
]

const apiEvents = [
  { name: 'confirm', desc: '点确认且 canvas 导出成功后触发', type: '{ blob: Blob; dataUrl: string }' },
  { name: 'cancel', desc: '点取消, 点遮罩或按 Esc 时触发', type: '—' },
]

const codePreview = computed(() => `avatar.value = dataUrl  // 立刻预览, blob 另外丢给上传`)
</script>

<template>
  <DocPage title="AvatarCropper 头像裁剪" desc="拖动与缩放裁出正方形头像, 用 canvas 导出 blob 与 dataURL">
    <DemoBlock
      title="基础用法"
      desc="点按钮选一张本地图, 拖动调整位置, 滚轮或滑杆缩放, 确认后拿到 blob 与 dataURL。"
      :code="codeBasic"
      :value="`最近一次: ${lastShape}`"
    >
      <NySpace>
        <NyButton size="sm" variant="primary" @click="pickFile">选择本地图片</NyButton>
        <NyButton size="sm" @click="open = true">用示例图裁剪</NyButton>

        <NyText v-if="result" type="muted" size="sm">右侧就是裁出来的结果</NyText>
      </NySpace>

      <NyAvatar v-if="result" :src="result" size="lg" />
    </DemoBlock>

    <DemoBlock
      title="圆形与方形"
      desc="shape 控制裁剪框的展示形状, 导出的图片始终是正方形, 圆形头像交给 NyAvatar 自己圆。"
      :code="codeShape"
      :value="`当前裁剪框: ${shape}`"
    >
      <NyStack :gap="12">
        <NySpace>
          <NyButton size="sm" :variant="shape === 'circle' ? 'primary' : 'default'" @click="shape = 'circle'">
            圆形裁剪框
          </NyButton>
          <NyButton size="sm" :variant="shape === 'square' ? 'primary' : 'default'" @click="shape = 'square'">
            方形裁剪框
          </NyButton>
          <NyButton size="sm" @click="open = true">打开裁剪</NyButton>
        </NySpace>

        <p class="ex-note">方形裁剪框会多出一层三分线, 圆形裁剪框没有。</p>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="导出尺寸"
      desc="output 决定导出图片的边长, 头像框再小也能存一张清晰的图; viewport 只影响面板上裁剪框的大小。"
      :code="codeExport"
    >
      <p class="ex-note">默认 400px, 传 512 或更大适合做可放大的头像。</p>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyAvatarCropper Props" :rows="apiProps" />
      <ApiTable title="NyAvatarCropper 事件" kind="events" :rows="apiEvents" />
    </template>

    <template #faq>
      <p class="ex-note">
        组件只负责裁剪, 不碰上传: confirm 给出的 blob 可以直接塞进 FormData,
        dataURL 用来立刻预览 ({{ codePreview }})。
      </p>
      <p class="ex-note">
        打开时会锁住页面滚动, 按 Esc 或点遮罩都会 cancel 并收起; 每次打开都从原图重新开始, 不会留着上一次的缩放。
      </p>
    </template>

    <NyAvatarCropper v-model:open="open" :src="source" :shape="shape" @confirm="onConfirm" />
  </DocPage>
</template>
