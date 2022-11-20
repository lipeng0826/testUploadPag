<template>
  <div>
    <div style="display:flex">
      <div style="width: 300px">
        <KnowledgeTreeVue
        scrollHeight="500"
        :showReviewModel="0"
        :multiple="true"
        :subjectProductId="7"
        :selectNode='["knowledge", "model"]'
        @select="onSelect"
        :defaultSelectedKeys="allModels.map((item) => item.id + '')"
        ref="select-tree" />
      </div>
      <div>
        <h3 class="model-box-title">
          知识元/题模篮(已选择{{allModels.length}}个)
        </h3>
        <div>
          <div v-for="item in allModels" class="model-item" :key="item.id">
            {{ item.name }}
            <span @click="() => removeSelect(item.id)">删除</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { applyReactInVue } from 'vuereact-combined'
import { SelectKnowTree } from "test-upload-pag";

export default {
  components: {
    // 使用applyReactInVue高阶组件将antd Popover转换成Vue组件
    KnowledgeTreeVue: applyReactInVue(SelectKnowTree)
  },
  data() {
    return {
      allModels: []
    }
  },
  methods: {
    onSelect(selectedKeys, node, { selected }, filterConditions) {

      const nodeItem = node['data-use'];
      if (!nodeItem) {
        return false;
      }
      if (selected) {
        if (this.allModels.some(m => m.id === node.id)) {
          console.log('11')
        } else {
          const model = { id: nodeItem.id, name: nodeItem.name, type: nodeItem.isKnowledge ? 1 : 2 };
          const hasThis = this.allModels.some(m => m.id === model.id);
          if (!hasThis) {
            this.allModels = [...this.allModels, model]
          }
        }
      } else {
        const allModelsFilter = this.allModels.filter(m => m.id !== nodeItem.id);
        this.allModels = allModelsFilter
      }
    },
    removeSelect(id) {
      const selected = this.allModels.find((item) => item.id == id);
      if (selected) {
        this.allModels = JSON.parse(
          JSON.stringify(this.allModels.filter((item) => item.id != id))
        )
      }
      this.$refs['select-tree'].reactRef.deleteSelected(id)
    }
  }
}
</script>
<style lang="scss" module>

</style>
