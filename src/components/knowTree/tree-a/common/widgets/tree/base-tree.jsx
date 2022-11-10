import PropTypes from 'prop-types';
import React from 'react';
import { Tree, Icon } from 'diy-ui';
import TreeSwitcherIcon from 'tikuKnowledge/common/widgets/svg/tree-switcher-icon';
import { TreeContext } from './node-title';
import './node-title.less';

export default class BaseTree extends React.Component {
  treeContextValue = {};

  constructor(props) {
    super(props);
    this.treeContextValue = {
      onItemEdit: props.handleItemEdit,
      handleOperation: props.handleOperation,
    };
  }

  render() {
    const { data, ...otherProps } = this.props;
    return (
      <TreeContext.Provider value={this.treeContextValue}>
        {data && data.length ? (
          <Tree
            {...otherProps}
            switcherIcon={<Icon component={TreeSwitcherIcon} />}
            className="custom-tree"
            blockNode
          >
            {this.renderTreeNode(data)}
          </Tree>
        ) : (
          this.renderEmpty()
        )}
      </TreeContext.Provider>
    );
  }
}

BaseTree.propTypes = {
  data: PropTypes.any,
  handleItemEdit: PropTypes.any,
  handleOperation: PropTypes.any,
}
