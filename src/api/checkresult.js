import request from '@/utils/request'
const group_name = 'center'
const api_name = 'checkresult'
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
  findAllByAssetportId(assetportId) {
    return request({
      url: `/${group_name}/${api_name}/assetport/${assetportId}`,
      method: 'get'
    })
  },
  findByIds(ids) {
    return request({
      url: `/${group_name}/${api_name}/ids`,
      method: 'post',
      data: ids
    })
  },
  findAllByAssetportIds(assetportIds) {
    return request({
      url: `/${group_name}/${api_name}/assetportids/${assetportIds}`,
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
