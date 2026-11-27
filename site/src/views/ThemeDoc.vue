<script setup lang="ts">
import { computed } from 'vue'

import { NyAvatar, NyButton, NyTag, nyPalette } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'
import { setTheme, themeMode } from '@/theme'

const isDark = computed(() => themeMode.value === 'dark')

const brandTokens = [
  { name: '主色', light: '#5bcffa', dark: '#5bcffa', css: '--ny-primary' },
  { name: '主色悬停', light: '#79d8fb', dark: '#7ad8fb', css: '--ny-primary-hover' },
  { name: '主色按下', light: '#3ec0e8', dark: '#45c3ea', css: '--ny-primary-active' },
  { name: '主色文字档', light: '#1f97c2', dark: '#8fdcfb', css: '--ny-primary-strong' },
  { name: '主色亮档', light: '#22a6dc', dark: '#8fdcfb', css: '--ny-primary-bright' },
  { name: '辅色', light: '#f5a9b8', dark: '#f5a9b8', css: '--ny-secondary' },
  { name: '辅色亮档', light: '#d9547a', dark: '#f7b3c0', css: '--ny-secondary-bright' },
  { name: '危险色亮档', light: '#e0566b', dark: '#f9a3b0', css: '--ny-danger-bright' },
  { name: '辅色浅底', light: 'rgba(245, 169, 184, 0.18)', dark: 'rgba(245, 169, 184, 0.2)', css: '--ny-secondary-soft' },
  { name: '强调色', light: '#7c6bf5', dark: '#9b8dfa', css: '--ny-accent' },
  { name: '强调色浅底', light: 'rgba(124, 107, 245, 0.14)', dark: 'rgba(124, 107, 245, 0.24)', css: '--ny-accent-soft' },
]

const matchTokens = [
  { name: '主色浅底', variable: '--ny-primary-soft' },
  { name: '焦点环', variable: '--ny-primary-ring' },
  { name: '主色底上的文字', variable: '--ny-on-primary' },
  { name: '浅底强调文字', variable: '--ny-primary-strong' },
  { name: '状态浅底', variable: '--ny-success-soft' },
  { name: '状态文字档', variable: '--ny-success-strong' },
  { name: '危险色悬停', variable: '--ny-danger-hover' },
  { name: '危险底上的文字', variable: '--ny-on-danger' },
]

const statusTokens = [
  { name: '信息', light: '#5bcffa', dark: '#5bcffa', css: '--ny-info' },
  { name: '成功', light: '#2eb88a', dark: '#46cf9b', css: '--ny-success' },
  { name: '警告', light: '#e59b3d', dark: '#f0bf7c', css: '--ny-warning' },
  { name: '危险', light: '#e15a6f', dark: '#f4788a', css: '--ny-danger' },
]

const surfaceTokens = [
  { name: '页面底色', variable: '--ny-bg' },
  { name: '品牌浅底', variable: '--ny-bg-accent' },
  { name: '容器底', variable: '--ny-surface' },
  { name: '次级容器底', variable: '--ny-surface-2' },
  { name: '三级底', variable: '--ny-surface-3' },
  { name: '悬浮底', variable: '--ny-surface-hover' },
  { name: '常规描边', variable: '--ny-border' },
  { name: '控件描边', variable: '--ny-border-strong' },
  { name: '分隔线', variable: '--ny-border-soft' },
  { name: '正文文字', variable: '--ny-text' },
  { name: '强调文字', variable: '--ny-text-strong' },
  { name: '次级文字', variable: '--ny-text-sub' },
  { name: '弱化文字', variable: '--ny-text-muted' },
  { name: '反色文字', variable: '--ny-text-invert' },
]

const shadows = [
  { name: '--ny-shadow-xs', variable: '--ny-shadow-xs' },
  { name: '--ny-shadow-sm', variable: '--ny-shadow-sm' },
  { name: '--ny-shadow-md', variable: '--ny-shadow-md' },
  { name: '--ny-shadow-lg', variable: '--ny-shadow-lg' },
]

const shapeTokens = [
  { name: '--ny-radius-xs', desc: '2px, 小标签与角标' },
  { name: '--ny-radius-sm', desc: '4px, 按钮与输入框' },
  { name: '--ny-radius-md', desc: '6px, 卡片与代码块' },
  { name: '--ny-radius-lg', desc: '8px, 对话框与抽屉' },
  { name: '--ny-radius-xl', desc: '11px, 大圆角容器' },
  { name: '--ny-radius-pill', desc: '999px, 胶囊与进度轨道' },
]

