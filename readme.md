# 知识图谱树&讲次树封装

## 目前一共导出了 6 个组件

    知识图谱树2个：1个是选择树，1个是绑定树
    讲次树4个：单选的2个（树和它的头部），多选的2个（树和它的头部）

```ts
export {default as KnowledgeTree} from './components/knowTree/tiku-business/tree/data-knowledge-graph-tree.jsx';
export { SelectLessonFilter, SelectLessonTree } from './components/lessonTree/index.jsx';
export {default as SelectKnowTree} from './components/knowTree/tiku-business/tree/data-knowledge-graph-tree-select.jsx';
export { BindLessonFilter, BindLessonTree } from './components/bindLessonTree/index.jsx';
```

## 如何在 react 中使用

    npm install test-upload-pag
    本项目使用react开发，react可以直接引入本组件

## 如何在 vue 中使用

    1.vue使用需要先安装下面这个包
        https://github.com/devilwjp/vuereact-combined
    3.然后使用 applyReactInVue 包裹导出来的组件转化成vue组件

```js
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

    详细文档参考 /src/devEntry/vue-use/README.md

## react 调试组件

    在包的根目录：
        1.npm run start
        2.启动调试页面
    注：
        1.需要登录admin.aixuexi.com
        2.同时将域名改成：http:local.aixuexi.com:8080
            注：需要使用switchHost将 127.0.0.1 映射成对应的域名，或者使用其他localhost的映射域名都可以，就可以使用到admin的cookie，保持登录状态

## vue 调试组件

    使用 npm link
    参考文档: https://docs.npmjs.com/cli/v8/commands/npm-link

## 发包

    1.修改完，调试好之后
    2.npm run build 打包
    3.更新版本号
    4.npm publish
