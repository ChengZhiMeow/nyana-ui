<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyGrid, NyParagraph, NyStack, NyText, NyTitle } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const levels: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5]
const lineOptions = [1, 2, 3]

const lines = ref(2)
const paragraphLines = ref(2)

const codeTitle = `<NyStack :gap="12">
  <NyTitle v-for="level in levels" :key="level" :level="level">H{{ level }} 标题</NyTitle>
</NyStack>`

const codeTitleExtra = `<NyStack :gap="14">
  <NyTitle :level="3" :mark="true">带竖条的区块标题</NyTitle>
  <NyTitle :level="4" align="center">居中的四级标题</NyTitle>
  <NyTitle :level="4" align="end">靠右的四级标题</NyTitle>
</NyStack>`

const codeSize = `<div class="ex-group">
  <NyText size="xs">xs 12px</NyText>
  <NyText size="sm">sm 13px</NyText>
  <NyText size="md">md 14px</NyText>
  <NyText size="lg">lg 16px</NyText>
  <NyText size="xl">xl 20px</NyText>
</div>

<div class="ex-group">
  <NyText weight="normal">normal</NyText>
  <NyText weight="medium">medium</NyText>
  <NyText weight="semibold">semibold</NyText>
  <NyText weight="bold">bold</NyText>
</div>`

const codeType = `<div class="ex-group">
  <NyText type="primary">主色文本</NyText>
  <NyText type="success">成功文本</NyText>
  <NyText type="warning">警告文本</NyText>
  <NyText type="danger">危险文本</NyText>
  <NyText type="secondary">次级文本</NyText>
  <NyText type="muted">弱化文本</NyText>
</div>

<div class="ex-group">
  <NyText :strong="true">加粗强调</NyText>
  <NyText :italic="true">斜体</NyText>
  <NyText :underline="true">下划线</NyText>
  <NyText :strike="true">删除线</NyText>
  <NyText :code="true">const count = 1</NyText>
  <NyText :mark="true">高亮</NyText>
</div>

<NyText align="center">align 让整行文本居中</NyText>`

const codeEllipsis = `<div class="ex-group">
  <NyButton
    v-for="item in lineOptions"
    :key="item"
    size="sm"
    :variant="item === lines ? 'primary' : 'default'"
    @click="lines = item"
  >
    {{ item }} 行
  </NyButton>
</div>

<div class="ex-group">
  <NyText :truncate="true">这是一段很长的说明文字, 用于演示单行省略号效果。</NyText>
</div>

<NyText :lines="lines">这是一段很长的说明文字, 用于演示多行省略号效果, 超出指定行数就被裁掉。</NyText>`

const codeParagraph = `<div class="ex-group">
  <NyButton
    v-for="item in lineOptions"
    :key="item"
    size="sm"
    :variant="item === paragraphLines ? 'primary' : 'default'"
    @click="paragraphLines = item"
  >
    {{ item }} 行
  </NyButton>
</div>

<NyParagraph :lines="paragraphLines">
  段落组件负责正文的阅读节奏: 字号, 行高与语义色统一由它控制。内容超出指定行数时右侧会出现展开按钮,
  展开后按钮变成收起, 再次点击回到折叠态。把 lines 设为 0 表示不限制行数, 此时展开按钮不会出现。
</NyParagraph>

<NyParagraph :lines="0" size="sm" type="secondary">
  不限行数的次级段落: 用 size 与 type 就能得到一套弱化的辅助说明, 不需要另写样式。
</NyParagraph>`

const apiTitleProps = [
  { name: 'level', desc: '标题级别, 1 最大', type: '1 | 2 | 3 | 4 | 5', default: '1' },
  { name: 'align', desc: '水平对齐', type: "'start' | 'center' | 'end'", default: "'start'" },
  { name: 'mark', desc: '标题前加一条品牌竖条', type: 'boolean', default: 'false' },
  { name: 'ellipsis', desc: '单行省略, 需要父级宽度受限', type: 'boolean', default: 'false' },
]

