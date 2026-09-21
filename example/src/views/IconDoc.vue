<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyGrid, NyIcon, NyStack, NyText, nyBrandIcons, nyIcons, nyMessage } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const iconNames = Object.keys(nyIcons)

const brandNames = Object.keys(nyBrandIcons)
const lineNames = iconNames.filter((name) => !(name in nyBrandIcons))

const brandRow = ['github', 'qq', 'wechat', 'bilibili', 'zhihu', 'taobao', 'alipay', 'vscode', 'figma', 'docker']

const sizeOptions = [14, 18, 24, 32]
const iconSize = ref(24)

const spinning = ref(true)
const lastCopied = ref('')

async function copy(name: string) {
  if (!navigator.clipboard) {
    nyMessage.warning('当前环境不支持剪贴板, 图标名: ' + name)

    return
  }

  await navigator.clipboard.writeText(name)
  lastCopied.value = name
  nyMessage.success('已复制 ' + name)
}

const codeAll = `<NyGrid :columns="3" :responsive="{ sm: 4, md: 6, lg: 8 }" :gap="10">
  <div
    v-for="name in iconNames"
    :key="name"
    class="ex-tile"
    role="button"
    tabindex="0"
    @click="copy(name)"
    @keydown.enter="copy(name)"
    @keydown.space.prevent="copy(name)"
  >
    <NyStack :gap="4" align="center">
      <NyIcon :name="name" :size="20" />
      <NyText size="xs" type="muted">{{ name }}</NyText>
    </NyStack>
  </div>
</NyGrid>`

const codeSize = `<div class="ex-group">
  <NyButton
    v-for="item in sizeOptions"
    :key="item"
    size="sm"
    :variant="item === iconSize ? 'primary' : 'default'"
    @click="iconSize = item"
  >
    {{ item }}
  </NyButton>
</div>

<div class="ex-group">
  <NyIcon name="star" :size="iconSize" />
  <NyIcon name="star" size="28px" />
  <NyIcon name="star" :size="48" />
</div>`

const codeBrand = `<!-- 品牌图标是实心图形, 不能用 strokeWidth 调粗细 -->
<div class="ex-group">
  <NyIcon name="github" :size="30" />
  <NyIcon name="qq" :size="30" />
  <NyIcon name="wechat" :size="30" />
  <NyIcon name="bilibili" :size="30" />
</div>

<!-- 颜色跟文字一样, 想换色就套一层令牌或色卡 -->
<span style="color: var(--ny-success)"><NyIcon name="spotify" :size="24" /> Spotify</span>`

const codeStroke = `<div class="ex-group">
  <NyIcon v-for="w in [1, 1.4, 1.8, 2.4]" :key="w" name="heart" :size="30" :stroke-width="w" />
</div>`

const codeSpin = `<div class="ex-group">
  <NyButton size="sm" @click="spinning = !spinning">
    {{ spinning ? '停止旋转' : '开始旋转' }}
  </NyButton>

  <NyIcon name="refresh" :size="26" :spin="spinning" />
  <NyIcon name="refresh" :size="26" :spin="true" />
</div>`

const codeColor = `<div class="ex-group">
  <NyText type="primary"><NyIcon name="check-circle" /> 主色</NyText>
  <NyText type="success"><NyIcon name="check-circle" /> 成功</NyText>
  <NyText type="warning"><NyIcon name="alert" /> 警告</NyText>
  <NyText type="danger"><NyIcon name="close-circle" /> 危险</NyText>
  <NyText type="muted"><NyIcon name="info" /> 弱化</NyText>
</div>

<span class="ex-tile"><NyIcon name="sparkles" :size="20" /> 跟随容器颜色</span>`

const apiProps = [
  { name: 'name', desc: '图标名, 取 src/icons.ts 里的键, 未命中时退回 info', type: 'string', default: '—' },
  { name: 'size', desc: '宽高, 数字按 px, 字符串按 CSS 长度', type: 'number | string', default: '18' },
  { name: 'strokeWidth', desc: '描边粗细', type: 'number', default: '1.8' },
  { name: 'spin', desc: '整圈旋转, 用于刷新与加载类图标', type: 'boolean', default: 'false' },
]

const apiExport = [
  { name: 'nyIcons', desc: '全部图标的 path 清单(描边 + 品牌), 键就是 name', type: 'Record<string, string[]>' },
  { name: 'nyIconPaths(name)', desc: '取某个图标的 path, 未命中时返回兜底图标', type: 'string[]' },
  { name: 'nyIconFallback', desc: '兜底图标名', type: 'string' },
  { name: 'isFilledIcon(name)', desc: '是否是实心品牌图标, 自己画图标时用它决定 fill 还是 stroke', type: '(name: string) => boolean' },
  { name: 'nyBrandIcons', desc: '只含品牌图标的那张表, 做图标选择器时可以单独取', type: 'Record<string, string[]>' },
  { name: 'nyIconViewBox(name)', desc: '图标画布, 品牌图标里少数不是 24x24', type: '(name: string) => string' },
  { name: 'NyIconName', desc: '图标名的联合类型', type: 'keyof typeof nyIcons' },
]
</script>

