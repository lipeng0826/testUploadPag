import React from 'react';
import { Tree, Empty } from 'diy-ui';
// import { escapeRegExp } from 'utils';
import PropTypes from 'prop-types';
import BaseTree from './base-tree';
import { Item as TreeNodeTitle, nodeType } from './node-title';
import { getAllPermissons } from 'knowledgeGraph/utils';

const { TreeNode } = Tree;

// type treeItem = {
//   id: number;
//   key: string;
//   parentNode: treeItem | null;
//   name: string;
//   isEdit?: boolean;
//   isTopicModel?: boolean;
//   isKnowledge?: boolean;
//   childs?: treeItem[];
//   type?: string;
//   level: number;
// };
// type treeData = treeItem[];

function escapeRegExp(str) {
  // eslint-disable-next-line no-useless-escape
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
const hasDeletePermission = async (type) => {
  const allPermissions = await getAllPermissons()
  const allPermissionsSet = new Set(allPermissions);
  return allPermissionsSet.has(type === 1 ? 'diy_knowledgemap_zjx_delete' : 'diy_knowledgemap_axx_delete');
};

export default class ChapterTree extends BaseTree {
  static propTypes = {
    allowEdit: PropTypes.bool,
    data: PropTypes.array,
    highlightKeys: PropTypes.shape({
      includes: PropTypes.func,
    }),
    highlightStr: PropTypes.any,
    knowledgeTopicCount: PropTypes.any,
    modelTopicCount: PropTypes.any,
    showKnowledgeAndTopic: PropTypes.any,
    type: PropTypes.number,
  };

  async componentDidMount() {
    this.canDelete = await hasDeletePermission(this.props.type)
  }

  renderEmpty = () => <Empty description="暂无数据" />;

  // renderTreeNode = (data: treeData) => {
  renderTreeNode = (data) => {
    const {
      knowledgeTopicCount,
      modelTopicCount,
      allowEdit,
      highlightKeys,
      highlightStr,
      showKnowledgeAndTopic = true,
    } = this.props;
    return data.map(item => {
      const highlight = !!(
        (highlightKeys && highlightKeys.includes(item.key)) ||
        (highlightStr && (
          item.name?.match(escapeRegExp(highlightStr)) ||
          item.key.endsWith(highlightStr)) ||
          item.isKnowledge && item.knowledgeId == highlightStr ||
          item.isTopicModel && item.modelId == highlightStr
        )
      );
      let t = null;
      if (item.isKnowledge) {
        if (!showKnowledgeAndTopic) {
          return null;
        }
        const v = knowledgeTopicCount && knowledgeTopicCount[item.id];
        t = (
          <TreeNodeTitle
            type={nodeType.knowledge}
            highlight={highlight}
            name={item.name}
            isEdit={item.isEdit}
            showCount={!!knowledgeTopicCount}
            count={v}
            loadingCount={v === undefined}
            item={item}
            key={item.id}
          />
        );
      } else if (item.isTopicModel) {
        if (!showKnowledgeAndTopic) {
          return null;
        }
        const v = modelTopicCount && modelTopicCount[item.id];
        t = (
          <TreeNodeTitle
            type={nodeType.model}
            highlight={highlight}
            isEdit={item.isEdit}
            showCount={!!modelTopicCount}
            name={item.name}
            count={v}
            loadingCount={v === undefined}
            item={item}
            key={item.id}
          />
        );
      } else {
        t = (
          <TreeNodeTitle
            type={nodeType.folder}
            operations={
              allowEdit &&
              [
                item.level < 4 && { key: 'createFolder', name: '新建分类' },
                item.parentNode === null && { key: 'createRootFolder', name: '新建一级分类' },
                { key: 'renameFolder', name: '重命名' },
                this.canDelete && { key: 'delete', name: '删除' },
              ].filter(a => a)
            }
            highlight={highlight}
            name={item.name}
            showCount={false}
            isEdit={item.isEdit}
            item={item}
            key={item.id}
          />
        );
      }
      return (
        <TreeNode
          title={t}
          key={item.key}
          isTopicModel={item.isTopicModel}
          isKnowledge={item.isKnowledge}
          type={item.type}
          item={item}
        >
          {item.childs && item.childs.length > 0 && this.renderTreeNode(item.childs)}
        </TreeNode>
      );
    });
  };
}
