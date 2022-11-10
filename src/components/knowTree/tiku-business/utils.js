import apis from 'apis';
import { headMatchPaperSet } from 'filters';
import { getFilterSchema } from 'tikuBusiness/for-editor/utils';
// import questionList from '@/tiku-side/question-list.json'

export const tabProp = {
  topicLib: '试题',
  paperLib: '试卷',
  pieceLib: '教材碎片',
  // knowledge: '知识树',
  // chapter: '章节序',
}

export function getThisTabShow({ subjectProductId, tabType }) {
  const showPropType = ({}).toString.call(tabType);
  switch (showPropType) {
    case '[object Boolean]':
      return tabType;
    case '[object Array]':
      return tabType.some(item => item == subjectProductId);
    case '[object Function]':
      return tabType()
    default:
      break;
  }
}

export function paramFilter(params) {
  const paramKeys = Object.keys(params);
  const target = {};
  paramKeys.forEach(param => {
    const curVal = params[param];
    if (curVal !== null || typeof curVal !== 'undefined') {
      if (param === 'topicSource') {
        if (curVal) {
          if (curVal.province) {
            target.province = curVal.province;
            if (curVal.city) {
              target.city = curVal.city;
              if (curVal.district) {
                target.district = curVal.district;
              }
            }
          }
        }
      } else {
        if (curVal) {
          target[param] = curVal;
        }
      }
    }
  });
  return target;
}

export function concatModelList(vList) {
  const isFillArray = list => {
    return Array.isArray(list) && list.length > 0
  }
  let tempList = [];
  if (isFillArray(vList)) {
    vList.forEach(vItem => {
      if (isFillArray(vItem)) {
        const vItemIds = vItem.map(v => v.id);
        tempList.push.apply(tempList, vItemIds);
      }
    })
  }
  tempList = Array.from(new Set(tempList));
  return tempList;
}

export function formatFilterParams(filterParams) {
  const target = {};
  const filterParamsKeys = Object.keys(filterParams);
  filterParamsKeys.forEach(filterKey => {
    const curValue = filterParams[filterKey];
    if (filterKey === 'topicSource' && curValue) {
      const topicSourceKeys = Object.keys(curValue);
      topicSourceKeys.forEach(k => {
        const paramValue = curValue[k];
        target[k] = paramValue ? paramValue : '';
      })
    } else if (filterKey === 'difficulty') {
      if (curValue) {
        const diffVal = +curValue;
        target.questionDifficulty = diffVal;
        // target.minDifficulty = diffVal === 1 ? 0.1 : diffVal - 0.9;
      } else {
        // target.minDifficulty = '';
        target.questionDifficulty = '';
      }
    } else if (filterKey === 'types') { // 单个题型传过来是 number，需要转成数组
      if (curValue && !Array.isArray(curValue)) {
        target[filterKey] = [curValue];
      }
    } else {
      target[filterKey] = curValue;
    }
  })
  return target;
}

export function toBoxTop(ele, offset = 0) {
  const rectObj = ele.getBoundingClientRect();
  if (rectObj) {
    const { top } = rectObj;
    if (top < -200) {
      window.scrollBy(0, top - offset);
    }
  }
}

export function formatExamType(list = []) {
  const result = [];
  list.forEach(item => {
    const { id, name } = item;
    const cur = { id, key: id, name, value: name }
    if (item.examTypeList) {
      // 考试分类二层数据处理成 'id-childId' 结构
      cur.children = item.examTypeList.map(i => ({ key: `${cur.id}-${i.id}`, value: i.name }))
      cur.children.unshift({ key: cur.id, value: '全部' })
    }
    result.push(cur)
  });
  return result;
}

export function getQuestionList(queryParams, sortPaperSet, callbacks = {}) {
  const { onSuccess, onFailed } = callbacks;
  // return onSuccess(questionList.body); console.log('fetch questionList mock')
  queryParams.duplicateFlag = 1;
  apis.tiku.getTopicList(queryParams).then(res => {
    if (res.data.status === 1) {
      const { list, itemTotal } = res.data.body;
      if (sortPaperSet) {
        list.map(item => {
          headMatchPaperSet(item, queryParams);
          return item;
        })
      }
      onSuccess && onSuccess({ list, itemTotal, pageNum: queryParams.pageNum })
    } else {
      onFailed && onFailed();
    }
  }).catch(() => {
    onFailed && onFailed();
  })
}

const isEntityArray = list => Array.isArray(list) && list.length > 0;

