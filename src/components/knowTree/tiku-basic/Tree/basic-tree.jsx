import React, { Component } from 'react';
import { Tree, Empty } from 'antd';
import { Input } from 'antd';
import './basic-tree.less';

export default class BasicTree extends Component {
  render() {
    const {
      data,
      placeholder = '输入要搜索的内容',
      onSearch,
      scrollHeight,
      emptyTip,
      ...rest
    } = this.props;
    const afterScrollHeight = scrollHeight - 32;
    const isInvalidVal = isNaN(afterScrollHeight);
    let sH = null;
    if (!isInvalidVal) {
      sH = afterScrollHeight;
    }
    if (!data || data.length === 0) {
      return (
        <div className="tiku-tree-empty">
          <Empty description={emptyTip || '暂无数据'} />
        </div>
      );
    }
    return (
      <div className="question-query-tree">
        {onSearch && (
          <div style={{ padding: '0 3px', position: 'absolute', width: '100%' }}>
            <Input.Search placeholder={placeholder} onSearch={onSearch} />
          </div>
        )}
        <div
          style={
            sH
              ? {
                  height: sH,
                  marginTop: 35,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }
              : { marginTop: 35 }
          }
        >
          {/* TODO: 使用自定义icon有点问题，后续修改 */}
          {/* <Tree {...rest} switcherIcon={<Icon component={SwitchIcon} />} blockNode> */}
          <Tree {...rest} blockNode>
            {this.renderTreeNode(data, true)}
          </Tree>
        </div>
      </div>
    );
  }
}
