import request from 'umi-request';

const filter = (url) => {
  const domain = url.split('?')[0]; // domain = "https://example.com"
  const queries = url.split('?')[1].split('&'); // 获取所有的参数键值对
  // 对参数键值对进行过滤，把value为空的参数键值对过滤掉，然后用 & 拼接
  return domain + '?' + queries.filter((item) => item.split('=')[1] != '').join('&');
};

// 获取模板列表数据
export async function treeFetch(params) {
  return request(`/tiku/jtdirectory/getDiretoryKnowledgeTree`, {
    method: 'POST',
    data: params,
  });
}

// 获取游戏列表接口
export async function gameListFetch(params) {
  const {
    subjectId = '', // 学科id
    topicType = '',
    status = '',
    knowledgeIds = '',
    questionModelIds = '',
    id = '',
    name = '',
    classTypeId = '',
    lessonId = '',
    startTime = '',
    endTime = '',
    source = '',
    pageSize = '',
    pageNum = '',
    creator = '',
  } = params;

  const url = `/api/slideGame/game/listV2?pageSize=${pageSize}&pageNo=${pageNum}&subjectProductId=${subjectId}&topicType=${topicType}&status=${status}&knowledgeIds=${knowledgeIds}&questionModelIds=${questionModelIds}&name=${name}&classTypeId=${classTypeId}&lessonId=${lessonId}&startTime=${startTime}&endTime=${endTime}&source=${source}&id=${id}&creator=${creator}`;
  return request(
    filter(url),
    // `/api/slideGame/game/listV2?pageSize=20&pageNo=1&subjectProductId=7&source=admin`,
    {
      method: 'GET',
      data: {},
    },
  );
}

// 互动游戏上下架接口
export async function gameUpdateStatus(params) {
  return request(`/api/slideGame/game/${params.uri}/status/${params.status}`, {
    method: 'PUT',
    data: {},
  });
}

// 互动游戏复制接口
// https://yapi.aixuexi.com/project/923/interface/api/197726
export async function copyGame(params) {
  return request(`/api/slideGame/game/${params.uri}/copyGame`, {
    method: 'POST',
    data: {},
  });
}

// 互动游戏新增接口
// https://yapi.aixuexi.com/project/923/interface/api/197717
export async function addGameFetch(params) {
  return request(`/api/slideGame/game/gameProfile`, {
    method: 'POST',
    data: params,
  });
}

// 获取互动游戏by URI
// https://yapi.aixuexi.com/project/923/interface/api/197723
export async function getGameFetch(params) {
  return request(`/api/slideGame/game/gameProfile/${params.uri}`, {
    method: 'GET',
    data: {},
  });
}

// 互动游戏编辑接口
// https://yapi.aixuexi.com/project/923/interface/api/197720
export async function editGameFetch(params) {
  return request(`/api/slideGame/game/gameProfile/${params.uri}`, {
    method: 'PUT',
    data: params,
  });
}

// 课程讲次树筛选接口
// https://yapi.aixuexi.com/project/923/interface/api/197729
export async function getLessonTreeList(params) {
  return request(`/api/slideGame/admin/courseLessonDictionary`, {
    method: 'GET',
    data: {},
  });
}

// 课程讲次树筛选接口
// https://yapi.aixuexi.com/project/923/interface/api/197729
export async function getLessonTreeClassList(params) {
  return request(
    `/api/slideGame/admin/courseList?subjectProductId=${params.subjectProductId}&gradeId=${params.gradeId}&bookVersionId=${params.bookVersionId}&schemeId=${params.schemeId}&periodId=${params.periodId}&courseCategoryId=${params.courseCategoryId}`,
    {
      method: 'GET',
      data: {},
    },
  );
}

// 课程讲次树筛选接口
// https://yapi.aixuexi.com/project/923/interface/api/197735
export async function getLessonTreeLessonList(params) {
  return request(`/api/slideGame/admin/lessonList?classTypeId=${params.classTypeId}`, {
    method: 'GET',
    data: {},
  });
}
