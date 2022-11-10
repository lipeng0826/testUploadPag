import moment from 'moment';
import React from 'react'

const _categoryMap = new Map();
const categoryNames = ['单题题模', '梯子题模', '兄弟题模', '大招题模'];
categoryNames.forEach((item, index) => {
  _categoryMap.set(`${index + 1}`, { name: item });
})

export const categoryMap = _categoryMap;

export const knowledgeTypeAttr = ['', '新', '组'];

export const fixedParams = { type: 1 };

export const modelDetailConfig = [
  {
    key: 'name',
    label: '题模名称',
  },
  {
    key: 'id',
    label: '题模ID',
  },
  {
    key: 'categoryName',
    label: '题模关系',
  },
  {
    key: 'ladderSort',
    label: '梯子间前后续',
  },
  {
    key: 'studentLevelName',
    label: '认知难度属性',
  },
  {
    key: 'fallibleName',
    label: '是否易错',
  },
  {
    key: 'extentName',
    label: '重要程度',
  },
  {
    key: 'creatorName',
    label: '创建人',
    render: (val) => {
      return val ? val.split('@')[0] : '--';
    },
  },
  {
    key: 'createTime',
    label: '创建时间',
    render: (val) => {
      return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '--:--:--';
    },
  },
  {
    key: 'tags',
    label: '标签名称',
    render: (tags) => {
      return tags && tags.length ? tags.map(t => t.name).join('; ') : '--'
    },
  },
]
