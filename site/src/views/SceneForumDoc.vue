<script setup lang="ts">
import { ref } from 'vue'

import {
  NyAvatar,
  NyButton,
  NyCard,
  NyIcon,
  NyInput,
  NyLayout,
  NyPagination,
  NyPill,
  NyTabs,
  NyTag,
  NyTextarea,
  nyMessage,
  type NyNavGroup,
} from '@chengzhimeow/nyana-ui'

const view = ref<'list' | 'topic'>('list')
const nav: NyNavGroup[] = [{ items: [{ key: 'home', label: '首页' }, { key: 'forum', label: '论坛', active: true }, { key: 'docs', label: '文档' }] }]

const cats = [
  ['all', '全部', 'list', 0],
  ['notice', '公告', 'megaphone', 12],
  ['help', '求助', 'info', 348],
  ['share', '分享', 'sparkles', 216],
  ['plugin', '插件与模组', 'package', 189],
  ['trade', '交易', 'cart', 41],
] as const
const cat = ref('all')
const sort = ref('reply')
const keyword = ref('')
const page = ref(1)

const catTag: Record<string, { label: string; status: 'warning' | 'primary' | 'danger' | 'default' | 'success' }> = {
  notice: { label: '公告', status: 'warning' },
  help: { label: '求助', status: 'primary' },
  share: { label: '分享', status: 'danger' },
  plugin: { label: '插件与模组', status: 'success' },
  trade: { label: '交易', status: 'default' },
}

const topics = [
  { cat: 'notice', title: '11 月 27 日 节点维护通知', user: '橙汁喵', role: '管理员', replies: 3, views: 128, time: '10 分钟前', pinned: true },
  { cat: 'help', title: '1.21.1 Paper 开服后 TPS 一直 15 左右, 怎么排查?', user: 'Steve', replies: 14, views: 302, time: '32 分钟前' },
  { cat: 'share', title: '分享一个生存服用的轻量插件组合 (附配置)', user: '小鱼干', role: '版主', replies: 27, views: 1204, time: '1 小时前' },
  { cat: 'plugin', title: 'ATM10 在 8 GB 内存下能流畅跑多少人?', user: 'Alex', replies: 9, views: 210, time: '3 小时前' },
  { cat: 'help', title: 'SFTP 用 FileZilla 连不上, 提示 "Connection refused"', user: 'Kimi', replies: 6, views: 98, time: '5 小时前' },
  { cat: 'share', title: '我们服的主城建好了, 欢迎来参观', user: 'Grian', replies: 41, views: 2311, time: '昨天' },
]

const posts = [
  { user: 'Steve', time: '今天 11:20', likes: 3, body: ['服务器 8 GB 内存, 20 人左右在线, TPS 一直在 15 上下, 偶尔掉到 12。已经把视距从 16 调到 10 了, 没有明显改善。', '请问应该先看哪里?'] },
  { user: '小鱼干', role: '版主', time: '今天 11:42', likes: 12, body: ['先装 spark 跑 /spark profiler --timeout 120, 看是实体、区块加载还是红石占时间。控制台里的 TPS · MSPT 卡片看 p95, 如果 p95 远高于平均值, 一般是某个周期性任务卡住了。'] },
  { user: '橙汁喵', role: '管理员', time: '今天 12:05', likes: 7, body: ['补充一下: 面板 "启动设置" 里可以把 JVM 参数换成 Aikar flags, 8 GB 建议 -Xms6G -Xmx6G, 留 2 GB 给系统。'] },
]
const liked = ref<Record<number, boolean>>({})
const reply = ref('')
</script>

