<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyUpload } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

import type { NyUploadFile } from '@chengzhimeow/nyana-ui'

const basicFiles = ref<NyUploadFile[]>([])
const dragFiles = ref<NyUploadFile[]>([])
const pictureFiles = ref<NyUploadFile[]>([])
const limitedFiles = ref<NyUploadFile[]>([])
const listFiles = ref<NyUploadFile[]>([])
const manualFiles = ref<NyUploadFile[]>([])

const exceedText = ref('')
const submitted = ref('')
const removed = ref('')

const listTip = computed(() => `最近移除: ${removed.value || '无'} | ${submitted.value || '暂无提交'}`)

function nameOf(files: NyUploadFile[]) {
  return files.map((file) => file.name).join(', ') || '空'
}

function onExceed(payload: { type: 'count' | 'size'; files: File[] }) {
  const names = payload.files.map((file) => file.name).join(', ')

  exceedText.value =
    payload.type === 'size'
      ? `超出大小上限: ${names}, 文件已进列表并标记错误`
      : `超出数量上限: ${names}, 文件已丢弃`
}

function onSubmitted(files: NyUploadFile[]) {
  submitted.value = files.length ? `change 收到 ${files.length} 个文件, 可以在这里发起上传` : '列表已清空'
}

function onRemoved(file: NyUploadFile) {
  removed.value = file.name
}

function clearManual() {
  manualFiles.value = []
}

const codeBasic = `<NyUpload v-model:files="basicFiles" @change="onSubmitted" />

const basicFiles = ref<NyUploadFile[]>([])`

const codeDrag = `<NyUpload v-model:files="dragFiles" drag hint="点击或拖拽文件到此处" />`

const codePicture = `<NyUpload v-model:files="pictureFiles" accept="image/*" list-type="picture" />`

const codeLimit = `<NyUpload
  v-model:files="limitedFiles"
  accept=".png,.jpg"
  :max-size="1"
  :max-count="2"
  @exceed="onExceed"
/>

function onExceed(payload: { type: 'count' | 'size'; files: File[] }) {
  // type 为 size 时文件已进列表并标成 error, 为 count 时文件被丢弃
}`

const codeList = `<NyUpload v-model:files="listFiles" @change="onSubmitted" @remove="onRemoved" />

// change 拿到的是当前完整列表, 上传成功后把 url 与 status 写回同一份数据即可
function onSubmitted(files: NyUploadFile[]) {
  submitted.value = files.length ? 'change 收到 ' + files.length + ' 个文件' : '列表已清空'
}`

const codeManual = `<NyUpload v-model:files="manualFiles" />

<NyButton size="sm" @click="manualFiles = []">清空列表</NyButton>`

const apiProps = [
  { name: 'v-model:files', desc: '当前文件列表, 由使用方持有', type: 'NyUploadFile[]', default: '[]' },
  { name: 'accept', desc: '逗号分隔的扩展名或 MIME, 支持 image/* 这种通配', type: 'string', default: 'undefined' },
  { name: 'multiple', desc: '允许多选, 关闭时只取第一个文件', type: 'boolean', default: 'true' },
  { name: 'maxCount', desc: '列表最多放几个文件, 超出的直接丢弃', type: 'number', default: '5' },
  { name: 'maxSize', desc: '单个文件的大小上限, 单位 MB', type: 'number', default: '5' },
  { name: 'drag', desc: '大号拖拽区, 关闭时是一个紧凑的选择按钮', type: 'boolean', default: 'false' },
  { name: 'listType', desc: "picture 时图片文件带 48px 缩略图", type: "'text' | 'picture'", default: "'text'" },
  { name: 'hint', desc: '主文案, 缺省时用内置提示语', type: 'string', default: "''" },
  { name: 'disabled', desc: '禁用, 选择与拖放都不响应', type: 'boolean', default: 'false' },
]

const apiEvents = [
  { name: 'change', desc: '列表变化时触发, 参数是完整列表', type: '(files: NyUploadFile[]) => void' },
  { name: 'select', desc: '通过限制的新文件被选中时触发', type: '(files: File[]) => void' },
  { name: 'remove', desc: '从列表里移除某个文件时触发', type: '(file: NyUploadFile) => void' },
  {
    name: 'exceed',
    desc: '超出数量或大小上限时触发, count 表示被丢弃, size 表示已进列表并标错',
    type: "({ type: 'count' | 'size'; files: File[] }) => void",
  },
]

