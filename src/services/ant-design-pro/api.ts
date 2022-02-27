// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

const accessTokenKey = "accessToken";

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept':'application/json',
  'Authorization': 'Bearer ' + localStorage.getItem(accessTokenKey)
})

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/profile', {
    method: 'GET',
    headers: getHeaders(),
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<any>('/api/logout', {
    method: 'POST',
    headers: getHeaders(),
    ...(options || {}),
  })
  .then(data=>{
    if(data) {
      localStorage.removeItem(accessTokenKey);
      return { data, success: true };
    }
  })
  .catch(ex=>{
    console.log(ex);
    localStorage.removeItem(accessTokenKey);
  });
}

/** 登录接口 POST /api/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<any>('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept':'application/json',
    },
    data: body,
    ...(options || {skipErrorHandler: true}),
  })
  .then(data=>{
    window.localStorage.setItem(accessTokenKey, data.access_token);
    return <API.LoginResult> {...data, "status": "ok", "type": "account", "currentAuthority": "admin" };
  })
  .catch(ex=>{
    console.log(ex);
    localStorage.removeItem(accessTokenKey);
  });

}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