<template>
  <NyLayout mode="top" :nav="nav" active-key="forum" content-max="xl">
    <template #brand>
      <span class="fo-mark" />
      <span>喵の服务器</span>
    </template>
    <template #header-right>
      <NyButton variant="text">登录</NyButton>
      <NyButton variant="solid">进入控制台</NyButton>
    </template>

    <div v-if="view === 'list'" class="fo-page">
      <div class="fo-hero">
        <div>
          <h1>社区</h1>
          <p>开服经验、插件推荐、求助答疑, 都在这里。</p>
        </div>
        <div class="fo-hero__actions">
          <NyInput v-model="keyword" placeholder="搜索帖子" clearable class="fo-search"><template #prefix><NyIcon name="search" :size="16" /></template></NyInput>
          <NyButton variant="solid" icon="edit" @click="nyMessage.info('演示: 打开发帖')">发帖</NyButton>
        </div>
      </div>

      <div class="fo-body">
        <nav class="fo-cats">
          <button v-for="[key, label, icon, count] in cats" :key="key" type="button" class="fo-cat" :class="{ 'is-active': cat === key }" @click="cat = key">
            <NyIcon :name="icon" />
            <span>{{ label }}</span>
            <small v-if="count">{{ count }}</small>
          </button>
        </nav>

        <div class="fo-main">
          <NyTabs
            v-model:active-key="sort"
            type="pill"
            :items="[
              { key: 'reply', label: '最新回复' },
              { key: 'new', label: '最新发布' },
              { key: 'hot', label: '热门' },
            ]"
          />
          <NyCard padding="none">
            <button v-for="item in topics" :key="item.title" type="button" class="fo-topic" @click="view = 'topic'">
              <NyAvatar :text="item.user[0]" />
              <span class="fo-topic__main">
                <span class="fo-topic__title"><NyPill v-if="item.pinned" type="warning" :dot="false">置顶</NyPill>{{ item.title }}</span>
                <span class="fo-topic__meta">
                  <NyTag size="sm" :status="catTag[item.cat]!.status">{{ catTag[item.cat]!.label }}</NyTag>
                  <span>{{ item.user }}</span>
                  <NyTag v-if="item.role" size="sm" variant="solid">{{ item.role }}</NyTag>
                  <span>· {{ item.time }}</span>
                </span>
              </span>
              <span class="fo-topic__stats">
                <span><NyIcon name="mail" :size="14" />{{ item.replies }}</span>
                <span class="fo-hide-sm"><NyIcon name="eye" :size="14" />{{ item.views.toLocaleString() }}</span>
              </span>
            </button>
          </NyCard>
          <NyPagination v-model:page="page" :total="806" :page-size="7" />
        </div>
      </div>
    </div>

    <div v-else class="fo-page fo-topic-page">
      <div class="fo-crumb">
        <button type="button" @click="view = 'list'">社区</button>
        <NyIcon name="chevron-right" :size="14" />
        <span>求助</span>
      </div>
      <h1 class="fo-topic-title">1.21.1 Paper 开服后 TPS 一直 15 左右, 怎么排查?</h1>
      <div class="fo-topic__meta"><NyTag size="sm" status="primary">求助</NyTag><span>Steve 发布于 今天 11:20 · 14 回复 · 302 浏览</span></div>

      <NyCard padding="none">
        <article v-for="(post, index) in posts" :key="index" class="fo-post">
          <NyAvatar :text="post.user[0]" />
          <div class="fo-post__body">
            <div class="fo-post__meta">
              <b>{{ post.user }}</b>
              <NyTag v-if="post.role" size="sm" variant="solid">{{ post.role }}</NyTag>
              <span>{{ post.time }}</span>
              <span class="fo-post__floor">#{{ index + 1 }}</span>
            </div>
            <p v-for="(text, i) in post.body" :key="i">{{ text }}</p>
            <div class="fo-post__actions">
              <NyButton size="sm" variant="text" icon="heart" :class="{ 'is-liked': liked[index] }" @click="liked[index] = !liked[index]">
                {{ post.likes + (liked[index] ? 1 : 0) }}
              </NyButton>
              <NyButton size="sm" variant="text" icon="mail">回复</NyButton>
            </div>
          </div>
        </article>
      </NyCard>

      <NyCard title="回复这个帖子">
        <NyTextarea v-model="reply" :rows="3" placeholder="写下你的回复, 支持 Markdown" />
        <template #footer>
          <NyButton variant="solid" @click="(reply = ''), nyMessage.success('已发布')">发布回复</NyButton>
        </template>
      </NyCard>
    </div>
  </NyLayout>
</template>

<style scoped lang="scss">
.fo-mark {
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: 8px;
  background: conic-gradient(from 180deg, var(--ny-sky) 0 50%, var(--ny-pink) 50% 100%);
}

.fo-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  padding-bottom: 72px;
}

.fo-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--ny-line);

  h1 {
    margin: 0;
    font-family: var(--ny-font-family-display);
    font-size: 34px;
    line-height: 42px;
  }

  p {
    margin: 6px 0 0;
    color: var(--ny-text-sub);
  }
}

.fo-hero__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.fo-search {
  width: 260px;
  max-width: 100%;
}

.fo-body {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.fo-cats {
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: sticky;
  top: 72px;
}

.fo-cat {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 36px;
  padding: 0 10px;
  border: 0;
  border-radius: var(--ny-radius-md);
  background: transparent;
  color: var(--ny-text);
  font: inherit;
  white-space: nowrap;
  cursor: pointer;

  :deep(.ny-icon) {
    color: var(--ny-text-sub);
  }

  small {
    margin-left: auto;
    color: var(--ny-text-muted);
    font-size: 12px;
  }

  &:hover,
  &.is-active {
    background: var(--ny-fill);
  }

  &.is-active {
    font-weight: 500;
  }
}

.fo-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.fo-topic {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 20px;
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

.fo-topic__main {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.fo-topic__title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-weight: 500;
  line-height: 22px;

  :deep(.ny-pill) {
    margin-right: 6px;
    vertical-align: 1px;
  }
}

.fo-topic__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  color: var(--ny-text-muted);
  font-size: 12px;
  white-space: nowrap;
}

.fo-topic__stats {
  display: flex;
  gap: 14px;
  flex: none;
  color: var(--ny-text-muted);
  font-size: 13px;
  font-variant-numeric: tabular-nums;

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}

.fo-topic-page {
  max-width: 860px;
}

.fo-crumb {
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
  }
}

.fo-topic-title {
  margin: 0;
  font-family: var(--ny-font-family-display);
  font-size: 24px;
  line-height: 32px;
  text-wrap: balance;
}

.fo-post {
  display: flex;
  gap: 14px;
  padding: 20px;
  border-top: 1px solid var(--ny-line);

  &:first-child {
    border-top: 0;
  }

  p {
    margin: 0;
    max-width: 72ch;
    line-height: 1.75;
  }
}

.fo-post__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.fo-post__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ny-text-muted);
  font-size: 13px;
  white-space: nowrap;

  b {
    color: var(--ny-text);
  }
}

.fo-post__floor {
  margin-left: auto;
}

.fo-post__actions {
  display: flex;
  gap: 2px;
  margin-left: -8px;

  :deep(.is-liked) {
    color: var(--ny-secondary-ink);
  }
}

@media (max-width: 900px) {
  .fo-body {
    grid-template-columns: minmax(0, 1fr);
  }

  .fo-cats {
    position: static;
    flex-direction: row;
    overflow-x: auto;
  }

  .fo-cat small {
    display: none;
  }
}

@media (max-width: 640px) {
  .fo-topic {
    padding: 12px 14px;
    align-items: flex-start;
  }

  .fo-hide-sm {
    display: none !important;
  }
}
</style>
