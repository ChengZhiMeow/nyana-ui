
import { defineComponent, h, markRaw, ref, type Component, type CSSProperties, type VNode } from 'vue'

import {
  nyMessage,
  nyNotification,
  NyAffix,
  NyAlert,
  NyAnchor,
  NyAutoComplete,
  NyAvatar,
  NyAvatarCropper,
  NyAvatarGroup,
  NyBackTop,
  NyBadge,
  NyBreadcrumb,
  NyButton,
  NyCalendar,
  NyCard,
  NyCarousel,
  NyCascader,
  NyCheckbox,
  NyCheckboxGroup,
  NyCollapse,
  NyCollapseItem,
  NyColorPicker,
  NyContainer,
  NyDatePicker,
  NyDescriptions,
  NyDivider,
  NyDrawer,
  NyDropdown,
  NyEmpty,
  NyField,
  NyFlex,
  NyFloatButton,
  NyForm,
  NyFormItem,
  NyGrid,
  NyGridItem,
  NyIcon,
  NyImage,
  NyInput,
  NyInputShell,
  NyLayout,
  NyList,
  NyMasonry,
  NyMentions,
  NyModal,
  NyNumberInput,
  NyPageHeader,
  NyPagination,
  NyParagraph,
  NyPopconfirm,
  NyPopover,
  NyProgress,
  NyRadio,
  NyRadioGroup,
  NyRate,
  NyRegexInput,
  NyResult,
  NyRow,
  NySegmented,
  NySelect,
  NySkeleton,
  NySlider,
  NySpace,
  NySpin,
  NySplit,
  NyStack,
  NyStatistic,
  NySteps,
  NySwitch,
  NyTable,
  NyTabs,
  NyTag,
  NyTagInput,
  NyText,
  NyTextarea,
  NyThemeToggle,
  NyTimePicker,
  NyTimeline,
  NyTitle,
  NyTooltip,
  NyTransfer,
  NyTree,
  NyUpload,
  NyUserCard,
  NyWatermark,
  nyPaletteColor,
} from '@chengzhimeow/nyana-ui'

function stage(render: () => VNode): Component {
  return markRaw(() => h('div', { style: { width: '100%' } }, render()))
}

function bar(width: string, extra: CSSProperties = {}): VNode {
  return h('span', {
    style: {
      display: 'block',
      width,
      height: '18px',
      borderRadius: '5px',
      background: 'var(--ny-primary-soft)',
      ...extra,
    },
  })
}

function bars(widths: string[]): VNode[] {
  return widths.map((width) => bar(width))
}

function interactive(render: (open: { value: boolean }) => VNode): Component {
  return markRaw(
    defineComponent({
      setup() {
        const open = ref(false)

        return () => h('div', { style: { width: '100%' } }, render(open))
      },
    }),
  )
}

function iconStage(icon: string, text: string): Component {
  return stage(() =>
    h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          minHeight: '88px',
          color: 'var(--ny-primary-text)',
        },
      },
      [h(NyIcon, { name: icon, size: 30 }), h(NyText, { size: 'xs', type: 'muted' }, text)],
    ),
  )
}

