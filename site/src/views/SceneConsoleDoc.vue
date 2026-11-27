<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  NyAlert,
  NyAvatar,
  NyButton,
  NyCard,
  NyChoiceCard,
  NyChoiceGroup,
  NyCopyField,
  NyGrid,
  NyIcon,
  NyInput,
  NyKeyValue,
  NyLayout,
  NyMeter,
  NyMetricCard,
  NyModal,
  NyPill,
  NyPlayerHead,
  NySegmented,
  NySwitch,
  NyTable,
  NyTabs,
  NyTaskSteps,
  NyTerminal,
  nyMessage,
  type NyNavGroup,
  type NyTerminalLine,
} from '@chengzhimeow/nyana-ui'

type Page = 'dashboard' | 'instances' | 'instance' | 'shop'
const page = ref<Page>('dashboard')

const nav = computed<NyNavGroup[]>(() => [
  { title: '概览', items: [{ key: 'dashboard', label: '仪表盘', icon: 'dashboard' }, { key: 'instances', label: '实例', icon: 'server' }] },
  { title: '服务', items: [{ key: 'shop', label: '购买服务器', icon: 'cart' }, { key: 'wallet', label: '钱包', icon: 'wallet' }] },
  { title: '支持', items: [{ key: 'tickets', label: '工单', icon: 'mail', badge: 1 }, { key: 'news', label: '公告', icon: 'megaphone' }] },
])
const activeKey = computed(() => (page.value === 'instance' ? 'instances' : page.value))
const titles: Record<Page, [string, string]> = {
  dashboard: ['仪表盘', '概览'],
  instances: ['实例', '共 4 个'],
  instance: ['实例', '生存服'],
  shop: ['购买服务器', '选择配置'],
}

function go(key: string) {
  if (key === 'dashboard' || key === 'instances' || key === 'shop') page.value = key
  else nyMessage.info('演示里只做了仪表盘、实例与购买')
}

interface Instance {
  name: string
  ver: string
  node: string
  exp: string
  state: 'running' | 'stopped' | 'installing'
  icon: string
  cpu: number
  mem: [number, number]
  disk: [number, number]
  online: string
}

const instances = ref<Instance[]>([
  { name: '生存服', ver: 'Paper 1.21.1', node: '枣庄 BGP', exp: '12-30 到期', state: 'running', icon: 'box', cpu: 17, mem: [5.2, 8], disk: [22, 40], online: '12 人在线' },
  { name: 'ATM10 测试', ver: 'NeoForge 21.1.77', node: '枣庄 BGP', exp: '3 天后到期', state: 'installing', icon: 'package', cpu: 0, mem: [0, 12], disk: [18, 60], online: '安装中' },
  { name: '小游戏大厅', ver: 'Velocity 3.4', node: '宿迁电信', exp: '01-15 到期', state: 'stopped', icon: 'layers', cpu: 0, mem: [0, 2], disk: [5, 40], online: '未运行' },
  { name: '创造服', ver: 'Fabric 1.21.4', node: '宿迁电信', exp: '02-02 到期', state: 'running', icon: 'box', cpu: 8, mem: [3.2, 8], disk: [12, 40], online: '3 人在线' },
])
const stateInfo = {
  running: { type: 'success', text: '运行中' },
  stopped: { type: 'default', text: '已停止' },
  installing: { type: 'primary', text: '安装中' },
} as const

const current = ref(instances.value[0]!)
function open(item: Instance) {
  current.value = item
  tab.value = 'terminal'
  page.value = 'instance'
}

function toggle(item: Instance) {
  item.state = item.state === 'running' ? 'stopped' : 'running'
  nyMessage.success(item.state === 'running' ? `已开启 ${item.name}` : `已关闭 ${item.name}`)
}

const tab = ref('terminal')
const tabs = [
  { key: 'terminal', label: '实例终端' },
  { key: 'files', label: '文件管理' },
  { key: 'backups', label: '备份' },
  { key: 'network', label: 'NAT 转发' },
  { key: 'startup', label: '启动设置' },
]

