import request from '@/utils/request'
const group_name = 'center'
const api_name = 'url'
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
  findByWebinfoids(webinfoids) {
    return request({
      url: `/${group_name}/${api_name}/links`,
      method: 'post',
      data: webinfoids
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
  findAllByWebinfoId(webinfoid) {
    return request({
      url: `/${group_name}/${api_name}/webinfo/${webinfoid}`,
      method: 'get'
    })
  },
  findAllByWebinfoIds(webinfoids) {
    return request({
      url: `/${group_name}/${api_name}/webinfo`,
      method: 'post',
      data: webinfoids
    })
  },
  findAllByWebinfoIds2Port(webinfoids) {
    return request({
      url: `/${group_name}/${api_name}/webinfoids2port`,
      method: 'post',
      data: webinfoids
    })
  },
  findLinksByWebinfoId(webinfoid) {
    return request({
      url: `/${group_name}/${api_name}/links/${webinfoid}`,
      method: 'get'
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
