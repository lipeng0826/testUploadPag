<template>
  <div>
    <a-button @click="reset">清空选中</a-button>
    <div class="game-select-lesson-wrapper" style="width: 300px">
      <div class="left">
        <SelectLessonFilter @searchChange="onSearchChange" :subjectProductId="7" />
        <div>
          <SelectLessonTree
            :selectedKeys="selectedKeys"
            :setSelectedKeys="setSelectedKeys"
            :multiple="false"
            :subjectProductId="7"
            :lessonSearchObj="lessonSearchObj"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { applyReactInVue } from 'vuereact-combined'
import { SelectLessonFilter, SelectLessonTree } from "test-upload-pag";

export default {
  components: {
    // 使用applyReactInVue高阶组件将antd Popover转换成Vue组件
    SelectLessonFilter: applyReactInVue(SelectLessonFilter),
    SelectLessonTree: applyReactInVue(SelectLessonTree)
  },
  data() {
    return {
      lessonSearchObj: {},
      selectedKeys: []
    }
  },
  methods: {
    onSearchChange(payload) {
      console.log('onSearchChange')
      this.lessonSearchObj = payload
    },
    setSelectedKeys(value) {
      console.log('value--- vue', value)
      this.selectedKeys = value
    },
    reset() {
      console.log('reset')
      this.selectedKeys = []
    }
  }
}
</script>
<style lang="scss" module>
.knowledge-graph-tree-tabs {
    .ant-tabs-nav {
      >div {
        display: flex;
        justify-content: space-between;
  
        .ant-tabs-tab {
          padding-left: 31px;
          padding-right: 31px;
          margin: 0 16px;
          text-align: center;
        }
      }
    }
  }
  
</style>
