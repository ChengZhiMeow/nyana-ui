# Nyana UI

喵の服务器的 Vue 3 组件库, 平面风格。用法与升级说明见 [packages/nyana-ui/README.md](packages/nyana-ui/README.md)。

```bash
npm i @chengzhimeow/nyana-ui
```

## 仓库结构

| 目录 | 内容 |
| --- | --- |
| `packages/nyana-ui` | 组件库本体 |
| `packages/nyana-ui/src/components/<组件>/` | 每个组件一个目录: `Ny*.vue` 组件、`style.scss` 样式 (全局 BEM, 不用 scoped)、`index.ts` 入口 (带 `install`) |
| `packages/nyana-ui/src/styles/` | 设计令牌 (`theme.scss`)、基础样式, `index.scss` 汇总全部组件样式 |
| `packages/nyana-ui/tests/` | Vitest 单元测试 |
| `site` | VitePress 文档站: 全部组件的文档与演示, 以及控制台、论坛、官网三个场景 |
| `.changeset` | 版本与更新日志 |

## 开发

```bash
npm install
npm run dev          # 文档站, 直接引用组件库源码
npm test             # 单元测试
npm run typecheck    # 组件库与文档站的类型检查
npm run build        # 构建组件库与文档站
```

新增组件: 在 `src/components/<组件>/` 下放组件、`style.scss` 与 `index.ts`, 在 `src/index.ts` 里注册, 在 `src/styles/components.scss` 里引入样式, 在 `site/src/docs/registry.ts` 里登记文档页并运行一次文档页生成。

## 发版

```bash
npx changeset          # 写一条变更说明, 选择 patch / minor / major
npm run version-packages   # 按变更说明更新版本号与 CHANGELOG
npm run release        # 构建并发布到 npm
```

构建产物 (`dist/`):

- `index.js` 与按目录输出的 ES 模块, 可摇树
- `style.css` 全部样式; 按需引入时用 `core.css` + `components/<组件>/style.css`
- `types/` 类型声明
