import React from 'react';
import { categoryMap, knowledgeTypeAttr } from '../../../tree-a/constant-2.js';
import tipDecorator from './decorator-tip.jsx';

import './knowledge-title.less';
import '../../../tree-a/common/widgets/tree/node-title.less';

function _GraphKnowledgeTitle(props) {
  const { style, title, item } = props;
  const { isKnowledge, isTopicModel } = item;
  function renderTypeInfo() {
    const result = {};
    if (item.isFolder) {
      return null;
    }
    if (item.isTopicModel) {
      const curCategoryData = categoryMap.get(item.category) || { name: -1 };
      if (curCategoryData.name !== -1) {
        result.cls = 'icon-type-model';
        result.title = curCategoryData.name.slice(0, 1);
      }
    }
    if (item.isKnowledge) {
      const curKnowledgeTypeData = knowledgeTypeAttr[item.attr] || -1;
      if (curKnowledgeTypeData !== -1) {
        result.cls = 'icon-type-knowledge';
        result.title = curKnowledgeTypeData;
      }
    }
    if (result.cls && result.title) {
      return (
        <span className="icon graph-icon-type" style={{ marginRight: 4 }}>
          <span className={result.cls}>{result.title}</span>
        </span>
      );
    }
    return null;
  }

  function renderTagMarkInfo() {
    // if (item.isTopicModel) {
    //   if (item.tags && item.tags.length) {
    //     return (
    //       <div className="icon tag" title="已打标签">
    //         <Icon component={TagMarkedIcon} />
    //       </div>
    //     );
    //   }
    //   return (
    //     <div className="icon tag">
    //       <span />
    //     </div>
    //   );
    // }
    return null;
  }

  return (
    <div
      className="question-tree-title-normal"
      style={style || {}}
      title={!(isKnowledge || isTopicModel) ? item.description : null}
    >
      {renderTagMarkInfo()}
      {renderTypeInfo()}
      {isKnowledge ? <span className="title-normal-knowledge">知</span> : null}
      {isTopicModel ? <span className="title-normal-model">模</span> : null}
      {title}
    </div>
  );
}

export const GraphKnowledgeTitle = tipDecorator(_GraphKnowledgeTitle);