export const componentPreviews: Record<string, Component> = {
  NyButton: stage(() =>
    h(NySpace, { size: 'sm' }, [
      h(NyButton, { size: 'sm', variant: 'primary' }, '主要'),
      h(NyButton, { size: 'sm' }, '默认'),
      h(NyButton, { size: 'sm', variant: 'text' }, '文字'),
    ]),
  ),
  NyIcon: stage(() =>
    h(
      NySpace,
      { size: 'sm' },
      ['star', 'check', 'bell', 'user'].map((name) => h(NyIcon, { key: name, name, size: 20 })),
    ),
  ),
  NyTypography: stage(() =>
    h(NyStack, { gap: 4 }, [
      h(NyTitle, { level: 3 }, '标题 Title'),
      h(NyText, { size: 'sm', type: 'muted' }, '正文与语义色'),
    ]),
  ),
  NyDivider: stage(() => h(NyDivider, { spacing: 6 }, '文字分隔')),
  NyFloatButton: stage(() =>
    h(NySpace, { size: 'sm' }, [
      h(NyFloatButton, { icon: 'arrow-up', tooltip: '回到顶部' }),
      h(NyFloatButton, { icon: 'plus', variant: 'primary' }),
    ]),
  ),
  NyThemeToggle: stage(() =>
    h(NySpace, { size: 'sm' }, [
      h(NyThemeToggle, { mode: 'light', variant: 'switch' }),
      h(NyThemeToggle, { mode: 'dark', variant: 'button', size: 'sm' }),
    ]),
  ),

  NySpace: stage(() => h(NySpace, { size: 10 }, bars(['28px', '28px', '28px']))),
  NyFlex: stage(() => h(NyFlex, { gap: 8 }, [bar('24px'), bar('24px', { flex: '1' }), bar('24px')])),
  NyRow: stage(() =>
    h(NyRow, { gap: 8 }, [
      h(NyButton, { size: 'sm' }, '取消'),
      h(NyButton, { size: 'sm', variant: 'primary' }, '保存'),
    ]),
  ),
  NyStack: stage(() => h(NyStack, { gap: 8 }, bars(['100%', '100%']))),
  NyGrid: stage(() => h(NyGrid, { columns: 3, gap: 6 }, bars(['100%', '100%', '100%', '100%', '100%', '100%']))),
  NyCard: stage(() => h(NyCard, { padding: 'sm' }, '卡片内容')),

  NyBreadcrumb: stage(() =>
    h(NyBreadcrumb, { items: [{ label: '首页' }, { label: '组件' }, { label: '总览' }] }),
  ),
  NySteps: stage(() =>
    h(NySteps, {
      items: [{ title: '填写' }, { title: '校验' }, { title: '完成' }],
      current: 1,
      size: 'sm',
    }),
  ),
  NyPagination: stage(() => h(NyPagination, { total: 66, size: 'sm', simple: true, showTotal: false })),
  NySegmented: stage(() =>
    h(NySegmented, {
      options: [
        { label: '日', value: 'day' },
        { label: '周', value: 'week' },
        { label: '月', value: 'month' },
      ],
      modelValue: 'week',
    }),
  ),

  NyTag: stage(() =>
    h(NySpace, { size: 'sm' }, [
      h(NyTag, { status: 'primary' }, '默认'),
      h(NyTag, { status: 'success' }, '成功'),
      h(NyTag, { status: 'warning', variant: 'outline' }, '警告'),
    ]),
  ),
  NyBadge: stage(() =>
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } }, [
      h(NyBadge, { count: 8 }),
      h(NyBadge, { status: 'success', text: '在线' }),
    ]),
  ),
  NyAvatar: stage(() =>
    h(NySpace, { size: 'sm' }, [h(NyAvatar, { text: '喵' }), h(NyAvatar, { icon: 'user' })]),
  ),
  NyStatistic: stage(() => h(NyStatistic, { title: '总访问', value: 12864, suffix: '次', size: 'sm' })),
  NySkeleton: stage(() => h(NySkeleton, { rows: 2, title: false, active: true })),
  NyCarousel: stage(() =>
    h(
      NyCarousel,
      { height: 64, autoplay: false, arrows: false },
      {
        default: () => [
          h('div', { style: { height: '100%', background: 'var(--ny-primary-soft)' } }),
          h('div', { style: { height: '100%', background: 'var(--ny-secondary-soft)' } }),
          h('div', { style: { height: '100%', background: 'var(--ny-accent-soft)' } }),
        ],
      },
    ),
  ),
  NyTree: stage(() =>
    h(NyTree, {
      data: [
        {
          key: 'src',
          title: 'src',
          children: [{ key: 'components', title: 'components', children: [{ key: 'button', title: 'Button.vue' }] }],
        },
      ],
      defaultExpandAll: true,
    }),
  ),
  NyWatermark: stage(() =>
    h(
      NyWatermark,
      { content: 'Nyana UI', gap: [70, 40], fontSize: 11, rotate: -20 },
      { default: () => h('div', { style: { padding: '8px' } }, '水印覆盖的内容') },
    ),
  ),
  NyCollapse: stage(() =>
    h(
      NyCollapse,
      { activeKeys: ['a'] },
      {
        default: () => [
          h(NyCollapseItem, { itemKey: 'a', title: '面板一' }, () => '内容一'),
          h(NyCollapseItem, { itemKey: 'b', title: '面板二' }),
        ],
      },
    ),
  ),
  NyDescriptions: stage(() =>
    h(NyDescriptions, {
      column: 2,
      size: 'sm',
      items: [
        { label: '状态', value: '已上线' },
        { label: '负责人', value: '喵喵' },
      ],
    }),
  ),
  NyList: stage(() =>
    h(
      NyList,
      { data: [{ id: 1, title: '蓝色铃兰' }, { id: 2, title: '雪松手套' }], size: 'sm' },
      { default: ({ item }: { item: Record<string, unknown> }) => h('span', null, String(item.title)) },
    ),
  ),
  NyImage: stage(() =>
    h(NyImage, { src: 'https://picsum.photos/seed/nyana/200/64', height: 60, preview: false }),
  ),
  NyTooltip: stage(() => h(NyTooltip, { content: '悬浮查看说明' }, { default: () => h(NyButton, { size: 'sm' }, '悬浮我') })),
  NyPopover: stage(() =>
    h(
      NyPopover,
      { title: '说明', content: '气泡里的任意内容' },
      { default: () => h(NyButton, { size: 'sm' }, '点我') },
    ),
  ),

  NyInput: stage(() => h(NyInput, { modelValue: '', placeholder: '请输入内容', size: 'sm' })),
  NyTextarea: stage(() => h(NyTextarea, { modelValue: '', rows: 2, size: 'sm', placeholder: '多行文本' })),
  NySelect: stage(() =>
    h(NySelect, {
      options: [
        { label: '设计', value: 'design' },
        { label: '前端', value: 'frontend' },
      ],
      modelValue: 'design',
      size: 'sm',
    }),
  ),
  NyCheckbox: stage(() => h(NyCheckbox, { label: '已选中', checked: true })),
  NySwitch: stage(() =>
    h(NySpace, { size: 'md' }, [h(NySwitch, { checked: true }), h(NySwitch, { checked: false })]),
  ),
  NySlider: stage(() => h(NySlider, { modelValue: 60, showTooltip: false })),
  NyRate: stage(() => h(NyRate, { modelValue: 4, readonly: true })),
  NyDatePicker: stage(() => h(NyDatePicker, { modelValue: null, placeholder: '选择日期', size: 'sm' })),
  NyTimePicker: stage(() => h(NyTimePicker, { modelValue: '09:30', size: 'sm' })),
  NyColorPicker: stage(() => h(NyColorPicker, { modelValue: nyPaletteColor('sky'), size: 'sm' })),
  NyCascader: stage(() =>
    h(NyCascader, {
      options: [
        {
          value: 'zhejiang',
          label: '浙江',
          children: [
            { value: 'hangzhou', label: '杭州' },
            { value: 'ningbo', label: '宁波' },
          ],
        },
        { value: 'jiangsu', label: '江苏', children: [{ value: 'nanjing', label: '南京' }] },
      ],
      modelValue: ['zhejiang', 'hangzhou'],
      size: 'sm',
    }),
  ),
  NyAutoComplete: stage(() =>
    h(NyAutoComplete, {
      options: [
        { label: '蓝色铃兰', value: '蓝色铃兰' },
        { label: '雪松手套', value: '雪松手套' },
      ],
      modelValue: '',
      placeholder: '输入商品名',
      size: 'sm',
    }),
  ),

  NyAlert: stage(() => h(NyAlert, { type: 'success', title: '保存成功' })),
  NyProgress: stage(() => h(NyProgress, { percent: 62 })),
  NySpin: stage(() => h(NySpin, { size: 'lg' })),
  NyAvatarGroup: stage(() =>
    h(
      NyAvatarGroup,
      { max: 3, size: 'sm' },
      () => [
        h(NyAvatar, { key: 'a', text: '喵' }),
        h(NyAvatar, { key: 'b', text: '汪' }),
        h(NyAvatar, { key: 'c', text: '咪' }),
        h(NyAvatar, { key: 'd', text: '咕' }),
      ],
    ),
  ),
  NyUserCard: stage(() =>
    h(NyUserCard, {
      name: '橙汁喵喵',
      items: [
        { key: 'profile', label: '个人资料', icon: 'user' },
        { key: 'logout', label: '退出登录', icon: 'logout', danger: true },
      ],
    }),
  ),
  NyTagInput: stage(() => h(NyTagInput, { modelValue: ['鲜花', '香薰'], placeholder: '回车添加' })),
  NyAvatarCropper: stage(() =>
    h(NySpace, { size: 'sm' }, [
      h(NyAvatar, { text: '裁', size: 'lg' }),
      h(NyButton, { size: 'sm' }, '打开裁剪'),
    ]),
  ),
  NyText: stage(() => h(NyText, { type: 'secondary' }, '正文与语义色文本')),
  NyTitle: stage(() =>
    h(NyStack, { gap: 2 }, [
      h(NyTitle, { level: 4 }, '标题 Title'),
      h(NyTitle, { level: 5 }, '次级标题'),
    ]),
  ),
  NyParagraph: stage(() => h(NyParagraph, null, () => '段落自带行距与最大宽度, 长文本读起来更顺。')),

  NyLayout: iconStage('sidebar', '侧栏 + 顶栏外壳'),
  NySplit: iconStage('columns', '主从两栏'),
  NyContainer: iconStage('inbox', '限制宽度并居中'),
  NyMasonry: iconStage('dashboard', '不等高列式排布'),
  NyGridItem: iconStage('grid', '栅格单项'),
  NyAffix: iconStage('map-pin', '滚动时钉住'),
  NyPageHeader: iconStage('panel-top', '页头组合'),
  NyTabs: stage(() =>
    h(NyTabs, {
      activeKey: 'a',
      items: [
        { key: 'a', label: '概览' },
        { key: 'b', label: '成员' },
        { key: 'c', label: '设置' },
      ],
    }),
  ),
  NyAnchor: stage(() =>
    h(NyAnchor, {
      affix: false,
      items: [
        { key: 'a', title: '基础用法' },
        { key: 'b', title: '进阶用法' },
      ],
    }),
  ),
  NyBackTop: stage(() =>
    h(NyStack, { gap: 6, align: 'center' }, [
      h(NyText, { size: 'xs', type: 'muted' }, '滚动页面后出现在右下角'),
      h(NyBackTop, { visibilityHeight: 120, right: 96, size: 'sm' }),
    ]),
  ),

  NyTable: stage(() =>
    h(NyTable, {
      size: 'sm',
      columns: [
        { key: 'name', title: '商品', width: 140 },
        { key: 'price', title: '价格', align: 'end' },
      ],
      data: [
        { id: 1, name: '蓝色铃兰', price: 128 },
        { id: 2, name: '白桃乌龙', price: 96 },
      ],
    }),
  ),
  NyTimeline: stage(() =>
    h(NyTimeline, {
      size: 'sm',
      items: [
        { title: '创建订单', time: '09:30', status: 'success' },
        { title: '审核通过', time: '10:12', status: 'primary' },
        { title: '等待发货', time: '待处理' },
      ],
    }),
  ),
  NyCalendar: stage(() => h(NyCalendar, { showToday: false })),
  NyEmpty: stage(() => h(NyEmpty, { title: '暂无数据', desc: '换个筛选条件试试', size: 'sm' })),
  NyCollapseItem: stage(() =>
    h(NyCollapse, { activeKeys: ['a'] }, () =>
      h(NyCollapseItem, { itemKey: 'a', title: '折叠项标题' }, () => '折叠面板里的内容'),
    ),
  ),

  NyField: stage(() =>
    h(NyField, { label: '昵称', hint: '2-12 个字' }, () =>
      h(NyInput, { modelValue: '', size: 'sm', placeholder: '输入昵称' }),
    ),
  ),
  NyForm: stage(() =>
    h(NyForm, { model: { name: '' }, layout: 'vertical', gap: 8 }, () => [
      h(NyFormItem, { name: 'name', label: '昵称', required: true }, () =>
        h(NyInput, { modelValue: '', size: 'sm', placeholder: '必填项' }),
      ),
    ]),
  ),
  NyFormItem: stage(() =>
    h(NyForm, { model: { mail: '' }, layout: 'vertical' }, () => [
      h(NyFormItem, { name: 'mail', label: '邮箱', hint: '用来收通知' }, () =>
        h(NyInput, { modelValue: '', size: 'sm', placeholder: 'you@nyana.dev' }),
      ),
    ]),
  ),
  NyInputShell: stage(() =>
    h(
      NyInputShell,
      { size: 'sm' },
      {
        prefix: () => h(NyIcon, { name: 'search', size: 14 }),
        default: () =>
          h('input', {
            placeholder: '外壳 + 前缀',
            style: {
              flex: '1',
              minWidth: '0',
              border: '0',
              background: 'transparent',
              color: 'inherit',
              font: 'inherit',
              outline: 'none',
            },
          }),
      },
    ),
  ),
  NyMentions: stage(() =>
    h(NyMentions, {
      modelValue: '你好 @',
      rows: 2,
      options: [
        { value: 'miaomiao', label: '橙汁喵喵' },
        { value: 'nyana', label: 'Nyana' },
      ],
    }),
  ),
  NyNumberInput: stage(() => h(NyNumberInput, { modelValue: 12, size: 'sm', stepper: true })),
  NyRegexInput: stage(() => h(NyRegexInput, { preset: 'phone', modelValue: '13800138000', size: 'sm' })),
  NyRadio: stage(() =>
    h(NyRadioGroup, {
      modelValue: 'a',
      options: [
        { value: 'a', label: '选项一' },
        { value: 'b', label: '选项二' },
      ],
    }),
  ),
  NyRadioGroup: stage(() =>
    h(NyRadioGroup, {
      modelValue: 'a',
      button: true,
      options: [
        { value: 'a', label: '日' },
        { value: 'b', label: '周' },
        { value: 'c', label: '月' },
      ],
    }),
  ),
  NyCheckboxGroup: stage(() =>
    h(NyCheckboxGroup, {
      modelValue: ['a'],
      options: [
        { value: 'a', label: '鲜花' },
        { value: 'b', label: '香薰' },
      ],
    }),
  ),
  NyTransfer: stage(() =>
    h(NyTransfer, {
      maxHeight: 150,
      showSearch: false,
      data: [
        { key: '1', title: '待选项一', desc: '可搬运' },
        { key: '2', title: '待选项二' },
        { key: '3', title: '已选项' },
      ],
      targetKeys: ['3'],
    }),
  ),
  NyUpload: stage(() => h(NyUpload, { hint: '拖拽或点击上传', maxCount: 2, listType: 'text' })),

  NyResult: stage(() => h(NyResult, { status: 'success', title: '提交成功', desc: '工单号 #2048' })),
  NyPopconfirm: stage(() =>
    h(NyPopconfirm, { title: '确认删除这条数据?', trigger: 'click' }, () =>
      h(NyButton, { size: 'sm', variant: 'danger' }, '删除'),
    ),
  ),
  NyModal: interactive((open) =>
    h(NySpace, { size: 'sm' }, [
      h(NyButton, { size: 'sm', variant: 'primary', onClick: () => (open.value = true) }, '打开对话框'),
      h(
        NyModal,
        {
          open: open.value,
          title: '对话框标题',
          'onUpdate:open': (value: boolean) => (open.value = value),
        },
        () => '对话框里的内容, 演示里就是真组件。',
      ),
    ]),
  ),
  NyDrawer: interactive((open) =>
    h(NySpace, { size: 'sm' }, [
      h(NyButton, { size: 'sm', onClick: () => (open.value = true) }, '打开抽屉'),
      h(
        NyDrawer,
        {
          open: open.value,
          title: '抽屉标题',
          'onUpdate:open': (value: boolean) => (open.value = value),
        },
        () => '抽屉里的内容。',
      ),
    ]),
  ),
  NyMessage: stage(() =>
    h(NySpace, { size: 'sm' }, [
      h(NyButton, { size: 'sm', onClick: () => nyMessage.success('保存成功') }, '成功提示'),
      h(NyButton, { size: 'sm', onClick: () => nyMessage.warning('还有 2 项未填') }, '警告提示'),
    ]),
  ),
  NyNotification: stage(() =>
    h(
      NyButton,
      {
        size: 'sm',
        onClick: () =>
          nyNotification.open({ title: '新订单', desc: '有一笔 128 元的订单待处理' }),
      },
      '打开通知',
    ),
  ),
}
