export function getUserPermissions(val) {
  return new Set([val]);
}

export function getTreeNodeInfo(treeNode) {
  return treeNode?.props?.item ?? undefined;
}

export function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

/**
 * @description:
 * @param {type}
 * @return:
 */
function parseModel(knowledge, level) {
  if (knowledge.questionModelList && knowledge.questionModelList.length > 0) {
    return knowledge.questionModelList.map((model, modelIndex) => {
      const newObj = { ...model };
      newObj.key = `${level}-${modelIndex}-${model.id}`;
      newObj.uniqId = `model-${model.id}`;
      newObj.isTopicModel = true;
      newObj.knowledgeId = knowledge.id;
      newObj.parentNode = knowledge;
      return newObj;
    });
  }
  return [];
}

function getNodeFromPosition(tree, pos) {
  const posArr = pos.split('-');
  const $index = posArr[posArr.length - 1];
  posArr.shift();

  let _posIndex = posArr.shift();
  let _node = tree[_posIndex];

  while (posArr.length > 0) {
    _posIndex = posArr.shift();
    _node = _node.childs[_posIndex];
  }

  return { node: _node, $index };
}

/**
 * @description:
 * @param {type}
 * @return:
 */
function parseKnowledge(tree, deep, level) {
  // 0: all 1:folder 2: knowledge 3: model
  if (tree.knowledges && tree.knowledges.length > 0) {
    return tree.knowledges.map((knowledge, $index) => {
      const newObj = {
        ...knowledge,
      };
      newObj.key = `${level}-${$index}-${knowledge.id}`;
      newObj.uniqId = `knowledge-${knowledge.id}`;
      newObj.isKnowledge = true;
      newObj.parentNode = tree;
      if (deep === 3 || deep === 0) {
        newObj.childs = parseModel(newObj, level + 1);
      }
      newObj.questionModelList = null;
      return newObj;
    });
  }
  return [];
}

/**
 * @description:
 * @param {tree} 树数据
 * @param {level} 节点层级
 * @return: 带key和节点层级以及 节点区分的数据
 */
function _traverseTree(tree, deep = 0, level = 0, root = null) {
  // deep: show how much level of tree, 0[default]: all 1:folder 2: knowledge 3: model
  if (!Array.isArray(tree)) return []
  return tree.map((item, $index) => {
    const newObj = {
      ...item,
      uniqId: `folder-${item.id}`,
      childs: [],
      isFolder: true,
    };
    newObj.key = `${level}-${$index}-${item.id}`;
    newObj.parentNode = root;
    if (item.childs && item.childs.length > 0) {
      newObj.childs = _traverseTree(item.childs, deep, level + 1, newObj);
    }
    if (deep !== 1) {
      newObj.childs = newObj.childs.concat(parseKnowledge(newObj, deep, level + 1));
    }
    newObj.knowledges = null;
    return newObj;
  });
}

export const traverseTree = _traverseTree;
/*

  {
    id: 1,
    name: '1级分类',
    children: [],
    knowledge: [],
  },
*/
function _traverseChapterTree(tree, deep = 0, level = 0, root = null) {
  // tree:  your tree list data
  // deep: show level count 0: all 1:folder 2: knowledge 3: model
  return tree.map((item, $index) => {
    const _item = { ...item, childs: [] };
    _item.key = `${level}-${$index}-${item.id}`;
    _item.isLibrary = true;
    _item.parentNode = root;
    if (item.childs && item.childs.length > 0) {
      _item.childs = _traverseChapterTree(item.childs, deep, level + 1, _item);
    }
    if (item.knowledges && item.knowledges.length > 0 && deep !== 1) {
      _item.childs = _item.childs.concat(parseKnowledge(item, deep, level + 1));
      _item.knowledges = null;
    }
    return _item;
  });
}

export const traverseChapterTree = _traverseChapterTree;

function _genKnowledgeList(data) {
  const dataList = [];
  const generateList = newData => {
    for (let i = 0; i < newData.length; i += 1) {
      const node = newData[i];
      // const item = _.pick(node, ['key', 'name', 'id', 'type', 'parentNode', 'uniqId', 'childs']);
      dataList.push(node);
      if (node.childs) {
        generateList(node.childs);
      }
    }
  };
  generateList(data);
  return dataList;
}

export const genKnowledgeList = _genKnowledgeList;

/**

/*
PARSING(1,"解析中"), PARSE_COMPLETED_NEED_DISTRIBUTION(2,"解析完成待分配"),
    PARSE_FAILED(3,"解析失败"), IN_PARSE_QUEUE(4,"排队解析中"),
    RENOUNCED(5,"已放弃"), IN_STORAGE(6, "已入库"),
    AUTO_CONVERSION(7,"自动转化结果"), AUTO_CONVERSION_RESULT(8, "自动转化结果审核"),
    FINALLY_REVIEW(9, "终审"),DIFFICUT_MODEL(10, "难度题模");
*/