<template>
  <DocPage :title="'Icon 图标'" :desc="`内置 ${iconNames.length} 个图标: ${lineNames.length} 个 24x24 描边图标 + ${brandNames.length} 个平台品牌图标`">

    <DemoBlock
      title="全部图标"
      desc="点击任意图标复制它的名字, 名字可以直接写进 name 属性; 这一批是描边风格, 粗细由 strokeWidth 控制。"
      :code="codeAll"
      :value="'最近复制: ' + (lastCopied || '—')"
    >
      <NyGrid :columns="3" :responsive="{ sm: 4, md: 6, lg: 8 }" :gap="10">
        <div
          v-for="name in lineNames"
          :key="name"
          class="ex-tile"
          role="button"
          tabindex="0"
          @click="copy(name)"
          @keydown.enter="copy(name)"
          @keydown.space.prevent="copy(name)"
        >
          <NyStack :gap="4" align="center">
            <NyIcon :name="name" :size="20" />
            <NyText size="xs" type="muted">{{ name }}</NyText>
          </NyStack>
        </div>
      </NyGrid>
    </DemoBlock>

    <DemoBlock
      title="品牌图标"
      desc="各平台官方标志, 照原图画成实心路径, 24x24 网格, 颜色同样跟随 currentColor, 所以深浅色主题都不用换图。"
      :code="codeBrand"
      :value="`共 ${brandNames.length} 个`"
    >
      <div class="ex-group">
        <NyIcon v-for="name in brandRow" :key="name" :name="name" :size="30" :title="name" />
      </div>

      <NyGrid :columns="3" :responsive="{ sm: 4, md: 6, lg: 8 }" :gap="10">
        <div
          v-for="name in brandNames"
          :key="name"
          class="ex-tile"
          role="button"
          tabindex="0"
          @click="copy(name)"
          @keydown.enter="copy(name)"
          @keydown.space.prevent="copy(name)"
        >
          <NyStack :gap="4" align="center">
            <NyIcon :name="name" :size="22" />
            <NyText size="xs" type="muted">{{ name }}</NyText>
          </NyStack>
        </div>
      </NyGrid>
    </DemoBlock>

    <DemoBlock
      title="图标尺寸"
      desc="size 传数字按 px, 传字符串按 CSS 长度。"
      :code="codeSize"
      :value="'当前尺寸: ' + iconSize + 'px'"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyButton
            v-for="item in sizeOptions"
            :key="item"
            size="sm"
            :variant="item === iconSize ? 'primary' : 'default'"
            @click="iconSize = item"
          >
            {{ item }}
          </NyButton>
        </div>

        <div class="ex-group">
          <NyIcon name="star" :size="iconSize" />
          <NyIcon name="star" size="28px" />
          <NyIcon name="star" :size="48" />
        </div>
      </NyStack>
    </DemoBlock>

    <DemoBlock title="描边粗细" desc="strokeWidth 越大越厚重, 大尺寸图标配细描边更耐看。" :code="codeStroke">
      <div class="ex-group">
        <NyIcon v-for="w in [1, 1.4, 1.8, 2.4]" :key="w" name="heart" :size="30" :stroke-width="w" />
      </div>
    </DemoBlock>

    <DemoBlock title="旋转" desc="spin 是持续整圈旋转, 适合刷新与提交中的状态。" :code="codeSpin">
      <div class="ex-group">
        <NyButton size="sm" @click="spinning = !spinning">
          {{ spinning ? '停止旋转' : '开始旋转' }}
        </NyButton>

        <NyIcon name="refresh" :size="26" :spin="spinning" />
        <NyIcon name="refresh" :size="26" :spin="true" />
      </div>
    </DemoBlock>

    <DemoBlock title="颜色跟随" desc="图标用 currentColor 绘制, 颜色交给外层文字或容器。" :code="codeColor">
      <NyStack :gap="14">
        <div class="ex-group">
          <NyText type="primary"><NyIcon name="check-circle" /> 主色</NyText>
          <NyText type="success"><NyIcon name="check-circle" /> 成功</NyText>
          <NyText type="warning"><NyIcon name="alert" /> 警告</NyText>
          <NyText type="danger"><NyIcon name="close-circle" /> 危险</NyText>
          <NyText type="muted"><NyIcon name="info" /> 弱化</NyText>
        </div>

        <div class="ex-group">
          <span class="ex-tile"><NyIcon name="sparkles" :size="20" /> 跟随容器颜色</span>
        </div>
      </NyStack>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyIcon Props" :rows="apiProps" />
      <ApiTable title="图标清单导出" kind="methods" :rows="apiExport" />
    </template>
  </DocPage>
</template>
