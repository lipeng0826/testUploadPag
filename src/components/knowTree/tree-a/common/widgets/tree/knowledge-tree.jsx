import React from 'react';
import { Tree, Button, Empty } from 'antd';
import { escapeRegExp } from 'tikuKnowledge/common/utils';
import BaseTree from './base-tree';
import { Item as TreeNodeTitle, nodeType } from './node-title';
import './node-title.less';

const { TreeNode } = Tree;

export default class KnowledgeTree extends BaseTree {
  renderEmpty = () => {
    const { handleOperation, allowEdit } = this.props;
    return (
      <div>
        {allowEdit && handleOperation && (
          <Button
            style={{ marginTop: 16 }}
            onClick={handleOperation.bind(undefined, undefined, 'createRootFolder')}
          >
            新建
          </Button>
        )}
        <Empty description="暂无数据" />
      </div>
    );
  };

  renderTreeNode = (data) => {
    const {
      knowledgeTopicCount,
      modelTopicCount,
      highlightStr,
      allowEdit,
      allowDel,
      highlightKeys,
    } = this.props;
    return data.map(item => {
      const highlight = !!(
        (highlightKeys && highlightKeys.includes(item.key)) ||
        (highlightStr && (item.name.match(escapeRegExp(highlightStr)) || item.key.endsWith(highlightStr)))
      );
      let t = null;
      if (item.isKnowledge) {
        const v = knowledgeTopicCount && knowledgeTopicCount[item.id];
        const canPushModel = item.attr === '1';
        t = (
          <TreeNodeTitle
            type={nodeType.knowledge}
            operations={
              allowEdit && [
                { key: 'createKnowledgeUp', name: '向上增加知识元' },
                { key: 'createKnowledgeDown', name: '向下增加知识元' },
                canPushModel && { key: 'createModel', name: '新建子题模' },
                { key: 'editKnowledge', name: '编辑' },
                { key: 'moveKnowledge', name: '移动知识元到' },
                allowDel && { key: 'delKnowledge', name: '删除' },
                { key: 'operationLog', name: '操作日志' },
              ].filter(a => a)
            }
            highlight={highlight}
            name={item.name}
            isEdit={item.isEdit}
            showCount={!!knowledgeTopicCount}
            count={v}
            loadingCount={v === undefined}
            item={item}
          />
        );
      } else if (item.isTopicModel) {
        const v = modelTopicCount && modelTopicCount[item.id];
        t = (
          <TreeNodeTitle
            type={nodeType.model}
            operations={
              allowEdit && [
                { key: 'renameModel', name: '重命名' },
                { key: 'editModel', name: '编辑' },
                // { key: 'createModelUp', name: '向上增加题模' },
                // { key: 'createModelDown', name: '向下增加题模' },
                { key: 'createModelDown', name: '增加题模' },
                { key: 'markModelTag', name: '打标签' },
                allowDel && { key: 'delModel', name: '删除' },
                { key: 'operationLog', name: '操作日志' },
              ].filter(a => a)
            }
            highlight={highlight}
            isEdit={item.isEdit}
            showCount={!!modelTopicCount}
            name={item.name}
            count={v}
            loadingCount={v === undefined}
            item={item}
          />
        );
      } else {
        t = (
          <TreeNodeTitle
            type={nodeType.folder}
            operations={
              allowEdit &&
              [
                { key: 'createFolder', name: '新建子文件夹' },
                item.parentNode === null && { key: 'createRootFolder', name: '新建根文件夹' },
                { key: 'createKnowledge', name: '新建子知识元' },
                { key: 'renameFolder', name: '重命名' },
                allowDel && { key: 'delFolder', name: '删除' },
                { key: 'operationLog', name: '操作日志' },
              ].filter(a => a)
            }
            highlight={highlight}
            name={item.name}
            showCount={false}
            isEdit={item.isEdit}
            item={item}
          />
        );
      }
      return (
        <TreeNode
          className={item.isTopicModel ? 'topic-model-node' : ''}
          title={t}
          key={item.key}
          isTopicModel={item.isTopicModel}
          isKnowledge={item.isKnowledge}
          item={item}
        >
          {item.childs && item.childs.length > 0 && this.renderTreeNode(item.childs)}
        </TreeNode>
      );
    });
  };
}
