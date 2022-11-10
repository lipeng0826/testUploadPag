import React, { useCallback, useEffect, useState } from 'react';
import { Radio, message, Popover, Button, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
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
const SearchLesson = (props) => {
  const { subjectProductId } = props;
  const [dicData, setDicData] = useState({}); // 字典
  const [searchInfo, setSearchInfo] = useState({
    // 搜索数据
    subjectProductId: subjectProductId, // 学科
    gradeId: '',
    bookVersionId: '',
    periodId: '',
    courseCategoryId: '',
    schemeId: '',
  });
  const [tempSearch, setTempSearch] = useState({
    // 临时修改的数据
    subjectProductId: subjectProductId, // 学科
    gradeId: '',
    bookVersionId: '',
    periodId: '',
    courseCategoryId: '',
    schemeId: '',
  });
  const [isChange, setIsChange] = useState(false);
  useEffect(() => {
    // 1.获取字典数据
    getDictionary().then((res) => {
      const { data, status } = res;
      if (status !== 0) {
        message.error(res.errorMessage);
        return;
      }
      originData = JSON.parse(JSON.stringify(data));
      data.schemeDic = originData.schemeDicMap[subjectProductId]; // 根据学科设置对应的体系
      // data.bookVersionDic = originData.bookVersionDic.filter(item => item.name.length < 20); // 根据学科设置对应的体系
      initSearchValue(data);
      setDicData(data);
    });
  }, []);

  const initSearchValue = (result) => {
    let temp = {};
    searchConfig.forEach(({ id, dic }) => {
      temp[id] = result[dic][0].id;
    });
    const newData = { ...tempSearch, ...temp };
    setSearchInfo(newData);
    setTempSearch(newData);
    props.onSearchChange && props.onSearchChange(newData);
  };

  const handleChange = (id, e) => {
    const newData = {
      ...tempSearch,
      [id]: e.target.value,
    };
    setTempSearch(newData);
  };

  const renderItems = (label, id, data) => {
    return (
      <>
        {data.length > 0 && (
          // <div className='searchItemWap'>
          //   <div className='itemL'>{label}: </div>
          //   <div className='itemR'>
          <div className='chapter-filter-item'>
            <div className='chapter-filter-label'>{label}: </div>
            <div className='chapter-filter-widget'>
              <Radio.Group
                size="small"
                value={tempSearch[id]}
                onChange={(e) => handleChange(id, e)}
                buttonStyle="solid"
              >
                {data.map((i) => (
                  <Radio.Button value={i.id} key={i.id} className='btn'>
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

  const onCancel = () => {
    setTempSearch({ ...searchInfo });
    setIsChange(false);
  };

  const onOk = () => {
    const { onSearchChange } = props;
    setSearchInfo({ ...tempSearch });
    onSearchChange && onSearchChange(tempSearch);
    setIsChange(false);
  };

  const handleVisibleChange = (value) => {
    if (!value) {
      setTempSearch({ ...searchInfo });
    }
    setIsChange(value);
  };

  const getName = useCallback(
    (type, id) => {
      const info = dicData[type]?.find((item) => item.id === id);
      return info?.name || '';
    },
    [dicData],
  );

  const renderMonitor = useCallback(
    () => (
      <div className="chapter-bread">
        {searchInfo.gradeId ? (
          <>
            <span className="text">
              {getName('gradeDic', searchInfo.gradeId)}&nbsp;
              {getName('bookVersionDic', searchInfo.bookVersionId)}&nbsp;
              {getName('schemeDic', searchInfo.schemeId)}&nbsp;
              {getName('periodDic', searchInfo.periodId)}&nbsp;
              {getName('courseCategoryDic', searchInfo.courseCategoryId)}
            </span>
            <DownOutlined />
          </>
        ) : (
          <Spin />
        )}
      </div>
    ),
    [searchInfo, dicData],
  );

  return (
    <div className="chapter-tree-filter">
      <Popover
        overlayClassName="lesson-tree-filter-pop-container"
        visible={isChange}
        onVisibleChange={handleVisibleChange}
        placement="bottomLeft"
        trigger="hover"
        // trigger="click"
        content={
          <div className="lesson-tree-filter">
            <div className="select-radio-item">
              {searchConfig.map(
                (i) => dicData[i.dic] && renderItems(i.label, i.id, dicData[i.dic]),
              )}
            </div>
            <div className="btn" style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 10 }} size="small" onClick={onCancel}>
                取消
              </Button>
              <Button type="primary" size="small" onClick={onOk}>
                确认
              </Button>
            </div>
          </div>
        }
      >
        {renderMonitor()}
      </Popover>
    </div>
  );
};

export default SearchLesson;
