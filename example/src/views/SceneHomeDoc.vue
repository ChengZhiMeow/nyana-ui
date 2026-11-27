<script setup lang="ts">
import {
  NyButton,
  NyCard,
  NyCollapse,
  NyCollapseItem,
  NyGrid,
  NyIcon,
  NyLayout,
  NyMetricCard,
  NyPill,
  NyTag,
  type NyNavGroup,
} from '@chengzhimeow/nyana-ui'

const nav: NyNavGroup[] = [{ items: [{ key: 'home', label: '首页', active: true }, { key: 'pricing', label: '价格' }, { key: 'forum', label: '论坛' }, { key: 'docs', label: '文档' }] }]

const features = [
  ['rocket', '一键安装', '服务端、整合包、插件都能一键装, 版本更新自动提醒。'],
  ['archive', '自动备份', '每天定时备份到网盘, 出问题一键恢复到任意一天。'],
  ['terminal', '网页控制台', '真终端和伪终端随意切换, 手机上也能输命令。'],
  ['gauge', '实时 TPS', '游戏内 TPS、MSPT、在线玩家实时显示, 卡顿一眼看到。'],
  ['key', 'SFTP 与数据库', '用熟悉的工具管理文件, 插件需要的 MySQL 一键创建。'],
  ['users', '子账号', '给朋友分配权限, 能开服但不能删档。'],
] as const

const plans = [
  { name: '入门', mem: '4 GB', price: 24, desc: '5–10 人原版或轻插件', list: ['2 核 CPU', '20 GB 磁盘', '每日备份'] },
  { name: '标准', mem: '8 GB', price: 48, desc: '20 人插件服或中型整合包', list: ['4 核 CPU', '40 GB 磁盘', '每日备份', '1 个数据库'], featured: true },
  { name: '进阶', mem: '16 GB', price: 96, desc: '大型整合包或 50 人以上', list: ['8 核 CPU', '80 GB 磁盘', '每小时备份', '2 个数据库'] },
]
</script>

<template>
  <NyLayout mode="top" :nav="nav" active-key="home" content-max="full" :content-padding="false">
    <template #brand>
      <span class="hm-mark" />
      <span>喵の服务器</span>
    </template>
    <template #header-right>
      <NyButton variant="text">登录</NyButton>
      <NyButton variant="solid">进入控制台</NyButton>
    </template>

    <section class="hm-hero">
      <div class="hm-inner hm-hero__grid">
        <div class="hm-hero__text">
          <NyPill type="primary" :dot="false">新用户首月 5 折</NyPill>
          <h1>一分钟开一台<br />自己的游戏服务器</h1>
          <p>Minecraft、泰拉瑞亚、幻兽帕鲁。选好游戏和配置, 支付后自动安装、自动备份, 在浏览器里管理一切。</p>
          <div class="hm-row">
            <NyButton variant="solid" size="lg">开始开服</NyButton>
            <NyButton size="lg">看看控制台</NyButton>
          </div>
          <div class="hm-row hm-checks">
            <span><NyIcon name="check" :size="16" />三网 BGP</span>
            <span><NyIcon name="check" :size="16" />每日备份</span>
            <span><NyIcon name="check" :size="16" />7×24 工单</span>
          </div>
        </div>
        <div class="hm-art" aria-hidden="true">
          <span class="hm-art__slab" />
          <span class="hm-art__sky" />
          <span class="hm-art__pink" />
          <NyMetricCard class="hm-art__card" icon="gauge" label="生存服 · TPS" value="19.98" unit="TPS" :percent="99" status="success" foot="12 人在线 · 内存 5.2 / 8 GB" />
        </div>
      </div>
    </section>

    <section class="hm-section">
      <div class="hm-inner">
        <div class="hm-center">
          <h2>开服要做的事, 我们都做好了</h2>
          <p>你只需要和朋友一起玩。</p>
        </div>
        <NyGrid :columns="1" :responsive="{ sm: 2, lg: 3 }">
          <div v-for="[icon, title, desc] in features" :key="title" class="hm-feature">
            <span class="hm-feature__icon"><NyIcon :name="icon" /></span>
            <b>{{ title }}</b>
            <p>{{ desc }}</p>
          </div>
        </NyGrid>
      </div>
    </section>

    <section class="hm-section hm-section--soft">
      <div class="hm-inner">
        <div class="hm-center">
          <h2>价格</h2>
          <p>按月付, 随时升级配置。</p>
        </div>
        <NyGrid :columns="1" :responsive="{ lg: 3 }">
          <NyCard v-for="plan in plans" :key="plan.name" :class="{ 'hm-plan--featured': plan.featured }">
            <div class="hm-plan">
              <NyTag v-if="plan.featured" variant="solid" size="sm" class="hm-plan__tag">最受欢迎</NyTag>
              <b>{{ plan.name }} · {{ plan.mem }}</b>
              <span class="hm-muted">{{ plan.desc }}</span>
              <span class="hm-price">¥{{ plan.price }}<small>/月</small></span>
              <span v-for="item in plan.list" :key="item" class="hm-plan__item"><NyIcon name="check" :size="16" />{{ item }}</span>
              <NyButton :variant="plan.featured ? 'solid' : 'default'" block>选择{{ plan.name }}</NyButton>
            </div>
          </NyCard>
        </NyGrid>
      </div>
    </section>

    <section class="hm-section">
      <div class="hm-inner hm-faq">
        <h2 class="hm-center">常见问题</h2>
        <NyCollapse :active-keys="['pack']">
          <NyCollapseItem item-key="pack" title="可以自己上传整合包吗?">可以, 支持 .zip 和 .mrpack, 上传后在 "插件与模组" 页一键安装。</NyCollapseItem>
          <NyCollapseItem item-key="keep" title="到期后数据会保留多久?">保留 7 天, 期间续费可以直接恢复。</NyCollapseItem>
          <NyCollapseItem item-key="node" title="可以换节点吗?">可以, 提交工单, 我们会在不丢档的情况下帮你迁移。</NyCollapseItem>
        </NyCollapse>
      </div>
    </section>

    <footer class="hm-footer">
      <div class="hm-inner hm-row hm-footer__row">
        <span class="hm-row"><span class="hm-mark" /><b>喵の服务器</b></span>
        <span class="hm-muted">© 2026 喵の服务器 · 服务条款 · 隐私政策</span>
      </div>
    </footer>
  </NyLayout>