const mode = ref<'real' | 'pseudo'>('pseudo')
const lines = ref<NyTerminalLine[]>([
  { time: '12:01:37', level: 'success', text: 'Done (8.412s)! For help, type "help"' },
  { time: '12:02:10', level: 'info', text: 'Steve joined the game' },
  { time: '12:02:41', level: 'info', text: 'Alex joined the game' },
  { time: '12:03:44', level: 'warn', text: "Can't keep up! Is the server overloaded? Running 2140ms behind" },
  { time: '12:04:02', level: 'info', text: 'There are 12 of a max of 20 players online' },
])
function run(command: string) {
  const time = new Date().toTimeString().slice(0, 8)
  lines.value.push({ time, level: 'prompt', text: '> ' + command })
  lines.value.push({ time, level: 'info', text: command === 'list' ? 'There are 12 of a max of 20 players online' : 'Unknown command. Type "help" for help.' })
}

const players = [
  ['Steve', 32],
  ['Alex', 41],
  ['橙汁喵', 18],
  ['小鱼干', 26],
  ['Notch', 88],
  ['Grian', 39],
] as const

const sftp = [
  { label: '主机', value: 'sftp.na-mc.cn:2022' },
  { label: '用户名', value: 'survival.8f2c' },
  { label: '密码', value: 'Kx7p-2fQa-91Lm', secret: true },
]

const fileColumns = [
  { key: 'name', title: '名称' },
  { key: 'size', title: '大小', align: 'end' as const, width: 110 },
  { key: 'time', title: '修改时间', width: 150 },
]
const files = [
  { name: 'world', size: '—', time: '今天 12:00', dir: true },
  { name: 'plugins', size: '—', time: '11-26 20:41', dir: true },
  { name: 'logs', size: '—', time: '今天 12:01', dir: true },
  { name: 'paper-1.21.1-132.jar', size: '48.2 MB', time: '11-14 18:20' },
  { name: 'server.properties', size: '1.6 KB', time: '今天 10:02' },
]

const backupColumns = [
  { key: 'time', title: '备份' },
  { key: 'kind', title: '类型' },
  { key: 'size', title: '大小', align: 'end' as const },
  { key: 'ops', title: '', width: 90 },
]
const backups = [
  { time: '11-26 04:00', kind: '自动', size: '2.2 GB' },
  { time: '11-25 04:00', kind: '自动', size: '2.2 GB' },
  { time: '11-24 21:13', kind: '手动 · 更新插件前', size: '2.1 GB' },
]

const natColumns = [
  { key: 'addr', title: '外部地址' },
  { key: 'port', title: '内部端口', width: 110 },
  { key: 'use', title: '用途' },
]
const nat = [
  { addr: 'mc.na-mc.cn:25565', port: 25565, use: '游戏入口' },
  { addr: 'mc.na-mc.cn:25801', port: 8100, use: 'BlueMap 网页地图' },
]

const java = ref<string | number>('21')
const autoRestart = ref(true)
const probe = ref(true)
const jvm = ref('-Xms2G -Xmx7G -XX:+UseG1GC')
const killOpen = ref(false)

const server = ref('paper')
const months = ref(3)
const nodeChoice = ref('zz')
</script>

