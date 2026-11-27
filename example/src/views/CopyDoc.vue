<script setup lang="ts">
import { NyCopyButton, NyCopyField, NyKeyValue } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const sftp = [
  { label: '主机', value: 'sftp.na-mc.cn:2022' },
  { label: '用户名', value: 'survival.8f2c' },
  { label: '密码', value: 'Kx7p-2fQa-91Lm', secret: true },
]

const codeField = `<NyCopyField value="mc.na-mc.cn:25565" />`
const codeKv = `<NyKeyValue :items="[
  { label: '主机', value: 'sftp.na-mc.cn:2022' },
  { label: '用户名', value: 'survival.8f2c' },
  { label: '密码', value: 'Kx7p-2fQa-91Lm', secret: true },
]" />`
const codeButton = `<NyCopyButton text="ins_8f2c1a9e" />
<NyCopyButton text="ins_8f2c1a9e" label="复制 ID" type="default" />`
</script>

<template>
  <DocPage title="Copy 复制与凭据" desc="连接地址、凭据、ID 这类要被复制的文字。复制成功后按钮变成对勾, 并弹出 已复制 提示。">
    <DemoBlock title="CopyField 复制框" desc="页面上最重要的一串文字 (例如游戏地址), 大号等宽, 右边是主色复制按钮。" :code="codeField">
      <div style="max-width: 420px"><NyCopyField value="mc.na-mc.cn:25565" /></div>
    </DemoBlock>

    <DemoBlock title="KeyValue 凭据列表" desc="每行一个细线框, 左边标签, 右边等宽值 + 复制; secret 默认打码, 点眼睛显示。" :code="codeKv">
      <div style="max-width: 420px"><NyKeyValue :items="sftp" /></div>
    </DemoBlock>

    <DemoBlock title="CopyButton 复制按钮" desc="没有 label 时是只有图标的小按钮, 放在行内文字后面。" :code="codeButton">
      <div class="ex-group">
        <span class="ex-mono">ins_8f2c1a9e</span><NyCopyButton text="ins_8f2c1a9e" />
        <NyCopyButton text="ins_8f2c1a9e" label="复制 ID" type="default" />
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="CopyField Props" :rows="[{ name: 'value', type: 'string', desc: '要显示和复制的文字' }, { name: 'large', type: 'boolean', default: 'true', desc: '大号字' }, { name: 'copyLabel', type: 'string', default: `'复制'`, desc: '按钮文字' }]" />
      <ApiTable title="KeyValue Props" :rows="[{ name: 'items', type: 'NyKeyValueItem[]', desc: '{ label, value, copyable?, secret? }' }, { name: 'mono', type: 'boolean', default: 'true', desc: '值用等宽字' }]" />
      <ApiTable title="CopyButton Props" :rows="[{ name: 'text', type: 'string', desc: '要复制的文字' }, { name: 'label', type: 'string', desc: '有文字时是小按钮' }, { name: 'tip', type: 'string | false', default: `'已复制'`, desc: '成功提示, false 不提示' }, { name: 'type', type: `'ghost' | 'default' | 'primary'`, default: `'ghost'`, desc: '外观' }]" />
      <ApiTable title="函数" kind="methods" :rows="[{ name: 'nyCopy(text, tip?)', type: 'Promise<boolean>', desc: '复制到剪贴板, 不支持 clipboard API 时自动退回 execCommand' }]" />
    </template>
  </DocPage>
</template>