</template>

<style scoped lang="scss">
.hm-mark {
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: 8px;
  background: conic-gradient(from 180deg, var(--ny-sky) 0 50%, var(--ny-pink) 50% 100%);
}

.hm-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 max(24px, env(safe-area-inset-left, 0px));
}

.hm-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.hm-muted {
  color: var(--ny-text-muted);
  font-size: 13px;
}

.hm-hero {
  padding: 72px 0 80px;
  overflow: hidden;
}

.hm-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 48px;
  align-items: center;
}

.hm-hero__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  max-width: 560px;

  h1 {
    margin: 0;
    font-family: var(--ny-font-family-display);
    font-size: 56px;
    line-height: 60px;
    font-weight: 600;
    letter-spacing: -0.03em;
  }

  p {
    margin: 0;
    color: var(--ny-text-sub);
    font-size: 16px;
    line-height: 26px;
  }
}

.hm-checks {
  gap: 16px;
  color: var(--ny-text-muted);
  font-size: 13px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
}

.hm-art {
  position: relative;
  aspect-ratio: 1 / 0.85;
  max-width: 100%;
}

.hm-art__slab {
  position: absolute;
  right: 0;
  top: 0;
  width: 62%;
  height: 70%;
  border-radius: var(--ny-radius-xl);
  background: var(--ny-text);
}

.hm-art__sky {
  position: absolute;
  left: 6%;
  bottom: 4%;
  width: 46%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--ny-sky);
}

.hm-art__pink {
  position: absolute;
  right: 8%;
  bottom: 0;
  width: 26%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--ny-pink);
}

.hm-art__card {
  position: absolute;
  left: 18%;
  top: 22%;
  width: 58%;
  min-width: 220px;
}

.hm-section {
  padding: 80px 0;

  .hm-inner {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
}

.hm-section--soft {
  background: var(--ny-bg-soft);
}

.hm-center {
  text-align: center;

  h2,
  & {
    margin: 0;
    font-family: var(--ny-font-family-display);
    font-size: 34px;
    line-height: 42px;
    letter-spacing: -0.022em;
  }

  p {
    margin: 8px 0 0;
    font-family: var(--ny-font-family);
    font-size: 16px;
    line-height: 26px;
    letter-spacing: 0;
    color: var(--ny-text-sub);
  }
}

.hm-feature {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  border: 1px solid var(--ny-line);
  border-radius: var(--ny-radius-lg);

  b {
    font-size: 16px;
  }

  p {
    margin: 0;
    color: var(--ny-text-sub);
  }
}

.hm-feature__icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: 4px;
  border-radius: 10px;
  background: var(--ny-primary-soft);
  color: var(--ny-primary-ink);
}

.hm-plan {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;

  b {
    font-size: 17px;
  }
}

.hm-plan__tag {
  align-self: flex-start;
}

.hm-plan--featured {
  border-color: var(--ny-text) !important;
  box-shadow: inset 0 0 0 1px var(--ny-text);
}

.hm-price {
  font-family: var(--ny-font-family-display);
  font-size: 36px;
  line-height: 44px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;

  small {
    font-size: 15px;
    font-weight: 400;
    color: var(--ny-text-muted);
  }
}

.hm-plan__item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ny-text-sub);

  :deep(.ny-icon) {
    color: var(--ny-success);
  }
}

.hm-faq {
  max-width: 760px !important;
}

.hm-footer {
  padding: 32px 0 88px;
  border-top: 1px solid var(--ny-line);
}

.hm-footer__row {
  justify-content: space-between;
}

@media (max-width: 900px) {
  .hm-hero__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .hm-art {
    max-width: 480px;
  }
}

@media (max-width: 640px) {
  .hm-hero {
    padding: 40px 0 48px;
  }

  .hm-hero__text h1 {
    font-size: 36px;
    line-height: 42px;
  }

  .hm-section {
    padding: 48px 0;
  }

  .hm-center,
  .hm-center h2 {
    font-size: 28px;
    line-height: 36px;
  }
}
</style>