<template>
  <NyLayout mode="side" :nav="nav" :active-key="activeKey" content-max="2xl" @select="(item) => item.key && go(item.key)">
    <template #brand>
      <span class="sc-mark" />
      <span>喵の服务器</span>
    </template>

    <template #header-left>
      <span class="sc-title">{{ titles[page][0] }}<small>{{ titles[page][1] }}</small></span>
    </template>

    <template #header-right>
      <NyButton variant="text" icon="bell" icon-only aria-label="通知" />
      <NyAvatar text="橙" size="sm" />
    </template>

    <!-- 仪表盘 -->
    <div v-if="page === 'dashboard'" class="sc-page">
      <div class="sc-head">
        <div>
          <h1>下午好, 橙汁喵</h1>
          <p>4 个实例里 2 个正在运行, 1 个 3 天后到期。</p>
        </div>
        <div class="sc-actions">
          <NyButton icon="cart" @click="page = 'shop'">购买服务器</NyButton>
          <NyButton variant="solid" icon="server" @click="page = 'instances'">我的实例</NyButton>
        </div>
      </div>
      <NyAlert type="warning" title="ATM10 测试 3 天后到期" desc="到期后实例会停止, 数据保留 7 天。">
        <template #action><NyButton size="sm" @click="page = 'shop'">续费</NyButton></template>
      </NyAlert>
      <NyGrid :columns="2" :responsive="{ lg: 4 }">
        <NyMetricCard icon="users" label="在线玩家" value="15" unit="/ 40" :percent="38" foot="生存服 12 · 创造服 3" />
        <NyMetricCard icon="server" label="运行中实例" value="2" unit="/ 4" :percent="50" status="success" foot="1 个安装中" />
        <NyMetricCard icon="wallet" label="余额" value="¥86.50" foot="本月已消费 ¥113.50" />
        <NyMetricCard icon="mail" label="待回复工单" value="1" foot="#1042 服务器卡顿" />
      </NyGrid>
      <NyCard title="我的实例" padding="none">
        <template #actions><NyButton size="sm" variant="text" @click="page = 'instances'">全部</NyButton></template>
        <button v-for="item in instances" :key="item.name" type="button" class="sc-row" @click="open(item)">
          <span class="sc-icon" :class="`is-${item.state}`"><NyIcon :name="item.icon" /></span>
          <span class="sc-row__main"><b>{{ item.name }}</b><small>{{ item.ver }} · {{ item.node }}</small></span>
          <NyPill :type="stateInfo[item.state].type">{{ stateInfo[item.state].text }}</NyPill>
          <NyIcon name="chevron-right" :size="16" class="sc-muted" />
        </button>
      </NyCard>
    </div>

    <!-- 实例列表 -->
    <div v-else-if="page === 'instances'" class="sc-page">
      <div class="sc-head">
        <div>
          <h1>我的实例</h1>
          <p>管理你的游戏服务器, 查看运行状态与资源用量。</p>
        </div>
        <div class="sc-actions">
          <NyButton variant="solid" icon="plus" @click="page = 'shop'">创建实例</NyButton>
        </div>
      </div>
      <NyGrid columns="auto" :min-item-width="320">
        <NyCard v-for="item in instances" :key="item.name" hoverable class="sc-inst" @click="open(item)">
          <div class="sc-inst__head">
            <span class="sc-icon" :class="`is-${item.state}`"><NyIcon :name="item.icon" /></span>
            <span class="sc-row__main">
              <b>{{ item.name }} <NyPill :type="stateInfo[item.state].type">{{ stateInfo[item.state].text }}</NyPill></b>
              <small>{{ item.ver }} · {{ item.node }} · {{ item.exp }}</small>
            </span>
          </div>
          <NyGrid :columns="3" :gap="12">
            <NyMeter label="CPU" :used="item.cpu + '%'" total="4 核" :percent="item.cpu" stack />
            <NyMeter label="内存" :used="item.mem[0]" :total="item.mem[1] + ' GB'" :percent="(item.mem[0] / item.mem[1]) * 100" stack />
            <NyMeter label="磁盘" :used="item.disk[0]" :total="item.disk[1] + ' GB'" :percent="(item.disk[0] / item.disk[1]) * 100" stack />
          </NyGrid>
          <div class="sc-inst__foot">
            <span class="sc-muted">{{ item.online }}</span>
            <NyButton size="sm" :disabled="item.state === 'installing'" :icon="item.state === 'running' ? 'power' : 'play'" @click.stop="toggle(item)">
              {{ item.state === 'running' ? '关闭' : '开启' }}
            </NyButton>
            <NyButton size="sm" variant="solid" icon="terminal" @click.stop="open(item)">控制台</NyButton>
          </div>
        </NyCard>
      </NyGrid>
    </div>

    <!-- 实例详情 -->
    <div v-else-if="page === 'instance'" class="sc-page">
      <nav class="sc-crumb"><button type="button" @click="page = 'instances'">实例</button><NyIcon name="chevron-right" :size="14" /><span>{{ current.name }}</span></nav>
      <div class="sc-detail">
        <NyButton variant="text" icon="arrow-left" icon-only aria-label="返回" @click="page = 'instances'" />
        <span class="sc-icon sc-icon--lg" :class="`is-${current.state}`"><NyIcon :name="current.icon" :size="22" /></span>
        <div class="sc-detail__main">
          <h1>{{ current.name }} <NyPill :type="stateInfo[current.state].type">{{ stateInfo[current.state].text }}</NyPill></h1>
          <small>{{ current.ver }} · {{ current.node }} · {{ current.exp }}</small>
        </div>
        <div class="sc-actions">
          <NyButton icon="play" :disabled="current.state !== 'stopped'" @click="toggle(current)">开启</NyButton>
          <NyButton icon="refresh" :disabled="current.state !== 'running'" @click="nyMessage.success('已重启')">重启</NyButton>
          <NyButton icon="power" :disabled="current.state !== 'running'" @click="toggle(current)">关闭</NyButton>
          <NyButton variant="danger" icon="zap" @click="killOpen = true">强制结束</NyButton>
        </div>
      </div>
      <NyTabs v-model:active-key="tab" :items="tabs" />

      <div v-if="tab === 'terminal'" class="sc-term">
        <NyTerminal v-model:mode="mode" :lines="lines" height="max(440px, calc(100vh - 300px))" @command="run" @clear="lines = []" />
        <div class="sc-side">
          <NyCard>
            <template #title><span class="sc-card-title"><NyIcon name="globe" />连接地址</span></template>
            <NyCopyField value="mc.na-mc.cn:25565" />
          </NyCard>
          <NyMetricCard icon="gauge" label="TPS · MSPT" value="19.98" unit="TPS" :percent="99.9" status="success" foot="1 分钟 19.95 · MSPT 21 ms · p95 38 ms">
            <template #extra><NyPill type="success" :dot="false">流畅</NyPill></template>
          </NyMetricCard>
          <NyCard>
            <template #title><span class="sc-card-title"><NyIcon name="users" />在线玩家 <span class="sc-muted">12 / 20</span></span></template>
            <div class="sc-players">
              <div v-for="[name, ping] in players" :key="name" class="sc-players__row">
                <NyPlayerHead :name="name" />
                <span>{{ name }}</span>
                <span class="sc-muted">{{ ping }} ms</span>
              </div>
            </div>
          </NyCard>
          <NyCard>
            <template #title><span class="sc-card-title"><NyIcon name="activity" />资源</span></template>
            <div class="sc-meters">
              <NyMeter label="CPU" used="17%" total="400%" :percent="4" />
              <NyMeter label="内存" used="5.2" total="8 GB" :percent="65" />
              <NyMeter label="磁盘" used="22" total="40 GB" :percent="55" />
            </div>
          </NyCard>
        </div>
      </div>

      <div v-else-if="tab === 'files'" class="sc-two">
        <NyTable :columns="fileColumns" :data="files" row-key="name" selectable>
          <template #name="{ row }">
            <span class="sc-file"><NyIcon :name="row.dir ? 'folder' : 'file'" :class="{ 'sc-dir': row.dir }" />{{ row.name }}</span>
          </template>
        </NyTable>
        <NyCard>
          <template #title><span class="sc-card-title"><NyIcon name="key" />SFTP</span></template>
          <template #actions><NyButton size="sm" icon="refresh" @click="nyMessage.success('已重置 SFTP 密码')">重置密码</NyButton></template>
          <NyKeyValue :items="sftp" />
        </NyCard>
      </div>

      <div v-else-if="tab === 'backups'" class="sc-stack">
        <div class="sc-bar">
          <span class="sc-muted">自动备份: 每天 04:00 · 保留 7 份 · 存到百度网盘</span>
          <NyButton variant="solid" icon="archive" @click="nyMessage.success('已开始备份')">立即备份</NyButton>
        </div>
        <NyCard>
          <template #title><span class="sc-card-title"><NyIcon name="archive" />正在备份 world</span></template>
          <NyTaskSteps
            :steps="[
              { title: '打包 world', status: 'done', time: '0:41' },
              { title: '上传到百度网盘 1.4 / 2.3 GB', status: 'current', time: '约 50 秒' },
              { title: '清理 7 天前的备份', status: 'pending' },
            ]"
          />
        </NyCard>
        <NyTable :columns="backupColumns" :data="backups" row-key="time">
          <template #ops><NyButton size="sm" variant="text">恢复</NyButton></template>
        </NyTable>
      </div>

      <div v-else-if="tab === 'network'">
        <NyTable :columns="natColumns" :data="nat" row-key="addr">
          <template #addr="{ row }"><code class="sc-mono">{{ row.addr }}</code></template>
          <template #use="{ row }">
            <NyPill v-if="row.use === '游戏入口'" type="success" :dot="false">游戏入口</NyPill>
            <span v-else class="sc-muted">{{ row.use }}</span>
          </template>
        </NyTable>
      </div>

      <div v-else class="sc-form">
        <NyCard title="启动设置">
          <div class="sc-form__rows">
            <label class="sc-form__row"><span>Java 版本</span><NySegmented v-model="java" :options="[{ label: '17', value: '17' }, { label: '21', value: '21' }, { label: '23', value: '23' }]" /></label>
            <label class="sc-form__row"><span>JVM 参数</span><NyInput v-model="jvm" /></label>
            <label class="sc-form__row"><span>崩溃自动重启</span><NySwitch v-model:checked="autoRestart" /></label>
            <label class="sc-form__row"><span>游戏内状态上报</span><NySwitch v-model:checked="probe" /></label>
          </div>
          <template #footer><NyButton variant="solid" @click="nyMessage.success('已保存启动设置')">保存启动设置</NyButton></template>
        </NyCard>
      </div>
    </div>

    <!-- 购买 -->
    <div v-else class="sc-page">
      <div class="sc-head"><div><h1>购买服务器</h1><p>选好游戏和配置, 支付后一分钟内开服。</p></div></div>
      <section class="sc-stack">
        <b>服务端</b>
        <NyChoiceGroup v-model="server" :cols="3">
          <NyChoiceCard value="vanilla" icon="box" title="原版" description="官方服务端" />
          <NyChoiceCard value="paper" icon="layers" title="Paper" description="性能好, 支持插件" tag="推荐" />
          <NyChoiceCard value="pack" icon="package" title="整合包" description="一键安装" />
        </NyChoiceGroup>
        <b>节点</b>
        <NyChoiceGroup v-model="nodeChoice" :cols="2">
          <NyChoiceCard value="zz" icon="server" title="枣庄 BGP" description="5950X · 三网 BGP · 剩余 42 GB" />
          <NyChoiceCard value="sq" icon="server" title="宿迁电信" description="7950X · 电信优化 · 剩余 18 GB" />
        </NyChoiceGroup>
        <b>时长</b>
        <NyChoiceGroup v-model="months" :cols="4" :cols-sm="2">
          <NyChoiceCard v-for="[m, p] in [[1, 48], [3, 43], [6, 41], [12, 38]]" :key="m" :value="m" :tag="m === 3 ? '推荐' : undefined" :title="`${m} 个月`" :description="`¥${p} / 月`" />
        </NyChoiceGroup>
        <div class="sc-bar"><span class="sc-muted">合计 ¥{{ [48, 129, 246, 456][[1, 3, 6, 12].indexOf(months)] }}</span><NyButton variant="solid" @click="nyMessage.success('演示: 跳转支付')">下一步: 支付</NyButton></div>
      </section>
    </div>
  </NyLayout>

  <NyModal v-model:open="killOpen" title="强制结束 生存服?" :width="400" ok-text="强制结束" ok-variant="danger" @ok="toggle(current)">
    进程会被立即结束, 没保存的世界数据会丢失。只在 "关闭" 没反应时使用。
  </NyModal>
