import request from '@/utils/request'
const group_name = 'center'
const api_name = 'char'
export default {
  findIpPortCount() {
    return request({
      url: `/${group_name}/${api_name}/ipportcount`,
      method: 'get'
    })
  },
  findIpPortCountOnline() {
    return request({
      url: `/${group_name}/${api_name}/ipportcountonline`,
      method: 'get'
    })
  },

  findServiceCount() {
    return request({
      url: `/${group_name}/${api_name}/servicecount`,
      method: 'get'
    })
  },

  findServiceCountOnline() {
    return request({
      url: `/${group_name}/${api_name}/servicecountonline`,
      method: 'get'
    })
  },

  findVersionCount() {
    return request({
      url: `/${group_name}/${api_name}/versioncount`,
      method: 'get'
    })
  },

  findVersionCountOnline() {
    return request({
      url: `/${group_name}/${api_name}/versioncountonline`,
      method: 'get'
    })
  },

  findWebinfoServerCount() {
    return request({
      url: `/${group_name}/${api_name}/webinfoservercount`,
      method: 'get'
    })
  },

  findRiskPortCount() {
    return request({
      url: `/${group_name}/${api_name}/riskportcount`,
      method: 'get'
    })
  },

  findRiskPortCountOnline() {
    return request({
      url: `/${group_name}/${api_name}/riskportcountonline`,
      method: 'get'
    })
  },

  findRiskServiceCount() {
    return request({
      url: `/${group_name}/${api_name}/riskservicecount`,
      method: 'get'
    })
  },

  findRiskServiceCountOnline() {
    return request({
      url: `/${group_name}/${api_name}/riskservicecountonline`,
      method: 'get'
    })
  },

  findRiskVersionCount() {
    return request({
      url: `/${group_name}/${api_name}/riskversioncount`,
      method: 'get'
    })
  },

  findRiskVersionCountOnline() {
    return request({
      url: `/${group_name}/${api_name}/riskversioncountonline`,
      method: 'get'
    })
  },
  findRiskCount() {
    return request({
      url: `/${group_name}/${api_name}/riskcount`,
      method: 'get'
    })
  },
  findRiskCountOnline() {
    return request({
      url: `/${group_name}/${api_name}/riskcountonline`,
      method: 'get'
    })
  },
  findRiskVulnCount() {
    return request({
      url: `/${group_name}/${api_name}/riskvulncount`,
      method: 'get'
    })
  },
  findRiskVulnCountOnline() {
    return request({
      url: `/${group_name}/${api_name}/riskvulncountonline`,
      method: 'get'
    })
  },
  findAllStatistics() {
    return request({
      url: `/${group_name}/${api_name}/statistics`,
      method: 'get'
    })
  }
}
