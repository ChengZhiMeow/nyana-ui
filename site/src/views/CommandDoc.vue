<script setup lang="ts">
import { NyCommandBlock, NyTaskSteps } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const commands = [
  { label: 'curl', value: 'curl -fsSL https://cheng.na-mc.cn/api/nodes/enroll/9f3c2e/install.sh | bash' },
  { label: 'wget', value: 'wget -qO- https://cheng.na-mc.cn/api/nodes/enroll/9f3c2e/install.sh | bash' },
]

const steps = [
  { title: '下载整合包', status: 'done' as const, time: '0:42' },
  { title: '安装 NeoForge 21.1.77', status: 'done' as const, time: '1:05' },
  { title: '下载模组 214 / 368', status: 'current' as const, time: '进行中' },
  { title: '首次启动', status: 'pending' as const },
]

const codeCmd = `<NyCommandBlock
  title="在节点上以 root 运行"
  :commands="commands"
  hint="令牌 24 小时内有效"
/>`
const codeSteps = `<NyTaskSteps :steps="[
  { title: '下载整合包', status: 'done', time: '0:42' },
  { title: '下载模组 214 / 368', status: 'current', time: '进行中' },
  { title: '首次启动', status: 'pending' },
]" />`
</script>

<template>
  <DocPage title="CommandBlock 命令块" desc="一键复制的命令行 (接入节点、安装脚本) 与后台任务的分步清单。">
    <DemoBlock title="命令块" desc="多种写法时上方出现切换; 下方一行写清楚身份和有效期。" :code="codeCmd">
      <div style="max-width: 640px">
        <NyCommandBlock title="在节点上以 root 运行" :commands="commands" hint="令牌 24 小时内有效, 2026-11-28 18:20 过期。" />
      </div>
    </DemoBlock>

    <DemoBlock title="TaskSteps 任务步骤" desc="完成打绿勾, 当前步骤转圈, 失败打红叉; 右侧是耗时。" :code="codeSteps">
      <div style="max-width: 360px"><NyTaskSteps :steps="steps" /></div>
    </DemoBlock>

    <template #api>
      <ApiTable
        title="CommandBlock Props"
        :rows="[
          { name: 'command', type: 'string', desc: '单条命令' },
          { name: 'commands', type: 'NyCommandOption[]', desc: '多种写法 { label, value }, 出现切换' },
          { name: 'prompt', type: 'string', default: `'$'`, desc: '提示符' },
          { name: 'title / hint', type: 'string', desc: '上方标题与下方说明' },
        ]"
      />
      <ApiTable title="TaskSteps Props" :rows="[{ name: 'steps', type: 'NyTaskStep[]', desc: `{ title, status?: 'done' | 'current' | 'pending' | 'error', time? }` }]" />
    </template>
  </DocPage>
</template>
