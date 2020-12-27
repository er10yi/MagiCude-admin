import request from '@/utils/request'
const group_name = 'center'
const api_name = 'vulnpluginconfig'
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
  findByPluginId(pluginId) {
    return request({
      url: `/${group_name}/${api_name}/plugin/${pluginId}`,
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
  deleteByPluginId(pluginId) {
    return request({
      url: `/${group_name}/${api_name}/plugin/${pluginId}`,
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
  deleteByPluginIdVulnId(pluginId, vulnId) {
    return request({
      url: `/${group_name}/${api_name}/plugin/${pluginId}/${vulnId}`,
      method: 'delete'
    })
  }

}