const apiMethods = [
  { name: 'open', desc: '打开系统文件选择框, 禁用时无效', type: '() => void' },
  { name: 'clear', desc: '清空整个列表并回收本地预览地址', type: '() => void' },
]

const fileProps = [
  { name: 'name', desc: '文件名' },
  { name: 'size', desc: '字节数, 列表里按 B / KB / MB 展示' },
  { name: 'type', desc: 'MIME 类型, 少数文件可能为空串' },
  { name: 'status', desc: 'ready 未处理 / success 通过限制 / error 被 accept 或大小限制挡住' },
  { name: 'url', desc: 'picture 模式下图片的本地预览地址, 上传成功后可以换成服务端地址' },
  { name: 'message', desc: 'status 为 error 时展示在列表项里的原因' },
]
</script>

<template>
  <DocPage title="Upload 上传" desc="选择, 限制与文件列表管理。">

    <DemoBlock
      title="基础用法"
      desc="点击选择文件, 通过限制的文件直接进列表。"
      :code="codeBasic"
      :value="`列表: ${basicFiles.length} 个 - ${nameOf(basicFiles)}`"
    >
      <NyUpload v-model:files="basicFiles" @change="onSubmitted" />
    </DemoBlock>

    <DemoBlock
      title="拖拽上传"
      desc="drag 打开后是一个大号拖放区, 键盘回车与空格同样能打开选择框。"
      :code="codeDrag"
      :value="`列表: ${dragFiles.length} 个 - ${nameOf(dragFiles)}`"
    >
      <NyUpload v-model:files="dragFiles" drag hint="点击或拖拽文件到此处" />
    </DemoBlock>

    <DemoBlock
      title="图片缩略图"
      desc="listType 为 picture 时图片走本地 blob 预览, 其它类型显示文件图标。"
      :code="codePicture"
      :value="`列表: ${pictureFiles.length} 个 - ${nameOf(pictureFiles)}`"
    >
      <NyUpload v-model:files="pictureFiles" accept="image/*" list-type="picture" />
    </DemoBlock>

    <DemoBlock
      title="限制与超限提示"
      desc="accept 只留 png 与 jpg, 单文件不超过 1 MB, 最多 2 个, 超限结果由 exceed 给出。"
      :code="codeLimit"
      :value="exceedText || '暂未触发 exceed'"
    >
      <NyUpload
        v-model:files="limitedFiles"
        accept=".png,.jpg"
        :max-size="1"
        :max-count="2"
        @exceed="onExceed"
      />

      <p class="ex-note">
        类型或大小不合规的文件会留在列表里并标红, 超出数量上限的文件不会进列表。
      </p>
    </DemoBlock>

    <DemoBlock
      title="文件列表与删除"
      desc="change 给出完整列表, remove 给出被移除的那一个。"
      :code="codeList"
      :value="listTip"
    >
      <NyUpload v-model:files="listFiles" @change="onSubmitted" @remove="onRemoved" />

      <p class="ex-note">
        组件不做真实上传: 在 change 里自己发请求, 上传成功后把 url 与 status 写回同一份列表数据即可。
      </p>
    </DemoBlock>

    <DemoBlock
      title="手动清空"
      desc="列表由使用方持有, 直接改 v-model 绑的值就能清空。"
      :code="codeManual"
      :value="`列表: ${manualFiles.length} 个 - ${nameOf(manualFiles)}`"
    >
      <NyUpload v-model:files="manualFiles" />

      <div class="ex-group">
        <NyButton size="sm" @click="clearManual">清空列表</NyButton>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyUpload Props" :rows="apiProps" />
      <ApiTable title="NyUpload 事件" :rows="apiEvents" kind="events" />
      <ApiTable title="NyUpload 方法" :rows="apiMethods" kind="methods" />
      <ApiTable title="NyUploadFile" :rows="fileProps" compact />
    </template>
  </DocPage>
</template>
