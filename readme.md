# 知识图谱树&讲次树封装

## 目前一共导出来了 6 个组件

    知识图谱树2个：一个是单选的，1个是多选的
    讲次树4个：单选的2个（树和它的头部），多选的2个（树和它的头部）

## 如何在 react 中使用

    本项目使用react开发，react可以直接引入本组件

## 如何在 vue 中使用

    1.vue使用本组件需要先安装下面这个包
    2.https://github.com/devilwjp/vuereact-combined

    ```vue
    <template>
        <KnowledgeTreeVue
            :scrollHeight="300"
            :subjectProductId="7"
            @select="onSelect"
            forwardRef={knowledgeRef}
            :showReviewModel="0"
            placeholder="输入名称或ID搜索"
            :selectNode='["knowledge", "model"]'
            :needExpandCallBack="false"
            ref="know-tree"
        >
        </KnowledgeTreeVue>
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
    <style lang="less" module></style>
    ```

## 如何调试业务组件

    使用 npm link
    官网: https://docs.npmjs.com/cli/v8/commands/npm-link

## 可视化

    1.使用一个类似antd的文档工具增加入口页面(storybook,dumi)
