import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/char',
    component: Layout,
    redirect: '/char/table',
    name: 'Char',
    meta: { title: '统计', icon: 'example' },
    children: [
      { path: 'asset', name: 'asset', component: () => import('@/views/char/asset'), meta: { title: '资产', icon: 'table' }},
      { path: 'asset2', name: 'asset2', component: () => import('@/views/char/asset2'), meta: { title: '资产2', icon: 'table' }},
      { path: 'risk', name: 'risk', component: () => import('@/views/char/risk'), meta: { title: '高危', icon: 'table' }}

    ]
  },
  {
    path: '/project',
    component: Layout,
    redirect: '/project/table',
    name: 'Project',
    meta: { title: '任务信息', icon: 'example' },
    children: [
      { path: 'agent', name: 'agent', component: () => import('@/views/table/agent'), meta: { title: 'Agent', icon: 'table' }},
      { path: 'project', name: 'project', component: () => import('@/views/table/project'), meta: { title: '项目', icon: 'table' }},
      { path: 'task', name: 'task', component: () => import('@/views/table/task'), meta: { title: '任务', icon: 'table' }},
      { path: 'taskip', name: 'taskip', component: () => import('@/views/table/taskip'), meta: { title: '任务ip', icon: 'table' }},
      { path: 'taskport', name: 'taskport', component: () => import('@/views/table/taskport'), meta: { title: '任务端口', icon: 'table' }}
    ]
  },
  {
    path: '/asset',
    component: Layout,
    redirect: '/asset/table',
    name: 'Asset',
    meta: { title: '资产管理', icon: 'example' },
    children: [
      { path: 'assetip', name: 'assetip', component: () => import('@/views/table/assetip'), meta: { title: '资产ip', icon: 'table' }},
      { path: 'assetport', name: 'assetport', component: () => import('@/views/table/assetport'), meta: { title: '资产端口', icon: 'table' }},
      { path: 'host', name: 'host', component: () => import('@/views/table/host'), meta: { title: '主机', icon: 'table' }}
    ]
  },
  {
    path: '/checkresult',
    component: Layout,
    redirect: '/checkresult/table',
    name: 'Checkresult',
    meta: { title: '检测结果', icon: 'example' },
    children: [
      { path: 'checkresult', name: 'checkresult', component: () => import('@/views/table/checkresult'), meta: { title: '检测结果', icon: 'table' }},
      { path: 'webinfo', name: 'webinfo', component: () => import('@/views/table/webinfo'), meta: { title: 'web信息', icon: 'table' }},
      { path: 'webinfourl', name: 'webinfourl', component: () => import('@/views/table/webinfourl'), meta: { title: 'web信息和url', icon: 'table' }},
      { path: 'url', name: 'url', component: () => import('@/views/table/url'), meta: { title: 'url', icon: 'table' }},
      { path: 'checkresultVuln', name: 'checkresultVuln', component: () => import('@/views/table/checkresultVuln'), meta: { title: '检测结果漏洞关联', icon: 'table' }}
    ]
  },
  {
    path: '/base',
    component: Layout,
    redirect: '/base/table',
    name: 'Base',
    meta: { title: '联系信息管理', icon: 'example' },
    children: [
      { path: 'department', name: 'department', component: () => import('@/views/table/department'), meta: { title: '部门', icon: 'table' }},
      { path: 'contact', name: 'contact', component: () => import('@/views/table/contact'), meta: { title: '联系人', icon: 'table' }},
      { path: 'projectinfo', name: 'projectinfo', component: () => import('@/views/table/projectinfo'), meta: { title: '项目信息', icon: 'table' }},
      { path: 'contactProjectinfo', name: 'contactProjectinfo', component: () => import('@/views/table/contactProjectinfo'), meta: { title: '联系人项目信息关联', icon: 'table' }}
    ]
  },

  {
    path: '/config',
    component: Layout,
    redirect: '/config/table',
    name: 'Config',
    meta: { title: '设置', icon: 'example' },
    children: [
      { path: 'batchmanipulation', name: 'batchmanipulation', component: () => import('@/views/table/batchmanipulation'), meta: { title: '批量导入', icon: 'table' }},
      { path: 'cronjob', name: 'cronjob', component: () => import('@/views/table/cronjob'), meta: { title: '定时任务', icon: 'table' }},
      { path: 'notifysetting', name: 'notifysetting', component: () => import('@/views/table/notifysetting'), meta: { title: '通知设置', icon: 'table' }},
      { path: 'useragent', name: 'useragent', component: () => import('@/views/table/useragent'), meta: { title: 'ua', icon: 'table' }},
      { path: 'riskport', name: 'riskport', component: () => import('@/views/table/riskport'), meta: { title: '高危端口', icon: 'table' }},
      { path: 'riskservice', name: 'riskservice', component: () => import('@/views/table/riskservice'), meta: { title: '高危服务', icon: 'table' }},
      { path: 'riskversion', name: 'riskversion', component: () => import('@/views/table/riskversion'), meta: { title: '高危版本', icon: 'table' }},
      { path: 'dictionaryusername', name: 'dictionaryusername', component: () => import('@/views/table/dictionaryusername'), meta: { title: '字典用户名', icon: 'table' }},
      { path: 'dictionarypassword', name: 'dictionarypassword', component: () => import('@/views/table/dictionarypassword'), meta: { title: '字典密码', icon: 'table' }}
    ]
  },
  {
    path: '/pluginconfigmutil',
    component: Layout,
    redirect: '/pluginconfigmutil/table',
    name: 'Pluginconfigmutil',
    meta: { title: '插件', icon: 'example' },
    children: [
      { path: 'pluginconfigmutil', name: 'pluginconfigmutil', component: () => import('@/views/table/pluginconfigmutil'), meta: { title: '插件', icon: 'table' }}
    ]
  },

  {
    path: '/whitelist',
    component: Layout,
    redirect: '/whitelist/table',
    name: 'Whitelist',
    meta: { title: '白名单设置', icon: 'example' },
    children: [
      { path: 'domainwhitelist', name: 'domainwhitelist', component: () => import('@/views/table/domainwhitelist'), meta: { title: '域名', icon: 'table' }},
      { path: 'titlewhitelist', name: 'titlewhitelist', component: () => import('@/views/table/titlewhitelist'), meta: { title: '标题', icon: 'table' }},
      { path: 'ipwhitelist', name: 'ipwhitelist', component: () => import('@/views/table/ipwhitelist'), meta: { title: 'ip', icon: 'table' }},
      { path: 'ipportwhitelist', name: 'ipportwhitelist', component: () => import('@/views/table/ipportwhitelist'), meta: { title: 'ip-端口', icon: 'table' }},
      { path: 'projectportwhitelist', name: 'projectportwhitelist', component: () => import('@/views/table/projectportwhitelist'), meta: { title: '项目信息-端口', icon: 'table' }}

    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/table',
    name: 'User',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      { path: 'user', name: 'table', component: () => import('@/views/table/user'), meta: { title: '用户管理', icon: 'user' }}
    ]
  },
  {
    path: '/log',
    component: Layout,
    redirect: '/log/table',
    name: 'Log',
    meta: { title: '日志', icon: 'example' },
    children: [
      { path: 'notifylog', name: 'notifylog', component: () => import('@/views/table/notifylog'), meta: { title: '提醒日志', icon: 'table' }}
    ]
  },
  {
    path: '/wiki',
    component: Layout,
    redirect: '/wiki/table',
    name: 'wiki',
    meta: { title: '漏洞wiki', icon: 'example' },
    children: [
      { path: 'categorytop', name: 'categorytop', component: () => import('@/views/table/categorytop'), meta: { title: '一级分类', icon: 'table' }},
      { path: 'categorysecond', name: 'categorysecond', component: () => import('@/views/table/categorysecond'), meta: { title: '二级分类', icon: 'table' }},
      { path: 'vuln', name: 'vuln', component: () => import('@/views/table/vuln'), meta: { title: '漏洞', icon: 'table' }}
    ]
  },
  {
    path: '/project2',
    component: Layout,
    redirect: '/project/table',
    name: 'Project2',
    meta: { title: '任务信息杂项', icon: 'example' },
    children: [
      { path: 'taskpluginconfig', name: 'taskpluginconfig', component: () => import('@/views/table/taskpluginconfig'), meta: { title: '任务插件配置', icon: 'table' }},
      { path: 'nmapconfig', name: 'nmapconfig', component: () => import('@/views/table/nmapconfig'), meta: { title: 'mass2Nmap模式nmap配置', icon: 'table' }}
    ]
  },
  {
    path: '/plugin',
    component: Layout,
    redirect: '/plugin/table',
    name: 'Plugin',
    meta: { title: '插件杂项', icon: 'example' },
    children: [
      { path: 'pluginconfigsingle', name: 'pluginconfigsingle', component: () => import('@/views/table/pluginconfigsingle'), meta: { title: '插件配置', icon: 'table' }},
      { path: 'pluginassetservice', name: 'pluginassetservice', component: () => import('@/views/table/pluginassetservice'), meta: { title: '资产服务', icon: 'table' }},
      { path: 'pluginassetversion', name: 'pluginassetversion', component: () => import('@/views/table/pluginassetversion'), meta: { title: '资产版本', icon: 'table' }},
      { path: 'vulnkeyword', name: 'vulnkeyword', component: () => import('@/views/table/vulnkeyword'), meta: { title: '漏洞关键词', icon: 'table' }},
      { path: 'vulnpluginconfig', name: 'vulnpluginconfig', component: () => import('@/views/table/vulnpluginconfig'), meta: { title: '漏洞插件配置关联', icon: 'table' }}
    ]
  },
  {
    path: '/wiki2',
    component: Layout,
    redirect: '/wiki/table',
    name: 'wiki2',
    meta: { title: '漏洞wiki杂项', icon: 'example' },
    children: [
      { path: 'democode', name: 'democode', component: () => import('@/views/table/democode'), meta: { title: '示例代码', icon: 'table' }},
      { path: 'solution', name: 'solution', component: () => import('@/views/table/solution'), meta: { title: '解决方案', icon: 'table' }}
    ]
  },
  {
    path: '/about',
    component: Layout,
    // redirect: '/about',
    // name: 'about',
    meta: { title: '关于', icon: 'example' },
    children: [
      { path: 'about', name: 'about', component: () => import('@/views/about/about'), meta: { title: '关于', icon: 'table' }}
    ]
  },
  // {
  //   path: '/about',
  //   component: Layout,
  //   redirect: '/about',
  //   children: [{
  //     path: 'about',
  //     name: 'About',
  //     component: () => import('@/views/about/about'),
  //     meta: { title: '关于', icon: 'example' }
  //   }]
  // },
  // {
  //   path: '/todo',
  //   component: Layout,
  //   redirect: '/todo/table',
  //   name: 'todo',
  //   meta: { title: 'todo', icon: 'example' },
  //   children: [
  //     { path: 'location', name: 'location', component: () => import('@/views/table/location'), meta: { title: '位置信息', icon: 'table' }}

  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
