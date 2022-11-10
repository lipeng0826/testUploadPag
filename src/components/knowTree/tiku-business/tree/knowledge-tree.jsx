import React from 'react';
import { Tree } from 'antd';
import BasicTree from '../../tiku-basic/Tree/basic-tree.jsx';
import { NormalKnowledgeTitle } from '../../tiku-basic/Tree/title/knowledge-v2.jsx';
import { GraphKnowledgeTitle } from '../../tiku-basic/Tree/title/knowledge-graph-title.jsx';

const { TreeNode } = Tree;

export default class KnowledgeTreeNoData extends BasicTree {
  renderTreeNode = (data, isRoot = false) => {
    if (!data) {
      return null;
    }
    const { searchValue, labelKey, titleType } = this.props;
    return data.map((item) => {
      const { key, isKnowledge, isTopicModel, id } = item;
      const title = labelKey ? item[labelKey] : item.description;
      let curStyle = { fontWeight: 'normal', fontSize: 12 };
      if (isRoot) {
        curStyle = { fontWeight: 'bold', fontSize: 12 };
      }
      let afterTitle = <span>{title}</span>;
      if (searchValue) {
        const _index = title.indexOf(searchValue);
        const beforeStr = title.substr(0, _index);
        const afterStr = title.substr(_index + searchValue.length);
        const idEqual = id == searchValue;
        afterTitle =
          _index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ background: '#edffa3' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : idEqual ? (
            <span style={{ background: '#edffa3' }}>{title}</span>
          ) : (
            <span>{title}</span>
          );
      }
      const MyTitle = titleType === 'graph' ? GraphKnowledgeTitle : NormalKnowledgeTitle;
      const _title = <MyTitle title={afterTitle} style={curStyle} item={item} />;
      return (
        <TreeNode
          key={key}
          title={_title}
          id={item.id}
          isKnowledge={isKnowledge}
          isTopicModel={isTopicModel}
          data-use={item}
          // isLeaf={isTopicModel || item.childs && item.childs.length === 0}
          isLeaf={this.props.showTopicModel ? isTopicModel : isKnowledge}
        >
          {item.childs && item.childs.length > 0 && this.renderTreeNode(item.childs)}
        </TreeNode>
      );
    });
  };
}
