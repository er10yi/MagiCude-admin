import request from '@/utils/request'
const group_name = 'center'

export default {
  uploadIpAndPort(form) {
    return request({
      url: `/${group_name}/assetip/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadIpAndHostname(form) {
    return request({
      url: `/${group_name}/host/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadVulnCategory(form) {
    return request({
      url: `/${group_name}/vuln/category`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadPluginConfig(form) {
    return request({
      url: `/${group_name}/pluginconfig/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },

  uploadSelfdPluginConfig(form) {
    return request({
      url: `/${group_name}/pluginconfig/batchAddSelfd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadVulnDetail(form) {
    return request({
      url: `/${group_name}/vuln/detail`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadIpAndPortWhitelist(form) {
    return request({
      url: `/${group_name}/ipwhitelist/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  batchUpdateIpAndPortWhitelist() {
    return request({
      url: `/${group_name}/ipwhitelist/batchUpdate`,
      method: 'get'
    })
  },
  uploadProjectinfoAndPortWhitelist(form) {
    return request({
      url: `/${group_name}/projectinfo/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  batchUpdateProjectinfoAndPortWhitelist() {
    return request({
      url: `/${group_name}/projectinfo/batchUpdate`,
      method: 'get'
    })
  },
  uploadUa(form) {
    return request({
      url: `/${group_name}/useragent/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadDomainwhitelist(form) {
    return request({
      url: `/${group_name}/domainwhitelist/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadTitlewhitelist(form) {
    return request({
      url: `/${group_name}/titlewhitelist/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadRiskport(form) {
    return request({
      url: `/${group_name}/riskport/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadRiskservice(form) {
    return request({
      url: `/${group_name}/riskservice/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadRiskversion(form) {
    return request({
      url: `/${group_name}/riskversion/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadDeptprocon(form) {
    return request({
      url: `/${group_name}/department/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadProjectinfoIp(form) {
    return request({
      url: `/${group_name}/assetip/projectinfoip/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadDictUsername(form) {
    return request({
      url: `/${group_name}/dictionaryusername/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  },
  uploadDictPassword(form) {
    return request({
      url: `/${group_name}/dictionarypassword/batchAdd`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form
    })
  }
}
