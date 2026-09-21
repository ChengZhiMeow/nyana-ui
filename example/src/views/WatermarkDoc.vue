<script setup lang="ts">
import { computed, ref } from 'vue'

import { NySlider, NySwitch, NyWatermark } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const lines = ['Nyana UI', '内部资料 请勿外传']

const rotate = ref<number | [number, number]>(-22)
const gapX = ref<number | [number, number]>(120)
const fontSize = ref<number | [number, number]>(16)
const opacity = ref<number | [number, number]>(1)

const off = ref(false)

const gap = computed<[number, number]>(() => [Number(gapX.value), Number(gapX.value)])

const LOGO_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="24" fill="#7c6bf5" fill-opacity="0.25"/><path d="M32 16v32M16 32h32" stroke="#7c6bf5" stroke-width="3"/></svg>'
const logo = `data:image/svg+xml,${encodeURIComponent(LOGO_SVG)}`

const paramText = computed(
  () => `rotate: ${Number(rotate.value)} | gap: [${gap.value[0]}, ${gap.value[1]}]`,
)

const tuneText = computed(
  () =>
    `fontSize: ${Number(fontSize.value)} | opacity: ${Number(opacity.value)} | disabled: ${off.value}`,
)

const codeBasic = `<NyWatermark content="Nyana UI" :font-size="18">
  <div class="ex-panel">
    <p>水印会平铺在整个内容区上。</p>
    <p>内容本身照常可读可选中。</p>
  </div>
</NyWatermark>`

const codeLines = `<NySlider v-model="rotate" :min="-90" :max="90" :step="1" />
<NySlider v-model="gapX" :min="80" :max="240" :step="10" />

<NyWatermark :content="lines" :rotate="Number(rotate)" :gap="gap">
  <div class="ex-panel">内容略</div>
</NyWatermark>

const lines = ['Nyana UI', '内部资料 请勿外传']`

const codeImage = `<NyWatermark :image="logo" :rotate="-15" :gap="gap">
  <div class="ex-panel">内容略</div>
</NyWatermark>

const LOGO_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">…</svg>'
const logo = \`data:image/svg+xml,\${encodeURIComponent(LOGO_SVG)}\``

const codeTune = `<NySwitch v-model:checked="off" checked-text="关闭水印" unchecked-text="显示水印" />

<NySlider v-model="fontSize" :min="10" :max="32" :step="1" label="字号" />
<NySlider v-model="opacity" :min="0.1" :max="1" :step="0.1" label="浓度" />

<NyWatermark
  content="Nyana UI"
  :font-size="Number(fontSize)"
  :opacity="Number(opacity)"
  :disabled="off"
  :gap="gap"
>
  <div class="ex-panel">内容略</div>
</NyWatermark>`

const codeOffset = `<NyWatermark content="仅内部使用" :rotate="-12" :gap="[80, 140]" :offset="[20, 10]" :z-index="9">
  <div class="ex-panel">
    <p>offset 决定第一块图案从哪里开始铺, 用它对齐容器边缘。</p>
  </div>
</NyWatermark>`

const apiProps = [
  { name: 'content', desc: '水印文字, 数组表示多行', type: 'string | string[]', default: "'Nyana UI'" },
  { name: 'image', desc: '图片水印地址, 给了它就覆盖文字', type: 'string', default: "''" },
  { name: 'rotate', desc: '旋转角度, 单位度', type: 'number', default: '-22' },
  { name: 'gap', desc: '平铺间距 [横向, 纵向]', type: '[number, number]', default: '[100, 100]' },
  { name: 'offset', desc: '图案起始偏移 [横向, 纵向]', type: '[number, number]', default: '[0, 0]' },
  { name: 'fontSize', desc: '文字字号, 只在文字水印下生效', type: 'number', default: '14' },
  { name: 'fontWeight', desc: '文字字重', type: "'normal' | 'bold'", default: "'normal'" },
  { name: 'color', desc: '文字颜色, 只在文字水印下生效', type: 'string', default: "'rgba(0, 0, 0, 0.12)'" },
  { name: 'opacity', desc: '整层遮罩的透明度, 叠加在颜色之上', type: 'number', default: '1' },
  { name: 'zIndex', desc: '遮罩层级, 默认压住内容但不盖浮层', type: 'number', default: '9' },
  { name: 'disabled', desc: '关掉水印, 容器结构保持不变', type: 'boolean', default: 'false' },
]

const apiSlots = [
  { name: 'default', desc: '被水印覆盖的内容, 容器自带定位上下文', type: '—' },
]
</script>

