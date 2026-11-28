<script setup lang="ts">
import { ref } from 'vue'

import { NyChoiceCard, NyChoiceGroup, NyIcon, NyTag } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const server = ref('paper')
const term = ref(3)
const pay = ref('alipay')
const extras = ref<(string | number)[]>(['backup'])

const codeBasic = `<NyChoiceGroup v-model="server" :cols="3">
  <NyChoiceCard value="vanilla" icon="box" title="原版" description="官方服务端" />
  <NyChoiceCard value="paper" icon="layers" title="Paper" description="性能好, 支持插件" tag="推荐" />
  <NyChoiceCard value="pack" icon="package" title="整合包" description="需要 8 GB 以上内存" disabled />
</NyChoiceGroup>`

const codePay = `<NyChoiceGroup v-model="pay" :cols="1" indicator>
  <NyChoiceCard value="alipay" title="支付宝">
    <template #icon><NyIcon name="brand-alipay" :size="24" style="color: #1677ff" /></template>
  </NyChoiceCard>
  ...
</NyChoiceGroup>`
</script>

<template>
  <DocPage title="ChoiceCard 选择卡" desc="带说明的单选或多选, 用于选择服务端、套餐、支付方式。选中时边框变喵蓝并铺浅蓝底, 右上角可挂角标。">
    <DemoBlock title="单选" desc="cols 控制列数; 平板自动最多 2 列, 手机 1 列 (可用 colsMd / colsSm 改)。" :code="codeBasic">
      <NyChoiceGroup v-model="server" :cols="3">
        <NyChoiceCard value="vanilla" icon="box" title="原版" description="官方服务端, 无插件" />
        <NyChoiceCard value="paper" icon="layers" title="Paper" description="性能好, 支持插件" tag="推荐" />
        <NyChoiceCard value="pack" icon="package" title="整合包" description="需要 8 GB 以上内存" disabled />
      </NyChoiceGroup>
    </DemoBlock>

    <DemoBlock title="套餐" desc="默认插槽可以放任意内容, 例如价格与折扣标签。">
      <NyChoiceGroup v-model="term" :cols="4" :cols-sm="2">
        <NyChoiceCard v-for="[months, price, off] in [[1, 48, 0], [3, 43, 10], [6, 41, 15], [12, 38, 20]]" :key="months" :value="months" :tag="months === 3 ? '推荐' : undefined">
          <b>{{ months }} 个月</b>
          <span class="ex-price">¥{{ price }}<small>/月</small></span>
          <NyTag v-if="off" size="sm" status="danger" style="align-self: flex-start">省 {{ off }}%</NyTag>
        </NyChoiceCard>
      </NyChoiceGroup>
    </DemoBlock>

    <DemoBlock title="支付方式" desc="indicator 在左侧显示单选圈; 平台图标用官方品牌色。" :code="codePay">
      <div style="max-width: 420px">
        <NyChoiceGroup v-model="pay" :cols="1" indicator>
          <NyChoiceCard value="alipay" title="支付宝"><template #icon><NyIcon name="brand-alipay" :size="24" style="color: #1677ff" /></template></NyChoiceCard>
          <NyChoiceCard value="wechat" title="微信支付"><template #icon><NyIcon name="brand-wechat" :size="24" style="color: #07c160" /></template></NyChoiceCard>
          <NyChoiceCard value="wallet" icon="wallet" title="余额" description="剩余 ¥86.50, 不足" disabled />
        </NyChoiceGroup>
      </div>
    </DemoBlock>

    <DemoBlock title="多选">
      <NyChoiceGroup v-model="extras" multiple indicator :cols="3">
        <NyChoiceCard value="backup" title="每小时备份" description="+¥6 / 月" />
        <NyChoiceCard value="db" title="额外数据库" description="+¥4 / 月" />
        <NyChoiceCard value="ip" title="独立端口" description="+¥2 / 月" />
      </NyChoiceGroup>
    </DemoBlock>

    <template #api>
      <ApiTable
        title="ChoiceGroup Props"
        :rows="[
          { name: 'v-model', type: 'string | number | (string | number)[]', desc: '选中值; multiple 时是数组' },
          { name: 'multiple', type: 'boolean', default: 'false', desc: '多选' },
          { name: 'cols / colsMd / colsSm', type: 'number', default: '3 / min(cols, 2) / 1', desc: '桌面、平板、手机的列数' },
          { name: 'indicator', type: 'boolean', default: 'false', desc: '左侧显示单选圈或勾选框' },
          { name: 'disabled', type: 'boolean', default: 'false', desc: '整组禁用' },
        ]"
      />
      <ApiTable
        title="ChoiceCard Props"
        :rows="[
          { name: 'value', type: 'string | number', desc: '选项值' },
          { name: 'title / description', type: 'string', desc: '标题与说明' },
          { name: 'icon', type: 'string', desc: '左侧图标, 也可用 icon 插槽' },
          { name: 'tag', type: 'string', desc: '右上角角标' },
          { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
        ]"
      />
    </template>
  </DocPage>
</template>

<style scoped lang="scss">
.ex-price {
  font-family: var(--ny-font-family-display);
  font-size: 20px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;

  small {
    font-size: 12px;
    font-weight: 400;
    color: var(--ny-text-muted);
  }
}
</style>
