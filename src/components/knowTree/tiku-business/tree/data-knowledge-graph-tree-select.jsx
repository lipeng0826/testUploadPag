// import PropTypes from 'prop-types';
import React from 'react';
import { Spin } from 'antd';
import KnowledgeTree from './knowledge-tree.jsx';
import { fixedParams } from '../../tree-a/constant.js';
import { traverseWholeTree } from '../../tree-a/filter.js';
import { treeFetch } from '../../../../services/game/index.ts';

import './tree.less';

function noop() { }
export default class KnowledgeTreeWithDataGraph extends React.Component {
  constructor(props) {
    super(props);
    const { subjectProductId, showReviewModel, forwardRef, defaultSelectedKeys } = props;
    this.state = {
      forwardRef,
      selectedKeys: [...defaultSelectedKeys],
      expandedKeys: [],
      data: [],
      searchValue: '',
      autoExpandParent: true,
      loading: false,
      subjectProductId,
      showReviewModel,
      multipleList: [],
    };
    this.flag = false;
    this.tempExpandKey = [];
  }

  static defaultProps = {
    multiple: false,
    onSelect: noop,
    showTopicModel: true,
    draggable: false,
    style: {},
    selectNode: ['knowledge', 'model'],
    treeSource: 'knowledge-graph',
  };

  deleteSelected(id) {
    const { selectedKeys } = this.state
    this.setState({
      selectedKeys: selectedKeys.filter(item => item != id),
    });
  }

  componentDidMount() {
    // const { forwardRef } = this.state;
    // forwardRef &&
    //   forwardRef.current &&
    //   (forwardRef.current = () => {
    //     this.deleteSelected();
    //   });
    this.props.onRef(this)
    const { subjectProductId, showReviewModel } = this.state;
    this.getKnowledgeData(subjectProductId, showReviewModel);
  }

  componentWillReceiveProps(nextProps) {
    const { subjectProductId, showReviewModel } = this.props;
    if (
      nextProps.subjectProductId !== subjectProductId ||
      nextProps.showReviewModel !== showReviewModel
    ) {
      this.getKnowledgeData(nextProps.subjectProductId, nextProps.showReviewModel);
    }
  }

