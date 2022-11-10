import React from 'react'
import { Icon, message } from 'antd'
// import {editLockPost, editLockDel} from 'apis'

const editLockDel = () => { };
const editLockPost = () => { };

// 转换树的的数据
export function traverseTree(data, level = 0, parent = null) {
  data.forEach((item, index) => {
    item.key = `${level}-${index}`
    item.parent = parent
    if (item.fileType === 3) {
      item.isLeaf = true
    }
    item.children && traverseTree(item.children, item.key, item)
  })
  return data
}

export function traverseWholeTree(data, level = 0, parent = null) {
  const afterData = Array.isArray(data) ? data : [];
  afterData.forEach((item, index) => {
    // 优化: item的key使用的是知识点和题模的id
    if (item.isKnowledge || item.isTopicModel) {
      item.key = item.id + ''
    } else {
      item.key = `${level}-${index}`
    }
    item.parent = parent;
    item.description = item.name;
    if (item.knowledges && item.knowledges.length > 0) {
      item.knowledges.forEach((knowledge, $index) => {
        knowledge.isKnowledge = true;
        knowledge.description = knowledge.name;
        if (knowledge.questionModelList) {
          knowledge.questionModelList.forEach((modelItem) => {
            modelItem.description = modelItem.name;
            modelItem.isTopicModel = true;
            if (!knowledge.childs) {
              knowledge.childs = [];
            }
            knowledge.childs.push(modelItem);
          })
        }
        item.childs.push(knowledge)
      })
      item.knowledges = null
    }
    item.childs && traverseWholeTree(item.childs, item.key, item)
  })
  return afterData;
}

export function traverseKnowledgeTree(data, level = 0, parent = null) {
  data.forEach((item, index) => {
    item.key = `${level}-${index}`
    item.parent = parent
    if (item.knowledges && item.knowledges.length > 0) {
      item.knowledges.forEach((knowledge, $index) => {
        knowledge.isKnowledge = true
        item.childs.push(knowledge)
      })
      item.knowledges = null
    }
    item.childs && traverseKnowledgeTree(item.childs, item.key, item)
  })
  return data
}

export function traverseChapterTree(data, level = 0, parent = null) {
  data.forEach((item, index) => {
    item.key = `${level}-${index}`
    item.parent = parent
    item.childs && traverseChapterTree(item.childs, item.key, item)
  })
  return data
}

export function traverseModel(data, level, parent) {
  data.forEach((item, index) => {
    item.key = `${level}-${index}`
    if (parent) {
      item.parent = parent
    }
    item.isTopicModel = true
  })
  return data
}