</template>

<style scoped lang="scss">
.sc-mark {
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: 8px;
  background: conic-gradient(from 180deg, var(--ny-sky) 0 50%, var(--ny-pink) 50% 100%);
}

.sc-crumb {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--ny-text-muted);

  button {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;

    &:hover {
      color: var(--ny-text);
    }
  }

  span {
    color: var(--ny-text);
    font-weight: 500;
  }
}

.sc-title {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  font-weight: 600;
  white-space: nowrap;

  small {
    font-size: 12px;
    font-weight: 400;
    color: var(--ny-text-muted);
  }
}

.sc-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  padding-bottom: 72px;
}

.sc-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  h1 {
    margin: 0;
    font-family: var(--ny-font-family-display);
    font-size: 34px;
    line-height: 42px;
    letter-spacing: -0.022em;
  }

  p {
    margin: 6px 0 0;
    color: var(--ny-text-sub);
  }
}

.sc-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sc-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 20px;
  border: 0;
  border-top: 1px solid var(--ny-line);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:first-child {
    border-top: 0;
  }

  &:hover {
    background: var(--ny-bg-soft);
  }
}

.sc-row__main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;

  b {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }

  small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--ny-text-muted);
    font-size: 12px;
  }
}

.sc-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--ny-fill);
  color: var(--ny-text-sub);

  &.is-running {
    background: var(--ny-success-soft);
    color: var(--ny-success-ink);
  }

  &.is-installing {
    background: var(--ny-primary-soft);
    color: var(--ny-primary-ink);
  }
}