  // 组装search数据
  packageSearchList(data) {
    const dataList = [];
    // 组装search数据
    const generateList = (data) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        const description = node.description;
        dataList.push({ key, title: key, description });
        if (node.childs) {
          generateList(node.childs);
        }
      }
    };
    generateList(data);
    return dataList;
  }

  // 获得默认第一个知识点
  getFirstKnowledge(data) {
    let firstKnowledge;
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      if (node.isKnowledge) {
        firstKnowledge = node;
        break;
      } else if (
        !firstKnowledge &&
        node.childs &&
        node.childs.length > 0 &&
        this.getFirstKnowledge(node.childs)
      ) {
        firstKnowledge = this.getFirstKnowledge(node.childs);
        break;
      }
    }
    return firstKnowledge;
  }

  // 获得传入知识点
  getReciveKnowledge(id, data) {
    let firstKnowledge;
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      if (node.id === id) {
        firstKnowledge = node;
        break;
      } else if (
        !firstKnowledge &&
        node.childs &&
        node.childs.length > 0 &&
        this.getReciveKnowledge(id, node.childs)
      ) {
        firstKnowledge = this.getReciveKnowledge(id, node.childs);
        break;
      }
    }
    return firstKnowledge;
  }

  // 获得知识点数据
  async getKnowledgeData(subjectProductId, showReviewModel = 0) {
    this.setState({ loading: true });
    await treeFetch({
      subjectProductId,
      showReviewModel,
      convertStructure: 1,
      source: 1,
      ...fixedParams,
      isOriginalData: true,
    }).then((ret) => {
      const data = traverseWholeTree(ret.body || [], 0);
      this.setState({ data });
      this.setState({ loading: false });
    });
  }

  onExpand = (expandedKeys, { expanded, node }) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
    this.tempExpandKey = expandedKeys
    this.props.onExpand && this.props.onExpand(node);
  };

  onSelect = (selectedKeyList, info) => {
    const { multiple, onSelect, treeSource, selectNode, needExpandCallBack = false } = this.props;
    const nodeSet = new Set(selectNode);
    let curNode = '';
    if (info.node.props.isTopicModel) {
      curNode = 'model';
    } else if (info.node.props.isKnowledge) {
      curNode = 'knowledge';
    } else {
      curNode = 'folder';
    }
    const d = Object.assign({}, info.node.props, { treeSource });
    const restParams = {};
    if (nodeSet.has(curNode)) {
      // 知识点，题模选中
      this.setState(({ selectedKeys, multipleList }) => {
        if (!multiple) {
          selectedKeys = [...selectedKeyList];
        } else {
          const has = selectedKeys.some((s) => s === d.eventKey);
          if (has) {
            selectedKeys = selectedKeys.filter((s) => s !== d.eventKey);
            multipleList = multipleList.filter((m) => m.eventKey !== d.eventKey);
          } else {
            selectedKeys.push(d.eventKey);
            multipleList.push(d);
          }
          restParams.list = multipleList;
        }
        d['data-use'].description = d['data-use'].name;
        onSelect && onSelect(selectedKeys, d, info, restParams);
        return { selectedKeys: [...selectedKeys], multipleList: [...multipleList] };
      });
    } else {
      // 文件夹 展开
      for (let i = 0; i < this.tempExpandKey.length; i++) {
        if (this.tempExpandKey[i] === selectedKeyList[0]) {
          this.tempExpandKey.splice(i, 1);
          i--;
          this.flag = true;
        }
      }
      if (!this.flag) {
        this.tempExpandKey = this.tempExpandKey.concat(selectedKeyList);
      }
      this.setState(
        {
          expandedKeys: this.tempExpandKey,
          autoExpandParent: false,
        },
        () => {
          needExpandCallBack && onSelect && onSelect([...selectedKeyList], d, info, restParams);
        },
      );
      this.flag = false;
    }
  };

  onSearch = (val) => {
    const { data } = this.state;
    const value = val.trim();
    let expandedKeys = [];
    if (value) {
      const generateList = (data) => {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          if (node.description.indexOf(value) > -1 || node.id == value) {
            getOriginParentKey(expandedKeys, node);
          }
          if (node.childs) {
            generateList(node.childs);
          }
        }
      };
      generateList(data);
    }
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: false,
    });
    this.tempExpandKey = [...new Set(this.tempExpandKey.concat(expandedKeys))];
  };

  render() {
    const { style, scrollHeight, showTopicModel, multiple, placeholder } = this.props;
    const { data, expandedKeys, autoExpandParent, selectedKeys, loading, searchValue } = this.state;
    return (
      <Spin spinning={loading} style={{ height: '100%' }}>
        <div style={style} className="tiku-data-tree data-tree-graph">
          <KnowledgeTree
            // className="diy-knowledge-tree"
            expandedKeys={expandedKeys}
            onExpand={this.onExpand}
            onSelect={this.onSelect}
            onSearch={this.onSearch}
            placeholder={placeholder}
            autoExpandParent={autoExpandParent}
            selectedKeys={selectedKeys}
            // loadData={this.onLoadData}
            data={data}
            scrollHeight={scrollHeight}
            searchValue={searchValue}
            showTopicModel={showTopicModel}
            multiple={multiple}
            labelKey="name"
            titleType="graph"
          />
        </div>
      </Spin>
    );
  }
}

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.childs) {
      if (node.childs.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.childs)) {
        parentKey = getParentKey(key, node.childs);
      }
    }
  }
  return parentKey;
};
const getOriginParentKey = (expandKeys, item) => {
  if (item.parent && expandKeys.indexOf(item.parent.key) == -1) {
    expandKeys.push(item.parent.key);
    getOriginParentKey(expandKeys, item.parent);
  }
};
