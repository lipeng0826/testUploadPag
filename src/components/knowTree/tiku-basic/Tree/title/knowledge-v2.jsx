import React from 'react';

import './knowledge-title.less';

export function NormalKnowledgeTitle(props) {
  const { style, title, item } = props;
  const { isKnowledge, isTopicModel } = item;
  return (
    <div className="question-tree-title-normal" style={style || {}} title={item.description}>
      {isKnowledge ? <span className="title-normal-knowledge">知</span> : null}
      {isTopicModel ? <span className="title-normal-model">模</span> : null}
      {title}
    </div>
  );
}
