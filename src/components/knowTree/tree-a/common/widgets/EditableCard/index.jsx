import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Icon, Empty } from 'diy-ui';
import ModalSelect from 'tikuKnowledge/model-select'
import PropTypes from 'prop-types';
import storage from 'apis/storage';
import './index.less'

const subjectProductId = Number(storage.getSubjectId());

const EditableCard = (props) => {
  const { data, onChange } = props
  const [innerData, setInnerData] = useState(Array.from(data))
  const [selectVisible, setSelectVisible] = useState(false)

  useEffect(() => {
    onChange(innerData)
    console.debug('innder data is:', innerData)
  }, [innerData])

  const handleModelDelete = (item, index, parentIndex) => {
    const temp = Array.from(innerData).filter(i => i.id !== item.id)
    setInnerData(temp)
  }

  const handleShowTree = () => {
    setSelectVisible(true)
  }

  const handleResetData = (data) => {
    setInnerData(data)
    setSelectVisible(false)
  }

  const clear = () => {
    setInnerData([])
  }

  const packageData = () => {
    const data = innerData.reduce((acc, cur, idx, source) => {
      const target = acc.find(i => i.id === cur.knowledgeId)
      if (target) {
        target.modelList.push({
          id: cur.id,
          name: cur.name,
        });
      } else {
        acc.push({
          id: cur.knowledgeId,
          name: cur.knowledgeName,
          modelList: [{
            id: cur.id,
            name: cur.name,
          }],
        })
      }
      return acc
    }, [])

    return data
  }
  return (
    <div className="editable-card">
      <p className="opration-line">
        请设置该知识元需要关联的题模：<Button type="link" onClick={handleShowTree}>请选择</Button><Button type="link" onClick={clear}>全部清除</Button>
      </p>
      <Row gutter={24} className="show-area">
        {packageData()?.length > 0 ? packageData().map((i, pIdx) => (
          <Col span={24} key={i.id}>
            <Card title={i.name} bordered={false}>
              {i?.modelList?.map((m, idx) => (
                <span key={m.id} className="model-item">
                  <span>{m.name}</span>
                  <Icon type="close" onClick={handleModelDelete.bind(this, m, idx, pIdx)} />
                </span>
              ))}
            </Card>
          </Col>
        )) : <Empty />}
      </Row>
      <ModalSelect subjectProductId={subjectProductId} visible={selectVisible} data={innerData} onCancel={() => setSelectVisible(false)} onOk={handleResetData} />
    </div>
  )
}

EditableCard.propTypes = {
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func,
};

EditableCard.defaultProps = {
  data: [],
  onChange: () => { },
};

export default EditableCard
