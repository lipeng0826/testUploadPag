import React, { useEffect, useState } from 'react';
import { Tree, message } from 'antd';
import { getListCourseInfoByCondition, listLessonListByClassType } from '@/services/gameList';
import { CaretDownOutlined } from '@ant-design/icons';
import "./index.less"
const SearchLesson = props => {
  const [treeData, setTreeData] = useState([]);
  const { subjectProductId, multiple, lessonSearchObj, selectedKeys, setSelectedKeys } = props;
  useEffect(() => {
    // 没有数据不请求接口
    if (!lessonSearchObj.gradeId) {
      return
    }
    setTreeData([]);
    // 查询班型列表
    let pramas = {
      subjectProductId: subjectProductId, // 学科
      schemeId: lessonSearchObj.schemeId, // 体系
      bookVersionId: lessonSearchObj.bookVersionId, // 版本
      gradeId: lessonSearchObj.gradeId, // 年级
      periodId: lessonSearchObj.periodId, // 学期
      courseCategoryId: lessonSearchObj.courseCategoryId, // 课程类型
    };
    getListCourseInfoByCondition(pramas).then(res => {
      res.data?.forEach(i => {
        i.key = i.classTypeId + '';
        i.title = i.courseName;
        i.isLeaf = false; // 不设置 当没有子节点的时候 会显示为线 而不是展开按钮
      });
      setTreeData(res.data);
    });
  }, [props.lessonSearchObj]);

  // 通过班型获取讲次列表
  const onLoadData = ({ key, children, courseName }) =>
    new Promise(resolve => {
      if (children) {
        resolve();
        return;
      }
      listLessonListByClassType({ classTypeId: key }).then(res => {
        res.data.forEach(i => {
          i.key = i.lessonId + '';
          i.title = i.lessonName;
          i.courseName = courseName;
          i.isLeaf = true;
        });
        setTreeData(origin => updateTreeData(origin, key, res.data));
        resolve();
      });
    });
  // 获取树节点
  const updateTreeData = (list, key, children) =>
    list.map(node => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });

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
    <div className='question-query-tree lesson-select-tree-tree'>
      {
        treeData.length > 0 ?
          <Tree
            selectedKeys={selectedKeys}
            multiple={multiple}
            treeData={treeData}
            showLine={false}
            showIcon={true}
            loadData={onLoadData}
            switcherIcon={<CaretDownOutlined />}
            onSelect={onSelect}
          />
          :
          <div style={{ textAlign: 'center', color: '#595959', marginTop: 10 }}> 暂无数据</div>
      }
    </div>
  );
};

export default SearchLesson;
