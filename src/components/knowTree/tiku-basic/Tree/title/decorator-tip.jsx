import React from 'react';
import { Popover } from 'antd';

export default function tipDecorator(Title) {
  const render = function TitleWithTip(props) {
    const { item } = props;
    const { isKnowledge, isTopicModel, attr } = item;

    // const content = React.createElement(Title, props);
    // const content = <Title {...props} />
    const content = Title(props);
    if (isKnowledge || isTopicModel) {
      let tipContent = null;
      if (isKnowledge) {
        tipContent = (
          <>
            <p>{item.description || item.name}</p>
            <p>
              <label>认知难度属性：</label>
              {item.sceneName ? <span>{item.sceneName}</span> : null}
            </p>
            <p>
              <label>所属知识模块：</label>
              {item.knowledgeModuleName ? <span>{item.knowledgeModuleName}</span> : null}
            </p>
          </>
        );
      } else {
        tipContent = (
          <>
            <p>{item.description || item.name}</p>
            <p>
              <label>认知难度属性：</label>
              {item.studentLevelName ? <span>{item.studentLevelName}</span> : null}
            </p>
            <p>
              <label>是否易错：</label>
              {item.fallibleName ? <span>{item.fallibleName}</span> : null}
            </p>
            <p>
              <label>重要程度：</label>
              {item.extentName ? <span>{item.extentName}</span> : null}
            </p>
            <p>
              <label>标签名称：</label>
              {item.tags && item.tags.length ? (
                <span>{item.tags.map((t) => t.name).join('; ')}</span>
              ) : (
                '--'
              )}
            </p>
          </>
        );
      }
      return (
        // <Popover
        //   bgtype="white"
        //   overlayStyle={{ zIndex: 10000 }}
        //   placement="bottom"
        //   content={<div className="tree-node-tip">{tipContent}</div>}
        //   trigger="hover"
        //   mouseEnterDelay={0.6}
        // >
        //   {content}
        // </Popover>
        <span>{content}</span>
      );
    }

    return content;
  };

  return render;
}
