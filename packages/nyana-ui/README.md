# Nyana UI

喵の服务器的 Vue 3 组件库。2.0 是平面风格: 白底 / 米白底, 1px 细线分层, 不用阴影, 一个高饱和喵蓝做强调色。

## 安装

```bash
npm i @chengzhimeow/nyana-ui
```

```ts
import { createApp } from 'vue'
import NyanaUI from '@chengzhimeow/nyana-ui'
import '@chengzhimeow/nyana-ui/style.css'

createApp(App).use(NyanaUI).mount('#app')
```

深浅色由 `<html data-theme="light | dark">` 决定, 不设置时跟随系统。

## 从 1.x 升级到 2.0

组件的 props 名称、事件、插槽都没有变, 升级后不改代码也能运行; 变的是外观、设计令牌的值和少数默认值。

- **设计令牌**: 1.x 的 `--ny-*` 变量名全部保留, 值换成 2.0 的设计。
  - `--ny-bg` 和 `--ny-surface` 都是纯白, 分组用新增的 `--ny-bg-soft` (米白), 填充用 `--ny-fill` / `--ny-fill-strong`。
  - `--ny-primary` 是实心底色; 放文字时用新增的 `--ny-primary-ink` (`--ny-primary-text` / `--ny-primary-strong` 已指向它)。状态色同理: `--ny-success` 是填充色, 文字用 `--ny-success-ink`。
  - `--ny-shadow-xs` / `--ny-shadow-sm` 变成 `none`; `--ny-shadow-md` / `--ny-shadow-lg` 变成 1px 描边。自己的样式里如果靠投影区分层级, 换成 `border: 1px solid var(--ny-border)`。
- **尺寸**: 控件高度 30 / 34 / 42px, 圆角 4 / 6 / 8 / 12 / 16px。
- **按钮**: `primary` 和 `solid` 都是实心喵蓝; `secondary` 是描边按钮; `text` 是链接样式; `danger` 在页面里是浅红软按钮, 对话框与气泡确认里的确认按钮是实心红。
- **布局**: `NyLayout` 默认侧边栏 240px、顶栏 56px、`breakpoint` 641px; 641–900px 侧边栏收成 64px 图标栏, 640px 以下收进抽屉。`NyContainer` 的 `xl` 是 1320px (1680px 以上 1600px, 2200px 以上 1920px)。
- **网格**: `NyGrid` 固定列数且没传 `responsive` 时, 640px 以下变成一列。
- **步骤条**: 横向默认是顶部细进度条 + "第 N 步" + 标题; `progressDot` 是带序号的圆点连线。
- **卡片**: `raised` 变成米白底无边框; `hoverable` 悬停只加深边框。
- **换行**: 界面元素 (按钮、标签、表头、表格单元格、菜单、3–5 级标题) 默认单行加省略号, 只有正文与说明换行。

## 2.0 新组件

| 组件 | 用途 |
| --- | --- |
| `NyMetricCard` | 指标卡: 图标标签、大数值、细进度条与说明; 只有带上限的数值才传 `percent` |
| `NyMeter` | 资源条: 标签、用量 / 总量与 4px 进度条, 超阈值变色 |
| `NyPill` | 状态胶囊: 圆点 + 文字 |
| `NyCopyButton` / `NyCopyField` / `nyCopy()` | 复制按钮、大号复制框与复制函数 |
| `NyKeyValue` | 凭据列表: 细线框键值行, 可复制、可打码 |
| `NyPlayerHead` | 玩家皮肤头像, 没有头像地址时用像素占位 |
| `NyChoiceGroup` / `NyChoiceCard` | 选择卡: 服务端、套餐、支付方式 |
| `NyTerminal` | 终端外壳: 真终端 / 伪终端切换、按级别着色、命令历史 |
| `NyCommandBlock` | 一键复制的命令行, 多种写法可切换 |
| `NyTaskSteps` | 后台任务的分步清单 |

完整示例 (全部组件 + 控制台、论坛、官网三个场景) 见仓库里的 `example`。
