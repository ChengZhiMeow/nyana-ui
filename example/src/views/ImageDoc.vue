<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyGrid, NyImage } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const photo = 'https://picsum.photos/seed/nyana-flower/600/400'
const photos = [
  'https://picsum.photos/seed/nyana-field/600/400',
  'https://picsum.photos/seed/nyana-stone/600/400',
  'https://picsum.photos/seed/nyana-wood/600/400',
]

const preview = ref(true)

const previewText = computed(() => `preview: ${preview.value}`)

const codeBasic = `<NyImage
  src="https://picsum.photos/seed/nyana-flower/600/400"
  alt="花田"
  :width="320"
  caption="图 1 清晨的花田"
/>`

const codeFit = `<NyImage :src="photo" fit="cover" :width="200" :height="140" caption="cover" />
<NyImage :src="photo" fit="contain" :width="200" :height="140" caption="contain" />
<NyImage :src="photo" fit="fill" :width="200" :height="140" caption="fill" />`

const codeRadius = `<NyImage :src="photo" radius="none" :width="140" :height="100" />
<NyImage :src="photo" radius="sm" :width="140" :height="100" />
<NyImage :src="photo" radius="md" :width="140" :height="100" />
<NyImage :src="photo" radius="lg" :width="140" :height="100" />`

const codeFallback = `<NyImage src="/no-such-image.png" :width="240" :height="160" fallback="图片走丢了" />`

const codePreview = `<NyImage :src="photo" :width="240" :preview="preview" caption="点击大图按钮预览" />`

const codeSize = `<NyImage :src="photo" :width="240" :height="120" />
<NyImage :src="photo" width="60%" />`

const apiProps = [
  { name: 'src', desc: '图片地址, 变化时自动回到加载态', type: 'string' },
  { name: 'alt', desc: '替代文本, 也是预览浮层的无障碍名', type: 'string', default: "''" },
  { name: 'width', desc: '图片宽度, 数字按 px 处理', type: 'string | number', default: '—' },
  { name: 'height', desc: '图片高度, 数字按 px 处理', type: 'string | number', default: '—' },
  { name: 'fit', desc: 'object-fit 取值', type: "'cover' | 'contain' | 'fill'", default: "'cover'" },
  { name: 'radius', desc: '圆角档', type: "'sm' | 'md' | 'lg' | 'none'", default: "'md'" },
  { name: 'preview', desc: '是否显示预览按钮与全屏浮层', type: 'boolean', default: 'true' },
  { name: 'caption', desc: '图片下方说明', type: 'string', default: "''" },
  { name: 'fallback', desc: '加载失败时显示的文字', type: 'string', default: "'加载失败'" },
]

const apiSlots = [
  { name: 'default', desc: '覆盖在图片上的内容, 随图片居中', type: '—' },
  { name: 'caption', desc: '自定义图注, 顶替 caption 属性', type: '—' },
]
</script>

<template>
  <DocPage title="Image 图片" desc="带加载占位与全屏预览的图片">

    <DemoBlock title="基础用法" desc="加载中先铺一层底色, 加载完淡出, 下方可以带图注。" :code="codeBasic">
      <NyImage
        src="https://picsum.photos/seed/nyana-flower/600/400"
        alt="花田"
        :width="320"
        caption="图 1 清晨的花田"
      />
    </DemoBlock>

    <DemoBlock title="填充方式" desc="fit 对应 object-fit 的三个取值, 尺寸相同看差异。" :code="codeFit">
      <div class="ex-group">
        <NyImage :src="photo" fit="cover" :width="200" :height="140" caption="cover" />
        <NyImage :src="photo" fit="contain" :width="200" :height="140" caption="contain" />
        <NyImage :src="photo" fit="fill" :width="200" :height="140" caption="fill" />
      </div>
    </DemoBlock>

    <DemoBlock title="圆角" desc="radius 四档, none 用于与容器严丝合缝的场景。" :code="codeRadius">
      <div class="ex-group">
        <NyImage :src="photo" radius="none" :width="140" :height="100" />
        <NyImage :src="photo" radius="sm" :width="140" :height="100" />
        <NyImage :src="photo" radius="md" :width="140" :height="100" />
        <NyImage :src="photo" radius="lg" :width="140" :height="100" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="加载失败"
      desc="地址取不到时换成 fallback 文案, 不会留下一个破图图标。"
      :code="codeFallback"
    >
      <NyImage src="/no-such-image.png" :width="240" :height="160" fallback="图片走丢了" />

      <p class="ex-note">上面这张用的是不存在的地址, 用来触发失败态。</p>
    </DemoBlock>

    <DemoBlock
      title="全屏预览"
      desc="悬浮或键盘聚焦到图片上会出现放大按钮; 浮层里按 Esc 或点击遮罩关闭。"
      :code="codePreview"
      :value="previewText"
    >
      <NyButton size="sm" @click="preview = !preview">切换预览开关</NyButton>

      <NyImage :src="photo" :width="240" :preview="preview" caption="点击大图按钮预览" />
    </DemoBlock>

    <DemoBlock title="尺寸控制" desc="宽高可以是数字或任意 CSS 长度, 只给宽度时按原比例撑高。" :code="codeSize">
      <NyGrid :columns="2" :gap="16">
        <NyImage :src="photos[0]" :width="240" :height="120" caption="固定宽高" />
        <NyImage :src="photos[1]" width="60%" caption="百分比宽度" />
      </NyGrid>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyImage Props" :rows="apiProps" />
      <ApiTable title="NyImage 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
