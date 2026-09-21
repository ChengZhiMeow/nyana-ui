
export interface DocEntry {
  key: string
  title: string
  label: string
  desc: string
  file: string
  icon: string
}

export interface DocGroup {
  title: string
  items: DocEntry[]
}

export const docGroups: DocGroup[] = [
  {
    title: '通用',
    items: [
      { key: 'button', title: 'Button 按钮', label: '按钮', desc: '触发一个即时操作, 七种风格与三档尺寸', file: 'ButtonDoc.vue', icon: 'check' },
      { key: 'icon', title: 'Icon 图标', label: '图标', desc: '207 个描边图标 + 109 个平台品牌图标', file: 'IconDoc.vue', icon: 'star' },
      { key: 'typography', title: 'Typography 排版', label: '排版', desc: '标题, 正文与段落的统一字号与语义色', file: 'TypographyDoc.vue', icon: 'file' },
      { key: 'divider', title: 'Divider 分割线', label: '分割线', desc: '横向与纵向分隔, 可带文字与虚线', file: 'DividerDoc.vue', icon: 'minus' },
      { key: 'float-button', title: 'FloatButton 悬浮按钮', label: '悬浮按钮', desc: '固定在角落的操作按钮与按钮组', file: 'FloatButtonDoc.vue', icon: 'plus' },
      { key: 'theme-toggle', title: 'ThemeToggle 主题切换', label: '主题切换', desc: '四种样式的深浅色切换控件', file: 'ThemeToggleDoc.vue', icon: 'moon' },
    ],
  },
  {
    title: '布局',
    items: [
      { key: 'layout', title: 'Layout 布局', label: '布局', desc: 'side / top / mix / blank 四种内置外壳', file: 'LayoutDoc.vue', icon: 'sidebar' },
      { key: 'split', title: 'Split 分栏', label: '分栏', desc: '主从两栏, 可拖拽调宽与收起', file: 'SplitDoc.vue', icon: 'columns' },
      { key: 'space', title: 'Space 间距', label: '间距', desc: '一维间距容器, 用 gap 统一节奏', file: 'SpaceDoc.vue', icon: 'arrow-right' },
      { key: 'flex', title: 'Flex 弹性布局', label: '弹性布局', desc: 'flex 的薄封装, 精确控制伸缩与对齐', file: 'FlexDoc.vue', icon: 'sliders' },
      { key: 'row', title: 'Row 横向布局', label: '横向布局', desc: '按钮组与表单项最常用的横向排布', file: 'RowDoc.vue', icon: 'arrow-right' },
      { key: 'stack', title: 'Stack 纵向布局', label: '纵向布局', desc: '纵向堆叠, 可撑满剩余高度', file: 'StackDoc.vue', icon: 'arrow-down' },
      { key: 'grid', title: 'Grid 栅格', label: '栅格', desc: '固定列数与自适应列宽, 支持断点覆盖', file: 'GridDoc.vue', icon: 'grid' },
      { key: 'container', title: 'Container 容器', label: '容器', desc: '限制内容最大宽度并居中', file: 'ContainerDoc.vue', icon: 'inbox' },
      { key: 'card', title: 'Card 卡片', label: '卡片', desc: '带标题与操作区的内容块, 支持封面与悬浮', file: 'CardDoc.vue', icon: 'layers' },
      { key: 'masonry', title: 'Masonry 瀑布流', label: '瀑布流', desc: '不等高内容的列式排布', file: 'MasonryDoc.vue', icon: 'dashboard' },
      { key: 'affix', title: 'Affix 固钉', label: '固钉', desc: '滚动到阈值后固定在视口边缘', file: 'AffixDoc.vue', icon: 'map-pin' },
      { key: 'page-header', title: 'PageHeader 页头', label: '页头', desc: '面包屑, 标题, 操作与页签的页头组合', file: 'PageHeaderDoc.vue', icon: 'panel-top' },
    ],
  },
  {
    title: '导航',
    items: [
      { key: 'breadcrumb', title: 'Breadcrumb 面包屑', label: '面包屑', desc: '显示当前页面在层级中的位置', file: 'BreadcrumbDoc.vue', icon: 'chevron-right' },
      { key: 'dropdown', title: 'Dropdown 下拉菜单', label: '下拉菜单', desc: '悬浮或点击展开的操作菜单', file: 'DropdownDoc.vue', icon: 'chevron-down' },
      { key: 'tabs', title: 'Tabs 标签页', label: '标签页', desc: '六种形态: 下划线、纯文字、浅底、卡片、分段、胶囊', file: 'TabsDoc.vue', icon: 'columns' },
      { key: 'steps', title: 'Steps 步骤条', label: '步骤条', desc: '展示流程进度与当前步骤', file: 'StepsDoc.vue', icon: 'check-circle' },
      { key: 'pagination', title: 'Pagination 分页', label: '分页', desc: '页码折叠, 每页条数与总数', file: 'PaginationDoc.vue', icon: 'more-horizontal' },
      { key: 'backtop', title: 'BackTop 回到顶部', label: '回到顶部', desc: '滚动后出现的一键回顶按钮', file: 'BackTopDoc.vue', icon: 'arrow-up' },
      { key: 'segmented', title: 'Segmented 分段控制器', label: '分段控制', desc: '轻量的单选切换, 带滑动指示块', file: 'SegmentedDoc.vue', icon: 'grid' },
      { key: 'anchor', title: 'Anchor 锚点', label: '锚点', desc: '长页面里的目录导航与滚动高亮', file: 'AnchorDoc.vue', icon: 'anchor' },
    ],
  },
  {
    title: '数据展示',
    items: [
      { key: 'tag', title: 'Tag 标签', label: '标签', desc: '状态标记与可选中标签', file: 'TagDoc.vue', icon: 'tag' },
      { key: 'badge', title: 'Badge 徽标', label: '徽标', desc: '数字, 小圆点与状态点', file: 'BadgeDoc.vue', icon: 'bell' },
      { key: 'avatar', title: 'Avatar 头像', label: '头像', desc: '图片, 文字与图标头像, 支持叠放', file: 'AvatarDoc.vue', icon: 'user' },
      { key: 'user-card', title: 'UserCard 用户卡片', label: '用户卡片', desc: '头像加名字的顶栏入口, 带下拉菜单', file: 'UserCardDoc.vue', icon: 'users' },
      { key: 'avatar-cropper', title: 'AvatarCropper 头像裁剪', label: '头像裁剪', desc: '拖动缩放裁出正方形头像, canvas 导出', file: 'AvatarCropperDoc.vue', icon: 'crop' },
      { key: 'tooltip', title: 'Tooltip 文字提示', label: '文字提示', desc: '悬浮时出现的轻量说明', file: 'TooltipDoc.vue', icon: 'info' },
      { key: 'popover', title: 'Popover 气泡卡片', label: '气泡卡片', desc: '可放任意内容的气泡浮层', file: 'PopoverDoc.vue', icon: 'layers' },
      { key: 'collapse', title: 'Collapse 折叠面板', label: '折叠面板', desc: '分组收纳内容, 支持手风琴', file: 'CollapseDoc.vue', icon: 'chevron-down' },
      { key: 'descriptions', title: 'Descriptions 描述列表', label: '描述列表', desc: '键值对形式的详情展示', file: 'DescriptionsDoc.vue', icon: 'list' },
      { key: 'list', title: 'List 列表', label: '列表', desc: '带分隔线与悬浮态的基础列表', file: 'ListDoc.vue', icon: 'list' },
      { key: 'table', title: 'Table 表格', label: '表格', desc: '排序, 选择, 固定表头与自定义单元格', file: 'TableDoc.vue', icon: 'table' },
      { key: 'timeline', title: 'Timeline 时间轴', label: '时间轴', desc: '按时间顺序呈现事件流', file: 'TimelineDoc.vue', icon: 'clock' },
      { key: 'statistic', title: 'Statistic 统计数值', label: '统计数值', desc: '带前缀后缀与趋势的重点数字', file: 'StatisticDoc.vue', icon: 'hash' },
      { key: 'empty', title: 'Empty 空状态', label: '空状态', desc: '无数据时的占位与引导', file: 'EmptyDoc.vue', icon: 'inbox' },
      { key: 'skeleton', title: 'Skeleton 骨架屏', label: '骨架屏', desc: '加载中的占位结构', file: 'SkeletonDoc.vue', icon: 'sliders' },
      { key: 'image', title: 'Image 图片', label: '图片', desc: '带加载占位与全屏预览的图片', file: 'ImageDoc.vue', icon: 'image' },
      { key: 'carousel', title: 'Carousel 走马灯', label: '走马灯', desc: '轮播一组内容, 支持自动播放与指示点', file: 'CarouselDoc.vue', icon: 'carousel' },
      { key: 'tree', title: 'Tree 树形控件', label: '树形控件', desc: '层级数据的展开, 勾选与选中', file: 'TreeDoc.vue', icon: 'tree' },
      { key: 'watermark', title: 'Watermark 水印', label: '水印', desc: '给内容盖上可平铺的文字或图片水印', file: 'WatermarkDoc.vue', icon: 'droplet' },
      { key: 'calendar', title: 'Calendar 日历', label: '日历', desc: '月视图日历, 支持事件与单元格自定义', file: 'CalendarDoc.vue', icon: 'calendar' },
    ],
  },
  {
    title: '数据录入',
    items: [
      { key: 'form', title: 'Form 表单', label: '表单', desc: '字段注册, 规则校验与统一布局', file: 'FormDoc.vue', icon: 'check' },
      { key: 'field', title: 'Field 字段', label: '字段', desc: '标签, 提示与错误的字段外壳', file: 'FieldDoc.vue', icon: 'file' },
      { key: 'input', title: 'Input 输入框', label: '输入框', desc: '文本限制: 长度, 字符白名单, 正则', file: 'InputDoc.vue', icon: 'edit' },
      { key: 'number-input', title: 'NumberInput 数字输入框', label: '数字输入框', desc: '区间, 精度, 步进与千分位', file: 'NumberInputDoc.vue', icon: 'hash' },
      { key: 'regex-input', title: 'RegexInput 正则输入框', label: '正则输入框', desc: '13 个格式预设与实时匹配状态', file: 'RegexInputDoc.vue', icon: 'code' },
      { key: 'textarea', title: 'Textarea 多行文本', label: '多行文本', desc: '自适应高度与字数统计', file: 'TextareaDoc.vue', icon: 'file' },
      { key: 'select', title: 'Select 选择器', label: '选择器', desc: '单选, 多选与可搜索', file: 'SelectDoc.vue', icon: 'chevron-down' },
      { key: 'checkbox', title: 'Checkbox 多选框', label: '多选框', desc: '独立使用或配合多选组', file: 'CheckboxDoc.vue', icon: 'check-circle' },
      { key: 'radio', title: 'Radio 单选框', label: '单选框', desc: '单选组与胶囊按钮形态', file: 'RadioDoc.vue', icon: 'check' },
      { key: 'switch', title: 'Switch 开关', label: '开关', desc: '即时切换某个状态', file: 'SwitchDoc.vue', icon: 'sliders' },
      { key: 'slider', title: 'Slider 滑动输入条', label: '滑动输入条', desc: '单值与区间滑动, 支持刻度', file: 'SliderDoc.vue', icon: 'sliders' },
      { key: 'rate', title: 'Rate 评分', label: '评分', desc: '星级评分, 支持半星与文案', file: 'RateDoc.vue', icon: 'star' },
      { key: 'date-picker', title: 'DatePicker 日期选择', label: '日期选择', desc: '月视图日历, 支持区间与禁用规则', file: 'DatePickerDoc.vue', icon: 'calendar' },
      { key: 'upload', title: 'Upload 上传', label: '上传', desc: '选择, 限制与文件列表管理', file: 'UploadDoc.vue', icon: 'upload' },
      { key: 'cascader', title: 'Cascader 级联选择', label: '级联选择', desc: '多级联动选择, 支持搜索与自定义字段', file: 'CascaderDoc.vue', icon: 'chevron-right' },
      { key: 'transfer', title: 'Transfer 穿梭框', label: '穿梭框', desc: '两栏之间来回搬运待选项', file: 'TransferDoc.vue', icon: 'transfer' },
      { key: 'autocomplete', title: 'AutoComplete 自动完成', label: '自动完成', desc: '输入时给出候选, 可自由输入', file: 'AutoCompleteDoc.vue', icon: 'search' },
      { key: 'mentions', title: 'Mentions 提及', label: '提及', desc: '输入 @ 唤出人员候选', file: 'MentionsDoc.vue', icon: 'hash' },
      { key: 'color-picker', title: 'ColorPicker 颜色选择器', label: '颜色选择', desc: '预设色板与原生取色器', file: 'ColorPickerDoc.vue', icon: 'droplet' },
      { key: 'time-picker', title: 'TimePicker 时间选择', label: '时间选择', desc: '时分秒选择, 支持区间与禁用时刻', file: 'TimePickerDoc.vue', icon: 'clock' },
      { key: 'tag-input', title: 'TagInput 标签输入', label: '标签输入', desc: '回车成胶囊的标签编辑框, 支持候选联想', file: 'TagInputDoc.vue', icon: 'tag' },
    ],
  },
  {
    title: '反馈',
    items: [
      { key: 'alert', title: 'Alert 警告提示', label: '警告提示', desc: '页面内的状态提示条', file: 'AlertDoc.vue', icon: 'alert' },
      { key: 'message', title: 'Message 全局提示', label: '全局提示', desc: '命令式轻提示 nyMessage.success()', file: 'MessageDoc.vue', icon: 'bell' },
      { key: 'modal', title: 'Modal 对话框', label: '对话框', desc: '需要打断当前流程的浮层', file: 'ModalDoc.vue', icon: 'maximize' },
      { key: 'drawer', title: 'Drawer 抽屉', label: '抽屉', desc: '从四侧滑出的面板', file: 'DrawerDoc.vue', icon: 'sidebar' },
      { key: 'popconfirm', title: 'Popconfirm 气泡确认', label: '气泡确认', desc: '二次确认后再执行操作', file: 'PopconfirmDoc.vue', icon: 'question-circle' },
      { key: 'progress', title: 'Progress 进度条', label: '进度条', desc: '线与环两种形态的进度展示', file: 'ProgressDoc.vue', icon: 'clock' },
      { key: 'spin', title: 'Spin 加载中', label: '加载中', desc: '加载指示器与内容包裹', file: 'SpinDoc.vue', icon: 'refresh' },
      { key: 'result', title: 'Result 结果页', label: '结果页', desc: '操作结果的整页反馈', file: 'ResultDoc.vue', icon: 'check-circle' },
      { key: 'notification', title: 'Notification 通知提醒', label: '通知提醒', desc: '命令式通知卡片 nyNotification.open()', file: 'NotificationDoc.vue', icon: 'bell' },
    ],
  },
  {
    title: '其他',
    items: [
      { key: 'theme', title: 'Theme 主题令牌', label: '主题令牌', desc: '颜色, 尺寸与阴影变量, 深浅色切换', file: 'ThemeDoc.vue', icon: 'palette' },
      { key: 'all', title: 'All 全部组件', label: '全部组件', desc: '库里所有组件的一份完整清单', file: 'AllDoc.vue', icon: 'layers' },
    ],
  },
]

export const docEntries: DocEntry[] = docGroups.flatMap((group) => group.items)

const componentAlias: Record<string, string> = {
  autocomplete: 'NyAutoComplete',
  backtop: 'NyBackTop',
}

export function componentNameOf(key: string): string {
  const alias = componentAlias[key]

  if (alias) {
    return alias
  }

  return `Ny${key
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}`
}

export const groupByComponent: Map<string, string> = new Map(
  docGroups.flatMap((group) => group.items.map((item) => [componentNameOf(item.key), group.title] as [string, string])),
)

export const entryByComponent: Map<string, DocEntry> = new Map(
  docEntries.map((entry) => [componentNameOf(entry.key), entry]),
)

export function entryPath(entry: DocEntry): string {
  return `/components/${entry.key}`
}

export function findEntry(key: string): DocEntry | undefined {
  return docEntries.find((entry) => entry.key === key)
}