const apiTextProps = [
  { name: 'tag', desc: '渲染的标签, 行内文本保持 span', type: 'string', default: "'span'" },
  { name: 'size', desc: '字号档', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
  { name: 'weight', desc: '字重档', type: "'normal' | 'medium' | 'semibold' | 'bold'", default: "'normal'" },
  { name: 'type', desc: '语义色', type: "'default' | 'secondary' | 'muted' | 'primary' | 'success' | 'warning' | 'danger'", default: "'default'" },
  { name: 'strong', desc: '加粗并改用强调文字色', type: 'boolean', default: 'false' },
  { name: 'italic', desc: '斜体', type: 'boolean', default: 'false' },
  { name: 'underline', desc: '下划线', type: 'boolean', default: 'false' },
  { name: 'strike', desc: '删除线', type: 'boolean', default: 'false' },
  { name: 'code', desc: '等宽字体加浅底, 用于行内代码', type: 'boolean', default: 'false' },
  { name: 'mark', desc: '背景高亮', type: 'boolean', default: 'false' },
  { name: 'disabled', desc: '弱化并禁止选中', type: 'boolean', default: 'false' },
  { name: 'truncate', desc: '单行省略', type: 'boolean', default: 'false' },
  { name: 'lines', desc: '最多显示几行, 0 表示不限制', type: 'number', default: '0' },
  { name: 'align', desc: '水平对齐, 非 start 时会变成块级元素', type: "'start' | 'center' | 'end'", default: "'start'" },
]

const apiParagraphProps = [
  { name: 'size', desc: '字号档', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'type', desc: '语义色', type: "'default' | 'secondary' | 'muted'", default: "'default'" },
  { name: 'lines', desc: '折叠时最多显示的行数, 0 表示不折叠', type: 'number', default: '2' },
  { name: 'expandable', desc: '允许展开收起, 仅在有 lines 时生效', type: 'boolean', default: 'true' },
  { name: 'align', desc: '水平对齐', type: "'start' | 'center' | 'end'", default: "'start'" },
]

const apiSlots = [
  { name: 'NyTitle default', desc: '标题内容' },
  { name: 'NyText default', desc: '正文内容' },
  { name: 'NyParagraph default', desc: '段落正文, 内部由组件负责行高与省略' },
]
</script>

<template>
  <DocPage title="Typography 排版" desc="标题, 正文与段落的统一字号与语义色">

    <DemoBlock title="标题五级" desc="level 逐级递减, 渲染出的标签按 level 对应 h2 到 h6。" :code="codeTitle">
      <NyStack :gap="12">
        <NyTitle v-for="level in levels" :key="level" :level="level">H{{ level }} 标题</NyTitle>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="标题装饰与对齐"
      desc="mark 加品牌竖条, align 控制对齐, ellipsis 让长标题只占一行。"
      :code="codeTitleExtra"
    >
      <NyStack :gap="14">
        <NyTitle :level="3" :mark="true">带竖条的区块标题</NyTitle>
        <NyTitle :level="4" align="center">居中的四级标题</NyTitle>
        <NyTitle :level="4" align="end">靠右的四级标题</NyTitle>

        <NyGrid :columns="2" :gap="16">
          <NyTitle :level="4" :ellipsis="true">这段很长的标题在窄容器里超出宽度就会被裁掉, 不会换行</NyTitle>
          <NyTitle :level="5" :ellipsis="true">五级标题同样支持省略</NyTitle>
        </NyGrid>
      </NyStack>
    </DemoBlock>

    <DemoBlock title="字号与字重" desc="size 五档, weight 四档, 两者可以自由组合。" :code="codeSize">
      <NyStack :gap="12">
        <div class="ex-group">
          <NyText size="xs">xs 12px</NyText>
          <NyText size="sm">sm 13px</NyText>
          <NyText size="md">md 14px</NyText>
          <NyText size="lg">lg 16px</NyText>
          <NyText size="xl">xl 20px</NyText>
        </div>

        <div class="ex-group">
          <NyText weight="normal">normal</NyText>
          <NyText weight="medium">medium</NyText>
          <NyText weight="semibold">semibold</NyText>
          <NyText weight="bold">bold</NyText>
        </div>
      </NyStack>
    </DemoBlock>

    <DemoBlock title="语义色与修饰" desc="type 走语义色, 其余修饰位可以叠加。" :code="codeType">
      <NyStack :gap="12">
        <div class="ex-group">
          <NyText type="primary">主色文本</NyText>
          <NyText type="success">成功文本</NyText>
          <NyText type="warning">警告文本</NyText>
          <NyText type="danger">危险文本</NyText>
          <NyText type="secondary">次级文本</NyText>
          <NyText type="muted">弱化文本</NyText>
          <NyText :disabled="true">禁用文本</NyText>
        </div>

        <div class="ex-group">
          <NyText :strong="true">加粗强调</NyText>
          <NyText :italic="true">斜体</NyText>
          <NyText :underline="true">下划线</NyText>
          <NyText :strike="true">删除线</NyText>
          <NyText :code="true">const count = 1</NyText>
          <NyText :mark="true">高亮</NyText>
        </div>

        <NyText align="center">align 让整行文本居中</NyText>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="截断与多行省略"
      desc="truncate 做单行省略, lines 指定最多显示的行数。"
      :code="codeEllipsis"
      :value="'多行省略行数: ' + lines"
    >
      <NyStack :gap="12">
        <div class="ex-group">
          <NyButton
            v-for="item in lineOptions"
            :key="item"
            size="sm"
            :variant="item === lines ? 'primary' : 'default'"
            @click="lines = item"
          >
            {{ item }} 行
          </NyButton>
        </div>

        <div class="ex-group">
          <NyText :truncate="true">这是一段很长的说明文字, 用于演示单行省略号效果, 超出容器宽度会被裁掉。</NyText>
        </div>

        <NyText :lines="lines">这是一段很长的说明文字, 用于演示多行省略号效果, 超出指定行数就被裁掉, 剩下的内容不再显示。</NyText>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="段落展开收起"
      desc="内容被裁掉时自动出现展开按钮, lines 设 0 则完全不折叠。"
      :code="codeParagraph"
      :value="'段落折叠行数: ' + paragraphLines"
    >
      <NyStack :gap="16">
        <div class="ex-group">
          <NyButton
            v-for="item in lineOptions"
            :key="item"
            size="sm"
            :variant="item === paragraphLines ? 'primary' : 'default'"
            @click="paragraphLines = item"
          >
            {{ item }} 行
          </NyButton>
        </div>

        <NyParagraph :lines="paragraphLines">
          段落组件负责正文的阅读节奏: 字号, 行高与语义色统一由它控制。内容超出指定行数时会出现展开按钮,
          展开后按钮变成收起, 再次点击回到折叠态。把 lines 设为 0 表示不限制行数, 此时展开按钮不会出现。
        </NyParagraph>

        <NyParagraph :lines="0" size="sm" type="secondary">
          不限行数的次级段落: 用 size 与 type 就能得到一套弱化的辅助说明, 不需要另写样式。
        </NyParagraph>
      </NyStack>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyTitle Props" :rows="apiTitleProps" />
      <ApiTable title="NyText Props" :rows="apiTextProps" />
      <ApiTable title="NyParagraph Props" :rows="apiParagraphProps" />
      <ApiTable title="排版组件插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
