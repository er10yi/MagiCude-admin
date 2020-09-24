import request from '@/utils/request'
const group_name = 'center'
const api_name = 'user'
export default {
  getList() {
    return request({
      url: `/${group_name}/${api_name}`,
      method: 'get'
    })
  },
  search(page, size, searchMap) {
    return request({
      url: `/${group_name}/${api_name}/search/${page}/${size}`,
      method: 'post',
      data: searchMap
    })
  },
  save(pojo) {
    return request({
      url: `/${group_name}/${api_name}`,
      method: 'post',
      data: pojo
    })
  },
  findById(id) {
    return request({
      url: `/${group_name}/${api_name}/${id}`,
      method: 'get'
    })
  },
  update(id, pojo) {
    if (id === null || id === '') {
      return this.save(pojo)
    }
    return request({
      url: `/${group_name}/${api_name}/${id}`,
      method: 'put',
      data: pojo
    })
  },
  deleteById(id) {
    return request({
      url: `/${group_name}/${api_name}/${id}`,
      method: 'delete'
    })
  },
  deleteAllByIds(ids) {
    return request({
      url: `/${group_name}/${api_name}/deleteids`,
      method: 'post',
      data: ids
    })
  }

}

export function login(data) {
  return request({
    url: `/${group_name}/user/login`,
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `/${group_name}/user/info`,
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: `/${group_name}/user/logout`,
    method: 'post'
  })
}