export function onSelectKnowledgeTree(params = {}, callbacks = {}) {
  const { onSelect } = callbacks;
  const { selectedKeys, info, parentInfo } = params;
  const isSelected = selectedKeys.length === 1;
  if (!info || parentInfo && !parentInfo.selected) { // 获取不到节点
    onSelect({ knowledgeIds: '', topicModelListStr: '', pageNum: 1 })
    return;
  }
  if (!isSelected) { // 取消选中
    onSelect({ knowledgeIds: '', topicModelListStr: '', pageNum: 1 })
    return;
  }
  if (info.isKnowledge) { // 选中了知识点，需要额外查此知识点的关联知识点
    apis.tiku.knowledge.get({ id: info.id }).then(res => {
      if (res.data.status === 1) {
        const data = res.data.body;
        let knowledgeIds = [info.id];
        if (data.depend === 1 && data.dependKnowledgeIds) {
          // 此知识点有关联知识点，把此知识点和关联知识点下的题模查回来组合
          if (data.depend === 1 && data.dependKnowledgeIds) {
            const dependIds = isEntityArray(data.dependKnowledgeIds) ? data.dependKnowledgeIds : [];
            ([]).push.apply(knowledgeIds, dependIds);
          }
        }
        knowledgeIds = knowledgeIds.toString();
        onSelect({ knowledgeIds, topicModelListStr: '', pageNum: 1 })
      }
    })
  } else if (info.isTopicModel) { // 选中了题模
    onSelect({ topicModelListStr: `${info.id}`, knowledgeIds: '', pageNum: 1 });
  }
}

export function updateProps({ params, callType, origin }) {
  const paramKeys = Object.keys(params);
  const formatParams = {};
  if (callType === 'private') {
    // formatParams.originStr = origin;
    paramKeys.forEach(k => {
      const v = params[k];
      if (/origin/.test(k) === false) {
        if (k === 'ignoreTopicIds') {
          if (Array.isArray(v) && v.length > 0) {
            formatParams.ignoreTopicIds = v.join(',');
          }
        } else {
          if (v !== null && v !== '') {
            formatParams[k] = v;
          }
        }
      }
    })
  } else {
    // formatParams.originStr = '0,1,3';
    paramKeys.forEach(k => {
      if (k !== 'origin') {
        const v = params[k];
        if (k === 'ignoreTopicIds') {
          if (Array.isArray(v) && v.length > 0) {
            formatParams.ignoreTopicIds = v.join(',');
          }
        } else {
          if (v !== null && v !== '') {
            formatParams[k] = v;
          }
        }
      }
    })
  }
  return formatParams;
}

// 根据学科获取相关类型数据，进行 schema 合并，回调输出
export async function updateSubjectProduct(params, callbacks = {}) {
  const {
    subjectProductId, subjectId, limit, forType = 'page',
  } = params;
  const { onSuccess } = callbacks;
  // 获取现有 schema
  let tempSchema = await getFilterSchema({
    subjectProductId, subjectId, limit, forType,
  });
  Promise.all([
    apis.tiku.getExamData({ subjectProductId }),
    apis.tiku.getTagList({ subjectProductId }),
  ]).then(([res1, res2]) => {
    if (res1.data.status === 1) {
      const list = res1.data.body || [];
      // schema 合并
      if (list.length > 0) {
        const _list = formatExamType(list);
        tempSchema.find(i => i.key === 'examCategory').props.options.push(..._list)
      } else {
        tempSchema = tempSchema.filter(item => item.key !== 'examType');
      }
    }
    if (res2.data.status === 1) {
      const list = res2.data.body || [];
      // schema 合并
      if (list.length > 0) {
        const _list = [];
        list.forEach(l => {
          const { id, name } = l;
          const cur = { id, key: [id], name, value: name };
          _list.push(cur);
        })
        let resultList = _list;
        let tagInitValue = '';
        if (limit && limit.length) {
          const limitSet = new Set(limit);
          resultList = resultList.filter(r => limitSet.has(r.id));
          resultList.unshift({ id: -1, key: limit, name: '全部', value: '全部' });
          tagInitValue = limit;
        } else {
          resultList.unshift({ id: -1, key: '', name: '全部', value: '全部' });
        }
        const t = tempSchema.find(i => i.key === 'tags');
        if (t) {
          t.props.options = resultList;
          t.props.initValue = tagInitValue;
        }
      } else {
        tempSchema = tempSchema.filter(item => item.key !== 'examType');
      }
    }
    onSuccess && onSuccess({ schema: tempSchema })
  })
}
