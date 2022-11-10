import React, { useState } from "react";
import { Button, Modal, Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Select from "./filter";
import LessonTree from "./tree/index.js";
import "./lessonSelect.less";

const LessonSelect = (props) => {
  const {
    visible,
    updateVisible,
    updateSelected,
    lessonList,
    subjectProductId,
  } = props;
  const [allLesson, setAllLesson] = useState(lessonList); // 选中的讲次列表
  const [expandedKeys, setExpandedKeys] = useState([]); // 选中的讲次列表
  const [lessonSearchObj, setLessonSearchObj] = useState({});
  // 筛选项切换查询讲次树
  const onSearchChange = (payload) => {
    setLessonSearchObj(payload);
  };

  const onCancel = () => {
    updateVisible(false);
  };

  const onOk = () => {
    updateSelected(allLesson);
    onCancel();
  };

  // 删除选中的列表
  const removeSelect = (lessonId) => {
    setAllLesson(allLesson.filter((item) => item.lessonId != lessonId));
  };

  const onExpand = (expandedKeys) => setExpandedKeys(expandedKeys);

  // 选择
  const onSelect = (selectedKeys, { selected, selectedNodes, node, event }) => {
    // 1.如果点击的是课程，没反应
    if (!node.isLeaf) {
      if (expandedKeys.includes(node.key)) {
        setExpandedKeys(expandedKeys.filter((item) => item !== node.key));
      } else {
        setExpandedKeys([...new Set([...expandedKeys, node.key])]);
      }
      return;
    }
    // 2.如果点击其他区域选中和非选中
    // console.log(selectedKeys, selected, selectedNodes, node, event, 'selected, selectedNodes, node, event');
    const { classTypeId, lessonId, lessonName, courseName } = node;
    console.log(
      classTypeId,
      lessonId,
      lessonName,
      "classTypeId, lessonId, lessonName"
    );
    if (selected) {
      setAllLesson(
        allLesson.concat([{ classTypeId, lessonId, lessonName, courseName }])
      );
    } else {
      removeSelect(lessonId);
    }
  };

  // 选中列表
  const rModelBoxContent = (models) => {
    if (models.length <= 0) {
      return null;
    }
    return models.map((item) => (
      <div className="model-item" key={item.lessonId}>
        {item.lessonName}{" "}
        <CloseOutlined onClick={() => removeSelect(item.lessonId)} />
      </div>
    ));
  };

  return (
    <div>
      <div className="game-lesson-select-wrapper">
        <div className="question-query-tree filter">
          <Select
            onSearchChange={onSearchChange}
            subjectProductId={subjectProductId}
          />
        </div>
        <div className="question-query-tree tree">
          <LessonTree
            multiple
            allLesson={allLesson}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            subjectProductId={subjectProductId}
            lessonSearchObj={lessonSearchObj}
            onSelect={onSelect}
          />
        </div>

        <div className="list">
          <h3>讲次篮(已选择{allLesson.length}个)</h3>
          <div>{rModelBoxContent(allLesson)}</div>
        </div>
      </div>
    </div>
  );
};

export default LessonSelect;
