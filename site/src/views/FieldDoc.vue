<script setup lang="ts">
import { ref } from 'vue'

import { NyField, NyIcon, NyInputShell } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const name = ref('')
const mail = ref('')
const remark = ref('')

function onNameInput(event: Event) {
  name.value = (event.target as HTMLInputElement).value
}

function onMailInput(event: Event) {
  mail.value = (event.target as HTMLInputElement).value
}

function onRemarkInput(event: Event) {
  remark.value = (event.target as HTMLTextAreaElement).value
}

const codeBasic = `<NyField label="昵称" hint="2-8 个字符, 会显示在个人主页" required>
  <NyInputShell>
    <input class="ny-shell__control" type="text" placeholder="请输入昵称" />
  </NyInputShell>
</NyField>`

const codeError = `<NyField label="邮箱" hint="用于接收通知">
  <NyInputShell>
    <input class="ny-shell__control" type="text" />
  </NyInputShell>
</NyField>

<!-- error 一出现就把 hint 顶掉, 同时点亮标签与描边 -->
<NyField label="邮箱" hint="用于接收通知" error="邮箱格式不正确">
  <NyInputShell invalid>
    <input class="ny-shell__control" type="text" value="nyana@" />
  </NyInputShell>
</NyField>`

const codeSize = `<NyField label="标题" size="sm" hint="小尺寸下标签与控件的间距也会收紧">
  <NyInputShell size="sm">
    <input class="ny-shell__control" type="text" />
  </NyInputShell>
</NyField>`

const codeSlots = `<NyField hint="附加信息放在右下角" required>
  <template #label>
    <NyIcon name="user" :size="14" />
    联系人
  </template>

  <NyInputShell multiline>
    <textarea class="ny-shell__control" :rows="3" />
  </NyInputShell>

  <template #hint>最多 60 个字符</template>
  <template #extra>{{ remark.length }}/60</template>
</NyField>`

const codeDisabled = `<NyField label="工号" hint="由系统分配" disabled>
  <NyInputShell disabled>
    <input class="ny-shell__control" type="text" value="NY-0001" disabled />
  </NyInputShell>
</NyField>`

const apiProps = [
  { name: 'label', desc: '标签文字, 也可以直接用 label 插槽', type: 'string', default: "''" },
  { name: 'hint', desc: '提示文案, 有 error 时被顶掉', type: 'string', default: "''" },
  { name: 'error', desc: '错误文案, 同时点亮标签与控件描边', type: 'string | null', default: 'null' },
  { name: 'required', desc: '标签后缀显示必填星号', type: 'boolean', default: 'false' },
  { name: 'size', desc: '尺寸档, 影响标签间距', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'disabled', desc: '禁用态, 标签转成弱化色', type: 'boolean', default: 'false' },
  { name: 'controlId', desc: '标签 for 指向的控件 id', type: 'string', default: '—' },
  { name: 'messageId', desc: '提示与错误文案的 id, 供控件的 aria-describedby 引用', type: 'string', default: '—' },
]

const apiSlots = [
  { name: 'default', desc: '控件本体, 通常是 NyInputShell 加一个控件', type: '—' },
  { name: 'label', desc: '自定义标签内容, 可以放图标', type: '—' },
  { name: 'hint', desc: '自定义提示内容, 有 error 时不渲染', type: '—' },
  { name: 'extra', desc: '右下角补充信息, 如字数统计', type: '—' },
]
</script>

<template>
  <DocPage title="Field 字段" desc="标签, 提示与错误的字段外壳">

    <DemoBlock
      title="基础结构"
      desc="标签在上, 控件居中, 提示在下; required 只在标签后加一个星号, 校验由使用方决定。"
      :code="codeBasic"
      :value="`当前值: ${name || '空'}`"
    >
      <NyField label="昵称" hint="2-8 个字符, 会显示在个人主页" required>
        <NyInputShell>
          <input
            class="ny-shell__control"
            type="text"
            placeholder="请输入昵称"
            :value="name"
            @input="onNameInput"
          />
        </NyInputShell>
      </NyField>
    </DemoBlock>

    <DemoBlock
      title="错误态"
      desc="传了 error 就进入失败态: 标签变红, hint 让位给错误文案, 控件描边由 invalid 控制。"
      :code="codeError"
      :value="`当前值: ${mail || '空'}`"
    >
      <div class="ex-group">
        <NyField label="邮箱" hint="用于接收通知">
          <NyInputShell>
            <input
              class="ny-shell__control"
              type="text"
              placeholder="name@example.com"
              :value="mail"
              @input="onMailInput"
            />
          </NyInputShell>
        </NyField>

        <NyField label="邮箱" hint="用于接收通知" error="邮箱格式不正确">
          <NyInputShell invalid>
            <input class="ny-shell__control" type="text" value="nyana@" />
          </NyInputShell>
        </NyField>
      </div>
    </DemoBlock>

    <DemoBlock
      title="尺寸"
      desc="size 只影响标签与控件之间的间距, 控件高度由外壳自己的 size 决定, 两个一起改才协调。"
      :code="codeSize"
      :value="'sm 与 md 对比'"
    >
      <div class="ex-group">
        <NyField label="标题" size="sm" hint="小尺寸">
          <NyInputShell size="sm">
            <input class="ny-shell__control" type="text" placeholder="sm" />
          </NyInputShell>
        </NyField>

        <NyField label="标题" hint="默认尺寸">
          <NyInputShell>
            <input class="ny-shell__control" type="text" placeholder="md" />
          </NyInputShell>
        </NyField>
      </div>
    </DemoBlock>

    <DemoBlock
      title="插槽"
      desc="label 插槽可以放图标, hint 插槽换成任意内容, extra 用来放右下角的补充信息。"
      :code="codeSlots"
      :value="`当前值: ${remark || '空'} (${remark.length}/60)`"
    >
      <NyField hint="附加信息放在右下角" required>
        <template #label>
          <NyIcon name="user" :size="14" />
          联系人
        </template>

        <NyInputShell multiline>
          <textarea
            class="ny-shell__control"
            :rows="3"
            placeholder="备注"
            :value="remark"
            @input="onRemarkInput"
          />
        </NyInputShell>

        <template #hint>最多 60 个字符</template>
        <template #extra>{{ remark.length }}/60</template>
      </NyField>
    </DemoBlock>

    <DemoBlock
      title="禁用态"
      desc="disabled 让标签回到弱化色, 控件本身的禁用状态仍由 NyInputShell 负责。"
      :code="codeDisabled"
      :value="'工号由系统分配, 不可编辑'"
    >
      <NyField label="工号" hint="由系统分配" disabled>
        <NyInputShell disabled>
          <input class="ny-shell__control" type="text" value="NY-0001" disabled />
        </NyInputShell>
      </NyField>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyField Props" :rows="apiProps" />
      <ApiTable title="NyField 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
