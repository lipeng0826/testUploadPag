<template>
  <div>
    <div class='game-lesson-select-wrapper'>
        <div class='left'>
          <div style="height: 260px;">
            <BindLessonFilter
            @searchChange="onSearchChange"
            :subjectProductId="7"
          />
          </div>
          <BindLessonTree
              :multiple="true"
              :allLesson="allLesson"
              @expand="onExpand"
              :expandedKeys="expandedKeys"
              :subjectProductId="7"
              :lessonSearchObj="lessonSearchObj"
              @select="onSelect"
            />
        </div>
        <div class="list" style="width: 350px">
          <h3>
            讲次篮(已选择{{allLesson.length}}个)
          </h3>
          <div v-for="item in allLesson" :key="item.id" >
            {{item.lessonName}}&nbsp; <a-button @click="() => {removeSelect(item.lessonId)}">删除</a-button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { applyReactInVue } from 'vuereact-combined'
import { BindLessonFilter, BindLessonTree } from "test-upload-pag";

export default {
  components: {
    // 使用applyReactInVue高阶组件将antd Popover转换成Vue组件
    BindLessonFilter: applyReactInVue(BindLessonFilter),
    BindLessonTree: applyReactInVue(BindLessonTree)
  },
  data() {
    return {
      allLesson: [],
      expandedKeys: [],
      lessonSearchObj: {}
    }
  },
  methods: {
    onSearchChange(payload) {
      this.lessonSearchObj = payload
    },
    removeSelect(lessonId) {
      this.allLesson = this.allLesson.filter(item => item.lessonId != lessonId)
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    onSelect(selectedKeys, { selected, selectedNodes, node, event }) {
      // 1.如果点击的是课程，没反应
      if (!node.isLeaf) {
        if (this.expandedKeys.includes(node.key)) {
          this.expandedKeys = this.expandedKeys.filter(item => item !== node.key)
        } else {
          this.expandedKeys = [...new Set([...this.expandedKeys, node.key])]
        }
        return
      }
      // 2.如果点击其他区域选中和非选中
      // console.log(selectedKeys, selected, selectedNodes, node, event, 'selected, selectedNodes, node, event');
      const { classTypeId, lessonId, lessonName, courseName } = node
      console.log(classTypeId, lessonId, lessonName, 'classTypeId, lessonId, lessonName');
      if (selected) {
        this.allLesson = this.allLesson.concat([{ classTypeId, lessonId, lessonName, courseName }])
      } else {
        this.removeSelect(lessonId)
      }
    }
  },

}
</script>
<style lang="scss">
.game-lesson-select-wrapper {
  height: calc(100vh - 200px);
  overflow: auto;
  display: flex;
  &::-webkit-scrollbar {
    width: 6px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
    border-radius: 32px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
    border-radius: 32px;
  }

  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 0;
    height: 100%;
  }
  .list {
    width: 350px;
    margin-left: 20px;
  }
}
</style>
