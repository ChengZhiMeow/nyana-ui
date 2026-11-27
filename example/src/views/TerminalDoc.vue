<script setup lang="ts">
import { ref } from 'vue'

import { NyTerminal, type NyTerminalLine } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const mode = ref<'real' | 'pseudo'>('pseudo')
const now = () => new Date().toTimeString().slice(0, 8)

const lines = ref<NyTerminalLine[]>([
  { time: '12:01:37', level: 'success', text: 'Done (8.412s)! For help, type "help"' },
  { time: '12:02:10', level: 'info', text: 'Steve joined the game' },
  { time: '12:03:44', level: 'warn', text: "Can't keep up! Is the server overloaded? Running 2140ms behind" },
  { time: '12:06:55', level: 'error', text: 'Could not pass event PlayerMoveEvent to EssentialsX v2.21.0' },
])

const replies: Record<string, string> = {
  list: 'There are 12 of a max of 20 players online: Steve, Alex, 橙汁喵, …',
  tps: 'TPS from last 1m, 5m, 15m: 19.98, 19.95, 19.97',
}

function run(command: string) {
  lines.value.push({ time: now(), level: 'prompt', text: '> ' + command })
  const key = command.replace(/^\//, '').split(' ')[0] ?? ''
  lines.value.push({ time: now(), level: 'info', text: replies[key] ?? 'Unknown command. Type "help" for help.' })
}

const code = `<NyTerminal v-model:mode="mode" :lines="lines" @command="run" @clear="lines = []" />

<!-- 真终端: 把 xterm 挂进默认插槽 -->
<NyTerminal v-model:mode="mode">
  <div ref="xtermEl" />
</NyTerminal>`
</script>

<template>
  <DocPage title="Terminal 终端" desc="实例控制台的外壳。真终端把 xterm 挂进默认插槽; 伪终端直接传 lines, 组件按级别着色, 底部是命令输入 (回车发送, ↑↓ 翻历史)。两种主题都是深色。">
    <DemoBlock title="伪终端 / 真终端" desc="试试输入 list 或 tps。顶部分段控件切换模式, 右侧是重新连接、清屏、全屏。" :code="code">
      <NyTerminal v-model:mode="mode" :lines="lines" height="360px" @command="run" @clear="lines = []">
        <template v-if="mode === 'real'" #default>
          <div class="ex-xterm">[12:01:37 INFO]: Done (8.412s)! For help, type "help"<br />&gt; <span class="ex-cursor">&nbsp;</span></div>
        </template>
      </NyTerminal>
    </DemoBlock>

    <DemoBlock title="只读" desc="没有操作权限时隐藏输入行, 标题旁标注 只读。">
      <NyTerminal :lines="lines.slice(0, 2)" readonly :switchable="false" status="connecting" height="180px" />
    </DemoBlock>

    <template #api>
      <ApiTable
        :rows="[
          { name: 'v-model:mode', type: `'real' | 'pseudo'`, default: `'pseudo'`, desc: '当前模式' },
          { name: 'lines', type: 'NyTerminalLine[]', desc: '伪终端的输出 { text, level?, time? }; level: info / warn / error / success / prompt / plain' },
          { name: 'title', type: 'string', default: `'服务器控制台'`, desc: '工具条标题' },
          { name: 'status', type: `'connected' | 'connecting' | 'disconnected'`, default: `'connected'`, desc: '连接状态' },
          { name: 'readonly', type: 'boolean', default: 'false', desc: '只读, 隐藏输入行' },
          { name: 'switchable', type: 'boolean', default: 'true', desc: '是否显示 真终端 / 伪终端 切换' },
          { name: 'height', type: 'string', default: `'480px'`, desc: '高度' },
        ]"
      />
      <ApiTable title="Events" kind="events" :rows="[{ name: 'command', type: '(command: string)', desc: '伪终端发送命令' }, { name: 'reconnect', desc: '点重新连接' }, { name: 'clear', desc: '点清屏' }]" />
      <ApiTable title="Slots" kind="slots" :rows="[{ name: 'default', desc: '输出区, 真终端在这里挂 xterm' }, { name: 'actions', desc: '工具条上额外的按钮' }]" />
    </template>
  </DocPage>
</template>

<style scoped lang="scss">
.ex-xterm {
  color: #e6e6e3;
}

.ex-cursor {
  background: #e6e6e3;
}
</style>