export function traverseNumber(num) {
  let chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  let chnUnitSection = ['', '万', '亿', '万亿', '亿亿']
  let chnUnitChar = ['', '十', '百', '千']

  function NumberToChinese(section) {
    let strIns = ''; let
      chnStr = '';
    let unitPos = 0;
    let zero = true;
    while (section > 0) {
      let v = section % 10;
      if (v === 0) {
        if (!zero) {
          zero = true;
          chnStr = chnNumChar[v] + chnStr;
        }
      } else {
        zero = false;
        strIns = chnNumChar[v];
        strIns += chnUnitChar[unitPos];
        chnStr = strIns + chnStr;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }
    return chnStr;
  }

  return NumberToChinese(num)
}

export function getPaperSet(paperSet) {
  // 得到试卷类型的名字
  const getType = (type) => {
    let typeName = ''
    GLOBAL_DATA.examAreaType.forEach(((value) => {
      if (value.dictionaryId === type) {
        typeName = value.name
      }
    }))
    return typeName
  }
  // 获取套卷属性 年 省市区 学校 学期 试卷类型等
  const year = paperSet && paperSet[0] && paperSet[0].year && paperSet[0].year != -1 ? `${paperSet[0].year}年` : ''
  const province = paperSet && paperSet[0] && paperSet[0].provinceName ? paperSet[0].provinceName : ''
  const city = paperSet && paperSet[0] && paperSet[0].cityName ? paperSet[0].cityName : ''
  const school = paperSet && paperSet[0] && paperSet[0].school ? paperSet[0].school : ''
  const type = paperSet && paperSet[0] && paperSet[0].type ? getType(paperSet[0].type) : ''
  const spliceStr = `${year + province + city + school + type}`
  return paperSet && paperSet[0] && spliceStr
    ? <span style={{ marginLeft: 10 }}>{`(${spliceStr})`}</span>
    : null;
  /*
  return paperSet && paperSet[0] && <span style={{marginLeft: 10}}>{`(${year + province + city + school + type})`}</span>
  */
}

export function burialPoint(pad, uid = window.GLOBAL_DATA.userId) { // institutionId
  let burialPointDiv = document.getElementById('maidian_page')
  burialPointDiv.dataset.uid = uid;
  burialPointDiv.dataset.pad = pad;
  window.TrackerUtil && setTimeout(() => {
    window.TrackerUtil.send_track(burialPointDiv)
  }, 0)
}

export const editLock = {
  lock: {
    type: '',
    lessonId: '',
    target: '',
    stateValue: '',
    documentClick: '',
  },
  jsonMerge(json) {
    for (const key in json) {
      this.lock[key] = json[key]
    }
  },
  judgeType(type) {
    let judgeTypeVal = ''
    let typeNum = type / 1;
    switch (typeNum) {
      case 1:
        judgeTypeVal = '讲义'
        break;
      case 2:
        judgeTypeVal = '教材'
        break;
      case 3:
        judgeTypeVal = '自我巩固'
        break;
      case 4:
        judgeTypeVal = '课堂落实'
        break;
      case 5:
        judgeTypeVal = '试卷'
        break;
      case 6:
        judgeTypeVal = '精选精练'
        break;
    }
    return judgeTypeVal
  },
  getEditLock() {
    const { lessonId, type } = this.lock;
    editLockPost && editLockPost({
      lessonId,
      type,
      expire: 1800,
    }).then((result) => {
      if (result.body && result.body.body && result.body.body.status == 2) {
        // 如果已经被占用则添加一个弹窗
        this.lock.target.setState({
          [this.lock.stateValue]: <div style={{
            position: 'absolute',
            zIndex: '98',
            background: ' rgba(245,245,245,0.65) ',
            width: '100%',
            height: '100%',
          }}
          >
            <div style={{
              width: '480px',
              margin: '150px auto',
              background: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '5px',
              overflow: 'hidden',
              fontSize: '18px',
            }}
            >
              <Icon
                style={{
                  float: 'left', margin: '28px 38px', fontSize: '50px', color: '#C9C9C9',
                }}
                type="exclamation-circle"
              />
              <div style={{
                float: 'left',
                margin: '28px 0',
                width: '340px',
                overflow: 'hidden',
              }}
              >
                {`教研员${result.body.body.userName}正在编辑本讲次的${this.judgeType(type)}，请去编辑其他内容。`}
              </div>
            </div>
          </div>,
        })
      } else if (result.body && result.body.body && result.body.body.status == 3) {
        this.lock.target.setState({
          [this.lock.stateValue]: '',
        })
      } else {
        this.lock.target.setState({
          [this.lock.stateValue]: '',
        })
      }
    })
  },
  delEditLock() {
    const { lessonId, type } = this.lock;
    editLockDel && editLockDel.delete({
      lessonId,
      type,
    }).then((result) => {
      if (result.body && result.body.status == 1) {
        this.lock.target.setState({
          [this.lock.stateValue]: '',
        })
      }
    })
  },
  on(target, stateValue, type, lessonId) {
    // let controlSwitch = false;
    let time = 600000;
    let timeClick = () => {
      window[`lockTime${type}`] = window.setTimeout(() => {
        // 运行一个计时器并挂载到window上 名字为 lockTime+'key'方便外部调用清除 ，用来在时间结束的时候添加添加一次点击事件

        // 向document添加一个点击事件
        /* eslint-disable-next-line */
        document.addEventListener('click', documentClick, true, { once: true })
      }, time)
    }
    let documentClick = (e) => {
      this.getEditLock()

      // 先清除一次事件绑定
      document.removeEventListener('click', documentClick, true)
      // 定时器
      timeClick()
      // 捕获阻止
      e.stopImmediatePropagation()
    }
    this.jsonMerge({
      target, stateValue, type, lessonId, documentClick,
    })
    // 定时器
    timeClick()
    this.getEditLock()
  },
  off() {
    const { documentClick, type } = this.lock;
    // 执行解锁
    this.delEditLock()
    document.removeEventListener('click', documentClick, true)
    window.clearTimeout(window[`lockTime${type}`])
  },
}
export const lectureTypeNode = (tag) => {
  const basicStyle = {
    marginLeft: '13px',
    display: 'inline-block',
    fontSize: '12px',
    fontFamily: 'PingFangSC-Regular',
    width: '40px',
    textAlign: 'center',
    borderRadius: '3px',
    verticalAlign: 'middle',
    lineHeight: '24px',
  }
  const exciserStyle = {
    color: '#DF9B69',
    background: '#FCEBD2',
  }
  const midStyle = {
    color: '#34ABEA',
    background: '#D6EEFB',
  }
  const finalStyle = {
    color: '#DF9B69',
    background: '#FCEBD2',

  }
  switch (tag) {
    case 0:
      return null
    case 1:
      return <span style={{ ...basicStyle, ...midStyle }}>期中</span>
    case 2:
      return <span style={{ ...basicStyle, ...finalStyle }}>期末</span>
    case 3:
      return <span style={{ ...basicStyle, ...exciserStyle }}>习题</span>
    default:
      return null
  }
}

export function TransFormationTimeStamp(dataTime) {
  let date = new Date(dataTime);
  let Y = `${date.getFullYear()}-`;
  let M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
  let D = `${date.getDate()} `;
  let h = `${date.getHours()}:`;
  let m = `${date.getMinutes()}:`;
  let s = date.getSeconds()

  return (Y + M + D + h + m + s);
}
export function getCustomPrintSubject(id) {
  switch (id) {
    case 7:
    case 11:
    case 13:
    case 30:
    case 31:
    case 32:
      return true
    default:
      return false
  } // 初中高中数理化带精选精练
}

export function autoRedirect(errorCode) {
  let tips = '登录失效';
  if (errorCode === 100300002) {
    tips = '账号在其他地方登录'
  }
  if (errorCode === 100300003) {
    tips = 'token不合法'
  }
  const hide = message.loading(`${tips}`, 0);
  setTimeout(() => {
    hide();
    window.location.href = '//www.aixuexi.com'; // TODO 放开
  }, 5000);
}

export function getKAPaperSet(data) {
  let {
    year, provinceName, cityName, school, typeName,
  } = data;
  year = year !== -1 && year ? `${year}年` : '';
  provinceName = typeof provinceName === 'string' ? provinceName : '';
  cityName = typeof cityName === 'string' ? cityName : '';
  typeName = typeof typeName === 'string' ? typeName : '';
  const spliceStr = `${year + provinceName + cityName + school + typeName}`;
  return spliceStr
    ? <span style={{ color: '#A3B3C2' }}>{`（${spliceStr}）`}</span>
    : null;
}

export function filterEmptyParam(params) {
  const target = {};
  for (const key in params) {
    if (Object.prototype.isPrototypeOf.call(params, key)) {
      const cur = params[key];
      if (cur !== null && cur !== '') {
        target[key] = cur;
      }
    }
  }
  return target;
}

export const subjectNames = {
  2: 'math',
  5: 'phy',
  6: 'chem',
}

export function headMatchPaperSet(question, matchValue) {
  if ('district' in matchValue || 'city' in matchValue || 'province' in matchValue) {
    if (question.paperSet && question.paperSet.length > 1) {
      const { district: d, city: c, province: p } = matchValue;
      const target = d || (c || p);
      const targetKey = d ? 'district' : (c ? 'city' : 'province');
      const l = [];
      question.paperSet.reduce((prev, next) => {
        if (next[targetKey] === target) {
          prev.unshift(next)
          return prev;
        }
        prev.push(next);
        return prev
      }, l)
      question.paperSet = [...l];
    }
  }
}
