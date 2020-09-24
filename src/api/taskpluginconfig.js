import request from '@/utils/request'
const group_name = 'center'
const api_name = 'taskpluginconfig'
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
  },
  findAllByTaskid(id) {
    return request({
      url: `/${group_name}/${api_name}/task/${id}`,
      method: 'get'
    })
  },
  addAllByIds(ids) {
    return request({
      url: `/${group_name}/${api_name}/plugin/ids`,
      method: 'post',
      data: ids
    })
  },
  deleteAllByTaskId(id) {
    return request({
      url: `/${group_name}/${api_name}/task/${id}`,
      method: 'delete'
    })
  },
  deleteAllIds(ids) {
    return request({
      url: `/${group_name}/${api_name}/task/ids`,
      method: 'post',
      data: ids
    })
  }
}
