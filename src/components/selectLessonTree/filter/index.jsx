import React, { useEffect, useState } from 'react';
import { Radio, message } from 'antd';
import { getDictionary } from '../../../services/gameList';
import './index.less';

let originData = {};

const searchConfig = [
  {
    id: 'gradeId',
    label: '年级',
    dic: 'gradeDic',
  },
  {
    id: 'bookVersionId',
    label: '版本',
    dic: 'bookVersionDic',
  },
  {
    id: 'schemeId',
    label: '体系',
    dic: 'schemeDic',
  },
  {
    id: 'periodId',
    label: '学期',
    dic: 'periodDic',
  },
  {
    id: 'courseCategoryId',
    label: '课程类型',
    dic: 'courseCategoryDic',
  },
];
/**
 * @query
 * **/
const SearchLesson = props => {
  const { subjectProductId } = props
  const [dicData, setDicData] = useState({}); // 字典
  const [searchInfo, setSearchInfo] = useState({
    subjectProductId: subjectProductId, // 学科
    gradeId: '',
    bookVersionId: '',
    periodId: '',
    courseCategoryId: '',
    schemeId: '',
  });
  useEffect(() => {
    getDictionary().then(res => {
      if (res.status !== 0) {
        message.error(res.errorMessage);
        return;
      }
      const data = res.data;
      originData = JSON.parse(JSON.stringify(data));
      // 根据学科设置对应的体系
      data.schemeDic = originData.schemeDicMap[subjectProductId]; // 根据学科设置对应的体系
      initSearchValue(data);
      setDicData(data);
    });
  }, []);

  const initSearchValue = (result) => {
    let temp = {};
    searchConfig.forEach(({ id, dic }) => {
      temp[id] = result[dic][0].id;
    });
    const newData = { ...searchInfo, ...temp };
    setSearchInfo(newData);
    props.onSearchChange && props.onSearchChange(newData);
  };

  const handleChange = (id, e) => {
    const newData = {
      ...searchInfo,
      [id]: e.target.value,
    };
    setSearchInfo(newData);
    props.onSearchChange && props.onSearchChange(newData);
  };

  const renderItems = (label, id, data) => {
    return (
      <>
        {data.length > 0 && (
          <div className="interact-create-lesson-select-chapter-filter">
            <div className="chapter-filter-label">{label}: </div>
            <div className="chapter-filter-widget">
              <Radio.Group size='small' defaultValue={data[0].id} onChange={e => handleChange(id, e)}>
                {data.map((i, index) => (
                  <Radio.Button value={i.id} key={i.id + '_' + Math.random()}>
                    {i.name}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>
        )}
      </>
    );
  };

  return <div>{searchConfig.map(i => dicData[i.dic] && renderItems(i.label, i.id, dicData[i.dic]))}</div>;
};

export default SearchLesson;
