<template>
  <div>
    <div style="width: 300px">
      <!--  -->
      <a-button @click="clickSelect" >清除选中（Vue111)</a-button>
      <KnowledgeTreeVue
        :scrollHeight="300"
        :subjectProductId="7"
        @select="onSelect"
        :showReviewModel="0"
        placeholder="输入名称或ID搜索"
        :selectNode='["knowledge", "model"]'
        :needExpandCallBack="false"
        ref="know-tree"
      >
      </KnowledgeTreeVue>
      <h1 />
    </div>
  </div>
</template>

<script>
import { KnowledgeTree } from "test-upload-pag";
import { applyReactInVue } from 'vuereact-combined'

export default {
  components: {
    // 使用applyReactInVue高阶组件将antd Popover转换成Vue组件
    KnowledgeTreeVue: applyReactInVue(KnowledgeTree)
  },
  methods: {
    onSelect(selectedKeys, node, { selected }, filterConditions) {
    // 1.如果选择了某个内容，那么清空其他树的选项
    console.log(selectedKeys, node, { selected }, filterConditions, 'selectedKeys, node, { selected }, filterConditions --- vue');
    if (selected) {
      console.log('selected')
    }
    const { type } = node;
    // onSelect(selectedKeys, node, { selected }, filterConditions);
    },
    clickSelect() {
      // reactRef指向react的引用
      this.$refs['know-tree'].reactRef.reset()
    }
  },
}
</script>
<style lang="scss" module></style>
