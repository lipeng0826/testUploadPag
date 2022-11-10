import React, { useEffect, useState } from 'react';
import Select from './filter';
import LessonTree from './tree/index.js';
import './lessonSelect.less';

const LessonSelect = (props) => {
  const { lessonList, subjectProductId, multiple, lessonRef } = props;
  const [lessonSearchObj, setLessonSearchObj] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    lessonRef.current = () => {
      setSelectedKeys([])
    }
  }, [])
  
  // 筛选项切换查询讲次树
  const onSearchChange = (payload) => {
    setLessonSearchObj(payload);
  };

  // 点击讲次树查询互动
  const onLessonSelect = (payload) => {
    console.log('onLessonSelect', payload);
  };

  // 选择
  const onSelect = (selectedKeys, { selected, selectedNodes, node, event }) => {
    // console.log(selectedKeys, selected, selectedNodes, node, event, 'selected, selectedNodes, node, event');
      setSelectedKeys(selectedKeys)
      let updateNode = {};
    // 点击课程
    if (!node.isLeaf) {
      const { classTypeId, courseName } = node
      updateNode = {classTypeId, courseName, type: 3 }
      console.log(updateNode, 'updateNode-course');
    } else {
      // 点击讲次
      const { classTypeId, lessonId, lessonName, courseName } = node;
      updateNode = {classTypeId, lessonId, lessonName, courseName, type: 4}
      console.log(updateNode, 'updateNode-lessson');
    }
    props.onSelect(selectedKeys, updateNode, { selected }, undefined, selected)
  };

  return (
    <>
      <div className="game-select-lesson-wrapper">
        <div className="left">
          <div className="filter">
            <Select onSearchChange={onSearchChange} subjectProductId={subjectProductId} />
          </div>
          <div className="question-query-tree tree">
            <LessonTree
              selectedKeys={selectedKeys}
              lessonRef={lessonRef}
              multiple={multiple}
              subjectProductId={subjectProductId}
              lessonSearchObj={lessonSearchObj}
              onLessonSelect={onLessonSelect}
              onSelect={onSelect}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonSelect;
