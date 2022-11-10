import request from 'umi-request';

const filter = (url: string) => {
  const domain = url.split('?')[0]; // domain = "https://example.com"
  const queries = url.split('?')[1].split('&'); // 获取所有的参数键值对
  // 对参数键值对进行过滤，把value为空的参数键值对过滤掉，然后用 & 拼接
  return domain + '?' + queries.filter((item) => item.split('=')[1] != '').join('&');
};

// 课程讲次树筛选接口
// https://yapi.aixuexi.com/project/923/interface/api/197729
export async function getDictionary(params: any) {
  return request(`/api/slideGame/admin/courseLessonDictionary`, {
    method: 'GET',
    data: {},
  });
}

// 课程讲次树-获取班型列表
// https://yapi.aixuexi.com/project/923/interface/api/197729
export async function getListCourseInfoByCondition(params: any) {
  const {
    subjectProductId = '',
    gradeId = '',
    bookVersionId = '',
    schemeId = '',
    periodId = '',
    courseCategoryId = '',
  } = params;

  const url = `/api/slideGame/admin/courseList?subjectProductId=${subjectProductId}&gradeId=${gradeId}&bookVersionId=${bookVersionId}&schemeId=${schemeId}&periodId=${periodId}&courseCategoryId=${courseCategoryId}`;

  return request(filter(url), {
    method: 'GET',
    data: {},
  });
}

// 课程讲次树-获取讲次列表
// https://yapi.aixuexi.com/project/923/interface/api/197735
export async function listLessonListByClassType(params: any) {
  return request(`/api/slideGame/admin/lessonList?classTypeId=${params.classTypeId}`, {
    method: 'GET',
    data: {},
  });
}