<template>
  <DocPage title="Watermark 水印" desc="给内容盖上可平铺的文字或图片水印。">

    <DemoBlock
      title="基础用法"
      desc="内容放进默认插槽, 水印以绝对定位的遮罩平铺在整个内容区上, 不挡点击也不挡选中。"
      :code="codeBasic"
    >
      <NyWatermark content="Nyana UI" :font-size="18">
        <div class="ex-panel">
          <p>水印会平铺在整个内容区上, 参数变化时会重新生成图案。</p>
          <p class="ex-note">内容本身照常可读可选中, 遮罩只做视觉标记。</p>
        </div>
      </NyWatermark>
    </DemoBlock>

    <DemoBlock
      title="多行文字与旋转"
      desc="content 传数组就是多行文字, rotate 决定倾斜角度, gap 决定图案之间的间距。"
      :code="codeLines"
      :value="paramText"
    >
      <NySlider v-model="rotate" :min="-90" :max="90" :step="1" label="旋转角度" />
      <NySlider v-model="gapX" :min="80" :max="240" :step="10" label="平铺间距" />

      <NyWatermark :content="lines" :rotate="Number(rotate)" :gap="gap">
        <div class="ex-panel">
          <p>多行文字按 fontSize 与行距排布, 整块再按 rotate 倾斜。</p>
          <p class="ex-note">间距太小时图案会挤在一起, 一般留出文字宽度的一倍以上。</p>
        </div>
      </NyWatermark>
    </DemoBlock>

    <DemoBlock
      title="图片水印"
      desc="给了 image 就画图片, 不再画文字; 图片要先加载完才画得上, 所以参数变化时会重新等一次。"
      :code="codeImage"
    >
      <NyWatermark :image="logo" :rotate="-15" :gap="gap">
        <div class="ex-panel">
          <p>图片水印走 drawImage, 尺寸按图片原始宽高算。</p>
          <p class="ex-note">
            画布不能读跨域图片, 那会让 toDataURL 抛安全错误, 因此示例用的是 dataURI;
            换成自己的图片时请确保同源, 或者给图片服务器开 CORS。
          </p>
        </div>
      </NyWatermark>
    </DemoBlock>

    <DemoBlock
      title="参数调节"
      desc="字号决定图案本体大小, opacity 是整层遮罩的透明度, disabled 关掉水印但保留容器结构。"
      :code="codeTune"
      :value="tuneText"
    >
      <div class="ex-group">
        <NySwitch v-model:checked="off" checked-text="关闭水印" unchecked-text="显示水印" />
      </div>

      <NySlider v-model="fontSize" :min="10" :max="32" :step="1" label="字号" />
      <NySlider v-model="opacity" :min="0.1" :max="1" :step="0.1" label="浓度" />

      <NyWatermark
        content="Nyana UI"
        :font-size="Number(fontSize)"
        :opacity="Number(opacity)"
        :disabled="off"
        :gap="gap"
      >
        <div class="ex-panel">
          <p>拖动上面的滑杆, 图案会立刻按新参数重画。</p>
        </div>
      </NyWatermark>
    </DemoBlock>

    <DemoBlock
      title="偏移与层级"
      desc="offset 决定第一块图案的起点, zIndex 用来把水印压在别的装饰层之下。"
      :code="codeOffset"
    >
      <NyWatermark
        content="仅内部使用"
        :rotate="-12"
        :gap="[80, 140]"
        :offset="[20, 10]"
        :z-index="9"
      >
        <div class="ex-panel">
          <p>offset 用来对齐容器边缘, 横向与纵向各给一个像素值。</p>
        </div>
      </NyWatermark>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyWatermark Props" :rows="apiProps" />
      <ApiTable title="NyWatermark 插槽" :rows="apiSlots" kind="slots" />
    </template>

    <template #faq>
      <p class="ex-note">
        水印挡不住有心人: 遮罩就是一个普通的 div, 打开开发者工具删掉它, 或者把画布图片抠掉就没了,
        它的定位是防误拍屏与防随手转发, 不是防泄露的安全机制。
      </p>
      <p class="ex-note">
        真正需要追溯时, 把水印内容换成当前用户的信息(昵称, 工号, 时间戳), 再配合服务端日志,
        比起把样式做复杂更有意义。
      </p>
      <p class="ex-note">
        另外水印按容器尺寸平铺, 容器没有大小(例如内容被 display: none 隐藏)时画布仍会生成,
        重新显示后不需要额外处理。
      </p>
    </template>
  </DocPage>
</template>