.sc-icon--lg {
  width: 44px;
  height: 44px;
  border-radius: 12px;
}

.sc-muted {
  color: var(--ny-text-muted);
  font-weight: 400;
}

.sc-inst {
  cursor: pointer;

  :deep(.ny-card__body) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.sc-inst__head {
  display: flex;
  gap: 12px;
  align-items: center;
}

.sc-inst__foot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--ny-line);

  .sc-muted {
    flex: 1;
    font-size: 13px;
  }
}

.sc-detail {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  h1 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    font-family: var(--ny-font-family-display);
    font-size: 22px;
    line-height: 30px;
  }

  small {
    color: var(--ny-text-muted);
  }
}

.sc-detail__main {
  flex: 1 1 200px;
  min-width: 0;
}

.sc-term {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 16px;
  align-items: start;
}

.sc-side,
.sc-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.sc-two {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.sc-card-title {
  display: flex;
  align-items: center;
  gap: 8px;

  :deep(.ny-icon) {
    color: var(--ny-text-sub);
  }
}

.sc-players {
  max-height: 220px;
  overflow: auto;
}

.sc-players__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-top: 1px solid var(--ny-line);
  font-size: 13px;

  &:first-child {
    border-top: 0;
  }

  .sc-muted {
    margin-left: auto;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
}

.sc-meters {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.sc-file {
  display: flex;
  align-items: center;
  gap: 10px;

  :deep(.ny-icon) {
    color: var(--ny-text-muted);
  }

  :deep(.sc-dir) {
    color: var(--ny-primary-ink);
  }
}

.sc-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.sc-mono {
  font-family: var(--ny-font-family-mono);
}

.sc-form {
  max-width: 760px;
}

.sc-form__rows {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sc-form__row {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  align-items: center;
  gap: 16px;

  > span {
    font-size: 13px;
    font-weight: 500;
  }

  > :last-child {
    justify-self: start;
    max-width: 100%;
  }
}

@media (max-width: 1080px) {
  .sc-term,
  .sc-two {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .sc-head h1 {
    font-size: 28px;
    line-height: 36px;
  }

  .sc-form__row {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>
