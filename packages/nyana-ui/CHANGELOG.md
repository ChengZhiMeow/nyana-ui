# @chengzhimeow/nyana-ui

## 2.0.0

### Major Changes

- b5be128: 2.0 平面风格改版与标准组件库结构

  - 全新设计令牌: 白底 / 米白底、1px 细线分层、不用阴影、高饱和喵蓝强调色; 1.x 的 `--ny-*` 变量名全部保留, 新增 `--ny-fill`、`--ny-line`、`--ny-*-ink` 等
  - 全部组件按 2.0 设计重做外观, props / 事件 / 插槽不变
  - 组件按目录组织, 每个组件都能 `app.use()` 按需安装; ES 模块按目录输出, 可摇树
  - 样式改为全局 BEM 样式: 完整 `style.css`, 以及 `core.css` + `components/<组件>/style.css` 按需引入
  - 新组件: MetricCard、Meter、Pill、CopyButton、CopyField、KeyValue、PlayerHead、ChoiceGroup / ChoiceCard、Terminal、CommandBlock、TaskSteps
  - 布局: NyLayout 默认 240px 侧边栏、56px 顶栏, 平板收成图标栏、手机收进抽屉; 宽屏内容区自动加宽
  - 换行规则: 界面元素单行加省略号, 只有正文与说明换行
