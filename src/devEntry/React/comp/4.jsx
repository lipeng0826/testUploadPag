import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { BindLessonFilter, BindLessonTree } from "../../../index.jsx";
import './4.less'

const LessonSelect = (props) => {
  const [allLesson, setAllLesson] = useState([]) // 选中的讲次列表
  const [expandedKeys, setExpandedKeys] = useState([]) // 选中的讲次列表
  const [lessonSearchObj, setLessonSearchObj] = useState({});
  // 筛选项切换查询讲次树
  const onSearchChange = payload => {
    setLessonSearchObj(payload);
  };

  // 删除选中的列表
  const removeSelect = (lessonId) => {
    setAllLesson(allLesson.filter(item => item.lessonId != lessonId))
  }

  const onExpand = (expandedKeys) => setExpandedKeys(expandedKeys);

  // 选择
  const onSelect = (selectedKeys, { selected, selectedNodes, node, event }) => {
    // 1.如果点击的是课程，没反应
    if (!node.isLeaf) {
      if (expandedKeys.includes(node.key)) {
        setExpandedKeys(expandedKeys.filter(item => item !== node.key))
      } else {
        setExpandedKeys([...new Set([...expandedKeys, node.key])])
      }
      return
    }
    // 2.如果点击其他区域选中和非选中
    // console.log(selectedKeys, selected, selectedNodes, node, event, 'selected, selectedNodes, node, event');
    const { classTypeId, lessonId, lessonName, courseName } = node
    console.log(classTypeId, lessonId, lessonName, 'classTypeId, lessonId, lessonName');
    if (selected) {
      setAllLesson(allLesson.concat([{ classTypeId, lessonId, lessonName, courseName }]))
    } else {
      removeSelect(lessonId)
    }
  };


  // 选中列表
  const rModelBoxContent = models => {
    if (models.length <= 0) {
      return null;
    }
    return models.map(item => (
      <div className="model-item" key={item.lessonId}>
        {item.lessonName} <CloseOutlined onClick={() => removeSelect(item.lessonId)} />
      </div>
    ));
  };

  return (
    <div className='game-lesson-select-wrapper' style={{ height: 'calc(100vh - 200px)', overflow: 'auto', display: 'flex', width: 1200}}>
        <div className='left' style={{ flex: 1}}>
          <BindLessonFilter onSearchChange={onSearchChange} subjectProductId={7} />
          <BindLessonTree
              multiple
              allLesson={allLesson}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              subjectProductId={7}
              lessonSearchObj={lessonSearchObj}
              onSelect={onSelect}
            />
        </div>
        <div className="list" style={{width: 350}}>
          <h3>
            讲次篮(已选择{allLesson.length}个)
          </h3>
          <div>{rModelBoxContent(allLesson)}</div>
        </div>
      </div>
  );
};

export default LessonSelect;
