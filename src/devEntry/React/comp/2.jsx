import React, { useEffect, useState } from 'react';
import { Button } from "antd"
import { SelectLessonFilter, SelectLessonTree } from "../../../index.js";
import './2.less';

const TestDemo = (props) => {
  const [lessonSearchObj, setLessonSearchObj] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);

  // 筛选项切换查询讲次树
  const onSearchChange = (payload) => {
    setLessonSearchObj(payload);
  };

  const onSelect = () => {
    console.log(11111);
  }

  const removeSelect2 = () => {
    setSelectedKeys([])
  }

  return (
    <>
      <Button onClick={removeSelect2}>清空选中</Button>
      <div className="game-select-lesson-wrapper" style={{width: 300}}>
        <div className="left">
          <SelectLessonFilter onSearchChange={onSearchChange} subjectProductId={7} />
          <div>
            <SelectLessonTree
              selectedKeys={selectedKeys}
              setSelectedKeys={setSelectedKeys}
              // lessonRef={lessonRef}
              multiple={false}
              subjectProductId={7}
              lessonSearchObj={lessonSearchObj}
              onSelect={onSelect}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TestDemo;
