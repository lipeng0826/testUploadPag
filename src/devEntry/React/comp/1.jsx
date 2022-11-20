import React, { useRef } from "react";
import { Button } from "antd";
import { KnowledgeTree } from "../../../index.jsx";

const TestDemo = (props) => {
  const onSelect = (selectedKeys, node, { selected }, filterConditions) => {
    // 1.如果选择了某个内容，那么清空其他树的选项
    console.log(
      selectedKeys,
      node,
      { selected },
      filterConditions,
      "selectedKeys, node, { selected }, filterConditions"
    );
    if (selected) {
    }
    props.onSelect &&
      props.onSelect(selectedKeys, node, { selected }, filterConditions);
  };
  const knowledgeRef = useRef(() => {});
  const lessonRef = useRef(() => {});

  const removeSelect = () => {
    knowledgeRef.current();
  };
  const removeSelect2 = () => {
    lessonRef.current();
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ width: 300 }}>
          <Button onClick={removeSelect}>清空选中</Button>
          <KnowledgeTree
            scrollHeight={300}
            subjectProductId={7}
            onSelect={onSelect}
            forwardRef={knowledgeRef}
            showReviewModel={0}
            placeholder="输入名称或ID搜索"
            selectNode={["knowledge", "model"]}
            needExpandCallBack={false}
          ></KnowledgeTree>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ width: 300 }}>
            {/* <Button onClick={removeSelect2}>清空选中</Button> */}
            {/* <LessonTree
              lessonRef={lessonRef}
              multiple={false}
              subjectProductId={7}
              lessonList={[]}
              onSelect={onSelect}
            ></LessonTree> */}
          </div>
        </div>
      </div>
      {/* <div style={{height: 200, background: '#ccc', marginBottom: 200}}>
      </div> */}
      <div>
        {/* <Demo2 /> */}
      </div>
      {/* <div style={{height: 200, background: '#ccc', marginTop: 200}}>
      </div> */}
      <div>
        {/* <Demo3 /> */}
      </div>
    </div>
  );
};

export default TestDemo;