export function combQuestionModel(params) {
  const { displayMainModel, displayMinorModel } = params;
  const targetList = displayMinorModel.map(model => {
    model.isPrimary = 0;
    return model;
  });
  if (displayMainModel.length === 1) {
    displayMainModel[0].isPrimary = 1;
    targetList.unshift(displayMainModel[0]);
  }
  return targetList;
}

export function renameFolder(params) {
  const { data, info } = params;
  const pos = info.pos ? info.pos : info.props.pos;
  const curNode = getNodeFromPosition(data, pos).node;
  curNode.isEdit = true;
}

export function createFolder(params, type) {
  const { data, info, expandedKeys } = params;
  const pos = info.pos ? info.pos : info.props.pos;
  const cur = getNodeFromPosition(data, pos);
  const curNode = cur.node;
  if (!expandedKeys.some(k => k === curNode.key)) {
    expandedKeys.push(curNode.key);
  }
  const targetItem = {
    name: type ? '新建分类' : '新建文件夹',
    key: `new-${curNode.key}`,
    isEdit: true,
    parentNode: curNode,
    id: -1,
  };
  if (type) {
    targetItem.level = curNode.level + 1;
    targetItem.isLibrary = true;
  }
  if (curNode.childs) {
    curNode.childs.push(targetItem);
  } else {
    curNode.childs = [targetItem];
  }
}

export function opKnowledge(params) {
  const { formModal, info, key } = params;
  formModal.show = true;
  formModal.title = key === 'createKnowledge' ? '新建知识点' : '编辑知识点';
  formModal.nodeInfo = info;
}

export function opKnowSchema(params) {
  const { tag, bookVersions, knowledgeSchema } = params;
  knowledgeSchema.map(o => {
    if (o.key === 'examination') {
      o.ext.options = tag
        .filter(t => t.tag === 0)
        .map(t => {
          t.name = t.tagName;
          return t;
        });
      o.ext.options.unshift({ id: 0, name: '请选择' });
    }
    if (o.key === 'bookVersions') {
      o.ext.options = bookVersions.filter(b => b);
    }
    return o;
  });
}

let lastPosition;
export function scrollElement(element, container) {
  if (lastPosition === container.scrollTop) {
    lastPosition = undefined;
    return;
  }
  const elementPosition = element.getBoundingClientRect();
  const containerPosition = container.getBoundingClientRect();
  lastPosition = container.scrollTop;
  const diff = elementPosition.top - containerPosition.top;
  let speed = Math.abs(diff) / 2;
  if (speed < 10) {
    speed = 10;
  }
  if (Math.abs(diff) <= 10) {
    container.scrollBy(0, diff);
    lastPosition = undefined;
    return;
  }
  if (elementPosition.top - containerPosition.top > 0) {
    container.scrollBy(0, speed);
  } else if (elementPosition.top - containerPosition.top < 0) {
    container.scrollBy(0, -speed);
  }
  window.requestAnimationFrame(scrollElement.bind(this, element, container));
}

export function topicType(key) {
  if (key) {
    return returnMap(
      {
        '-1': '暂无',
        '0': '暂无',
        '1': '选择题',
        '2': '填空题',
        '3': '判断题',
        '4': '解答题',
        '5': '综合题',
        '6': '完形填空',
        '7': '阅读理解',
        '8': '跟读单词题',
        '9': '跟读句子题',
        '10': '跟读短文题',
        '11': '英语多空题',
        '12': '绘本阅读',
        '13': '选词填空-选择',
        '14': '选词填空-填空',
        '15': '补全篇章',
        '16': '连线题',
        '17': '连词成句',
        '18': '跟读文章题',
      },
      key,
    );
  }
  return '暂无';
}

export function getParentKey(key, tree) {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.childs) {
      if (node.childs.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.childs)) {
        parentKey = getParentKey(key, node.childs);
      }
    }
  }
  return parentKey;
}

export function sortFn(params) {
  const { actionType, curIndex, sourceList, sortKey } = params;
  const al = [...sourceList];
  if (actionType === 'up') {
    al.splice(curIndex - 1, 0, al[curIndex]);
    al.splice(curIndex + 1, 1);
  }
  if (actionType === 'down') {
    al.splice(curIndex + 2, 0, al[curIndex]);
    al.splice(curIndex, 1);
  }
  al.map((a, aIndex) => {
    a[sortKey] = aIndex + 1;
    return a;
  })
  return al;
}
// 获取的不是数组，则返回空数组
export function getArray(value) {
  return Array.isArray(value) ? value : [];
}