const sizeTokens = [
  { name: '--ny-control-height-sm', desc: '30px, 紧凑控件与小按钮' },
  { name: '--ny-control-height-md', desc: '38px, 控件默认高度' },
  { name: '--ny-control-height-lg', desc: '46px, 表单与大按钮' },
  { name: '--ny-space-1', desc: '4px, 最小间距' },
  { name: '--ny-space-2', desc: '8px' },
  { name: '--ny-space-3', desc: '12px' },
  { name: '--ny-space-4', desc: '16px' },
  { name: '--ny-space-5', desc: '20px' },
  { name: '--ny-space-6', desc: '24px' },
  { name: '--ny-space-7', desc: '32px' },
  { name: '--ny-space-8', desc: '40px' },
  { name: '--ny-font-size-xs', desc: '12px, 辅助说明' },
  { name: '--ny-font-size-sm', desc: '13px' },
  { name: '--ny-font-size-md', desc: '14px, 正文默认' },
  { name: '--ny-font-size-lg', desc: '16px, 对话框标题' },
  { name: '--ny-font-size-xl', desc: '20px' },
  { name: '--ny-font-size-2xl', desc: '26px, 结果页标题' },
]

const layerTokens = [
  { name: '--ny-z-affix', desc: '10, 固钉' },
  { name: '--ny-z-header', desc: '20, 顶栏' },
  { name: '--ny-z-sidebar', desc: '30, 侧栏' },
  { name: '--ny-z-dropdown', desc: '1000, 下拉菜单' },
  { name: '--ny-z-popup', desc: '1010, 气泡类浮层' },
  { name: '--ny-z-mask', desc: '1090, 遮罩' },
  { name: '--ny-z-modal', desc: '1100, 对话框' },
  { name: '--ny-z-drawer', desc: '1110, 抽屉' },
  { name: '--ny-z-message', desc: '1200, 全局提示' },
]

const codeOverrides = `<!-- 主题就是 CSS 变量: 在更靠内的一层重新声明即可 (不用 !important, 后写的规则优先) -->
<style>
  .my-app {
    --ny-primary: #7c6bf5;
    --ny-radius-sm: 10px;
  }
</style>

<!-- 也可以整体切到深色, 只影响这棵子树 -->
<div data-theme="dark">
  <NyButton variant="primary">深色区块</NyButton>
</div>`

const codeApi = `import '@chengzhimeow/nyana-ui/dist/style.css'
// 想覆盖令牌时, 在组件库样式之后引入这份覆盖表
import './my-theme.css'`

const overviewTokens = [
  { name: '颜色', desc: '语义色 + 状态色 + 容器与文字, 深浅两套值都由令牌给出', type: '色值', default: '见下表' },
  { name: '形状', desc: '圆角与控件高度', type: 'px 长度', default: '见下表' },
  { name: '阴影', desc: '四级阴影与统一焦点环', type: 'box-shadow', default: '见下表' },
  { name: '间距与字号', desc: 'space 刻度与字号刻度', type: 'px 长度', default: '见下表' },
  { name: '层级', desc: '浮层 z-index, 组件按此取值', type: '整数', default: '见下表' },
]

