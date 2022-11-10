import React from 'react';
import { Row, Empty, notification } from 'diy-ui';
import { modelDetailConfig } from 'tikuKnowledge/common/constant';

export function renderEmpty({ title }) {
  return (
    <Row type="flex" style={{ height: '100%' }} align="middle" justify="center">
      <Empty
        image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
        description={title}
      />
    </Row>
  )
}

export function renderModelDetail(model) {
  const _renderDetail = (val) => {
    return val ? val : '--';
  }
  return modelDetailConfig.map(item => {
    const k = item.key;
    const kValue = model[k];
    return (
      <div key={item.key} className="detail-item">
        <div className="detail-item-label">{item.label}</div>
        <div className="detail-item-value">{item.render ? item.render(kValue) : _renderDetail(kValue)}</div>
      </div>
    );
  })
}

export function renderAPIFail(error) {
  const { errorCode, errorMessage } = error;
  notification.error({
    message: '出错啦！',
    description: errorMessage,
  });
}
