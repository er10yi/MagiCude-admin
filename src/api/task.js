import request from '@/utils/request'
const group_name = 'center'
const api_name = 'task'
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
  findSearch(searchMap) {
    return request({
      url: `/${group_name}/${api_name}/search`,
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
  executeTask(id) {
    return request({
      url: `/${group_name}/${api_name}/execute/${id}`,
      method: 'get'
    })
  },
  executeCheck(id) {
    return request({
      url: `/${group_name}/${api_name}/execute/check/${id}`,
      method: 'get'
    })
  },
  stopTask(id) {
    return request({
      url: `/${group_name}/${api_name}/stop/${id}`,
      method: 'get'
    })
  },
  repeatTask(id) {
    return request({
      url: `/${group_name}/${api_name}/repeat/${id}`,
      method: 'get'
    })
  },
  stopScheduleTask(id) {
    return request({
      url: `/${group_name}/${api_name}/schedule/${id}`,
      method: 'delete'
    })
  },
  getTaskStatus(id) {
    return request({
      url: `/${group_name}/${api_name}/status/${id}`,
      method: 'get'
    })
  },
  deleteTaskCache(id) { // 删除任务cache
    return request({
      url: `/${group_name}/${api_name}/cache/${id}`,
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