const globalTokens = [
  { name: '--ny-font-family', desc: '正文与控件字体', type: 'font-family', default: '系统无衬线栈' },
  { name: '--ny-font-family-mono', desc: '代码与数值字体', type: 'font-family', default: '等宽栈' },
  { name: '--ny-transition-fast', desc: '悬停等短过渡', type: 'transition', default: '0.15s ease' },
  { name: '--ny-transition-base', desc: '浮层与展开动画时长', type: 'transition', default: '0.25s' },
  { name: '--ny-ease', desc: '统一缓动曲线', type: 'easing', default: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  { name: '--ny-shadow-focus', desc: '键盘焦点环', type: 'box-shadow', default: '0 0 0 3px var(--ny-primary-ring)' },
  { name: '--ny-mask', desc: '遮罩层颜色', type: 'color', default: '深色半透明' },
  { name: '--ny-track', desc: '进度条与骨架的轨道色', type: 'color', default: '半透明中性色' },
  { name: '--ny-text-invert', desc: '深底浅字时的文字色', type: 'color', default: '随主题反转' },
]
</script>

<template>
  <DocPage title="Theme 主题令牌" desc="颜色, 尺寸与阴影变量, 深浅色切换">

    <DemoBlock
      title="品牌色与主题切换"
      desc="所有颜色都走 CSS 变量, 深浅色由根节点的 data-theme 切换, 组件里没有任何主题分支。"
      :value="`themeMode: ${themeMode}`"
    >
      <div class="ex-group">
        <NyButton size="sm" :variant="isDark ? 'default' : 'primary'" @click="setTheme('light')">
          浅色
        </NyButton>
        <NyButton size="sm" :variant="isDark ? 'primary' : 'default'" @click="setTheme('dark')">
          深色
        </NyButton>
        <NyButton size="sm" @click="setTheme('auto')">跟随系统</NyButton>
      </div>

      <div class="ex-grid">
        <div v-for="token in brandTokens" :key="token.css">
          <div class="ex-swatch" :style="{ background: `var(${token.css})` }" />
          <p class="ex-swatch-label">{{ token.name }}</p>
          <p class="ex-note">{{ token.css }}</p>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="16 色色卡"
      desc="每个颜色都是一整套色阶: 默认色 / 浅色 / 背景色 / 深色 / 文字色 / 实底配字。卡片里每一块就是那一档, 块上的文字用的是配套文字色, 一眼能看出搭配关系。"
    >
      <div class="palette">
        <div v-for="color in nyPalette" :key="color.name" class="palette__card">
          <header class="palette__head">
            <span class="palette__name">{{ color.label }}</span>
            <span class="palette__key">{{ color.name }}</span>
          </header>

          <div
            class="palette__tier palette__tier--lead"
            :style="{ background: color.value, color: color.on }"
          >
            <span>默认色</span>
            <span class="palette__hex">{{ color.value }}</span>
          </div>

          <div class="palette__row">
            <div class="palette__tier" :style="{ background: color.light, color: color.text }">
              <span>浅色</span>
            </div>

            <div class="palette__tier" :style="{ background: color.bg, color: color.text }">
              <span>背景色</span>
            </div>

            <div class="palette__tier" :style="{ background: color.deep, color: color.light }">
              <span>深色</span>
            </div>
          </div>

          <div class="palette__text" :style="{ background: color.bg, color: color.text }">
            <span>文字色</span>
            <span class="palette__hex">{{ color.text }}</span>
          </div>

          <footer class="palette__foot">
            <code>--ny-{{ color.name }}</code>
            <code>-light</code>
            <code>-bg</code>
            <code>-deep</code>
            <code>-text</code>
            <code>--ny-on-{{ color.name }}</code>
          </footer>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="色卡的实际用法"
      desc="浅底 + 文字色是最常用的组合: 标签, 头像与提示都用它; 实底配字只用在需要强调的小色块上。"
    >
      <div class="ex-group">
        <NyTag
          v-for="color in nyPalette"
          :key="color.name"
          round
          :style="{
            background: `var(--ny-${color.name}-bg)`,
            color: `var(--ny-${color.name}-text)`,
            borderColor: 'transparent',
          }"
        >
          {{ color.label }}
        </NyTag>
      </div>

      <div class="ex-group">
        <NyAvatar v-for="color in nyPalette.slice(0, 8)" :key="color.name" :text="color.label" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="状态色"
      desc="四种状态色各自带 soft 浅底与 strong 文字档, 深浅色下取值不同, 对比度都够用。"
    >
      <div class="ex-grid">
        <div v-for="token in statusTokens" :key="token.css">
          <div class="ex-swatch" :style="{ background: `var(${token.css})` }" />
          <p class="ex-swatch-label">{{ token.name }}</p>
          <p class="ex-note">{{ token.css }}</p>
          <p class="ex-note">浅色 {{ token.light }} / 深色 {{ token.dark }}</p>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="浅底与文字档"
      desc="需要浅底配深字时用 soft 加 strong 这一对, 不要自己拼半透明色。"
    >
      <div class="ex-grid">
        <div v-for="token in matchTokens" :key="token.variable">
          <div
            class="ex-swatch"
            :style="{ background: `var(${token.variable})`, boxShadow: 'inset 0 0 0 1px var(--ny-border)' }"
          />
          <p class="ex-swatch-label">{{ token.name }}</p>
          <p class="ex-note">{{ token.variable }}</p>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="背景与文字"
      desc="容器底色分三级, 文字分四级, 换主题时这些值整体反转, 组件里不用判断深浅色。"
    >
      <div class="ex-grid">
        <div v-for="token in surfaceTokens" :key="token.variable">
          <div class="ex-swatch" :style="{ background: `var(${token.variable})` }" />
          <p class="ex-swatch-label">{{ token.name }}</p>
          <p class="ex-note">{{ token.variable }}</p>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="阴影与圆角"
      desc="浮层按抬升层级取阴影, 控件与卡片按尺寸取圆角, 不要在页面里写死数值。"
    >
      <div class="ex-grid ex-grid--2">
        <div v-for="token in shadows" :key="token.variable">
          <div class="ex-swatch" :style="{ boxShadow: `var(${token.variable})` }" />
          <p class="ex-swatch-label">{{ token.variable }}</p>
        </div>
      </div>

      <div class="ex-grid ex-grid--3">
        <div v-for="token in shapeTokens" :key="token.name">
          <div class="ex-swatch" :style="{ borderRadius: `var(${token.name})`, background: 'var(--ny-surface-3)' }" />
          <p class="ex-swatch-label">{{ token.name }}</p>
          <p class="ex-note">{{ token.desc }}</p>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="尺寸与层级"
      desc="控件高度, 间距, 字号与浮层层级都是固定刻度, 组件按档取值。"
    >
      <ApiTable title="尺寸令牌" :rows="sizeTokens" />
      <ApiTable title="层级令牌" :rows="layerTokens" />
    </DemoBlock>

    <DemoBlock
      title="覆盖令牌"
      desc="在更靠内的一层重新声明变量即可, 不用改组件样式也不用 !important。"
      :code="codeOverrides"
    >
      <div class="ex-panel">
        <p class="ex-note">这个演示块是一份复制粘贴的说明, 深色区块请点上面的切换按钮看整页效果。</p>

        <pre class="ex-code">{{ codeApi }}</pre>

        <p class="ex-note">
          优先级: 组件库在 :root 上给浅色令牌, [data-theme='dark'] 覆盖成深色, 未设置 data-theme 时再用
          @media (prefers-color-scheme: dark) 跟随系统。写在 data-theme 规则之后的同名变量优先级最高, 因此
          :root 上重声明的令牌可以同时改掉深浅两套主题。
        </p>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="令牌分组" :rows="overviewTokens" />
      <ApiTable title="全局令牌" :rows="globalTokens" />
      <ApiTable
        title="深浅色规则"
        kind="methods"
        :rows="[
          { name: 'data-theme=&quot;dark&quot;', desc: '显式深色, 该子树拿到深色令牌' },
          { name: 'data-theme=&quot;light&quot;', desc: '显式浅色, 即使系统是深色也保持浅色' },
          { name: 'prefers-color-scheme: dark', desc: '未设置 data-theme 时跟随系统, 由 :root:not([data-theme=light]) 命中' },
        ]"
      />
    </template>
  </DocPage>
</template>

<style scoped lang="scss">
.palette {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
}

.palette__card {
  overflow: hidden;
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-md);
  background: var(--ny-surface);
}

.palette__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
}

.palette__name {
  color: var(--ny-text-strong);
  font-size: var(--ny-font-size-sm);
  font-weight: 600;
}

.palette__key {
  color: var(--ny-text-muted);
  font-family: var(--ny-font-family-mono);
  font-size: var(--ny-font-size-xs);
}

.palette__tier {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 8px 10px;
  font-size: var(--ny-font-size-xs);
}

.palette__tier--lead {
  padding: 14px 12px;
  font-size: var(--ny-font-size-sm);
  font-weight: 600;
}

.palette__row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.palette__row .palette__tier {
  justify-content: center;
  padding: 12px 4px;
}

.palette__text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 10px 12px;
  font-size: var(--ny-font-size-sm);
  font-weight: 600;
}

.palette__hex {
  font-family: var(--ny-font-family-mono);
  font-size: var(--ny-font-size-xs);
  font-weight: 400;
  opacity: 0.85;
}

.palette__foot {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--ny-border-soft);

  code {
    color: var(--ny-text-muted);
    font-family: var(--ny-font-family-mono);
    font-size: 11px;
  }
}
</style>
