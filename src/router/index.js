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
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Project',
    meta: { title: '任务管理', icon: '任务管理' },
    children: [
      { path: 'project', name: 'project', component: () => import('@/views/table/project'), meta: { title: '任务项目', icon: '项目' }},
      { path: 'task', name: 'task', component: () => import('@/views/table/task'), meta: { title: '任务', icon: '任务' }},
      {
        path: '/taskresult',
        component: () => import('@/views/nested/index.vue'),
        redirect: 'noRedirect',
        name: 'taskresult',
        meta: { title: '任务结果', icon: '任务结果' },
        children: [
          { path: 'taskip', name: 'taskip', component: () => import('@/views/table/taskip'), meta: { title: '任务ip', icon: 'ip' }},
          { path: 'taskport', name: 'taskport', component: () => import('@/views/table/taskport'), meta: { title: '任务端口', icon: '端口' }}
        ]
      },
      {
        path: '/project2',
        component: () => import('@/views/nested/index.vue'),
        redirect: 'noRedirect',
        name: 'Project2',
        meta: { title: '杂项', icon: '其他' },
        children: [
          { path: 'agent', name: 'agent', component: () => import('@/views/table/agent'), meta: { title: 'Agent', icon: 'agent' }},
          { path: 'taskpluginconfig', name: 'taskpluginconfig', component: () => import('@/views/table/taskpluginconfig'), meta: { title: '任务插件配置', icon: '插件' }},
          { path: 'nmapconfig', name: 'nmapconfig', component: () => import('@/views/table/nmapconfig'), meta: { title: 'mass2Nmap模式nmap配置', icon: '配置' }}
        ]
      }

    ]
  },
  {
    path: '/asset',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Asset',
    meta: { title: '资产管理', icon: '资产' },
    children: [
      {
        path: '/ipdepartment',
        component: () => import('@/views/nested/index.vue'),
        redirect: 'noRedirect',
        name: 'ipdepartment',
        meta: { title: 'ip项目组', icon: '项目' },
        children: [
          { path: 'department', name: 'department', component: () => import('@/views/table/department'), meta: { title: '项目组部门', icon: '部门' }},
          { path: 'projectinfo', name: 'projectinfo', component: () => import('@/views/table/projectinfo'), meta: { title: '项目组', icon: '项目' }},
          { path: 'contactProjectinfo', name: 'contactProjectinfo', component: () => import('@/views/table/contactProjectinfo'), meta: { title: '项目组负责人', icon: '关联' }},
          { path: 'contact', name: 'contact', component: () => import('@/views/table/contact'), meta: { title: '负责人信息', icon: 'user' }}
        ]
      },
      { path: 'appsystem', name: 'appsystem', component: () => import('@/views/table/appsystem'), meta: { title: '应用系统', icon: '应用' }},
      { path: 'assetip', name: 'assetip', component: () => import('@/views/table/assetip'), meta: { title: '资产ip', icon: 'ip' }},
      { path: 'assetport', name: 'assetport', component: () => import('@/views/table/assetport'), meta: { title: '资产端口', icon: '端口' }},
      { path: 'host', name: 'host', component: () => import('@/views/table/host'), meta: { title: '主机/域名', icon: '主机' }}
      // { path: 'api', name: 'api', component: () => import('@/views/table/api'), meta: { title: '资产api', icon: 'list' }},
    ]
  },
  {
    path: '/checkresult',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Checkresult',
    meta: { title: '检测结果', icon: '任务结果' },
    children: [
      { path: 'checkresult', name: 'checkresult', component: () => import('@/views/table/checkresult'), meta: { title: '漏洞', icon: '漏洞' }},

      {
        path: '/webinfos',
        component: () => import('@/views/nested/index.vue'),
        redirect: 'noRedirect',
        name: 'webinfos',
        meta: { title: 'web相关', icon: '任务结果' },
        children: [
          { path: 'webinfo', name: 'webinfo', component: () => import('@/views/table/webinfo'), meta: { title: 'web信息', icon: 'web' }}
          // { path: 'webrawdata', name: 'webrawdata', component: () => import('@/views/table/webrawdata'), meta: { title: '原始响应和头信息', icon: '关于' }},
          // { path: 'url', name: 'url', component: () => import('@/views/table/url'), meta: { title: 'url', icon: 'url' }}
        ]
      }

    ]
  },

  {
    path: '/category',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '分类管理', icon: 'tree' },
    children: [
      { path: 'categorycomstru', name: 'categorycomstru', component: () => import('@/views/table/categorycomstru'), meta: { title: '公司部门人员', icon: '公司' }},
      { path: 'categorytab', name: 'categorytab', component: () => import('@/views/table/categorytab'), meta: { title: '标签综合分类', icon: '标签' }}

    ]
  },
  {
    path: '/pluginconfigmutil',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Pluginconfigmutil',
    meta: { title: '插件', icon: '插件' },
    children: [
      { path: 'pluginconfigmutil', name: 'pluginconfigmutil', component: () => import('@/views/table/pluginconfigmutil'), meta: { title: '插件', icon: '插件' }},
      {
        path: '/plugin',
        component: () => import('@/views/nested/index.vue'),
        name: 'Plugin',
        meta: { title: '杂项', icon: '其他' },
        children: [
          { path: 'pluginconfigsingle', name: 'pluginconfigsingle', component: () => import('@/views/table/pluginconfigsingle'), meta: { title: '插件', icon: '配置' }},
          { path: 'pluginassetservice', name: 'pluginassetservice', component: () => import('@/views/table/pluginassetservice'), meta: { title: '资产服务', icon: '服务' }},
          { path: 'pluginassetversion', name: 'pluginassetversion', component: () => import('@/views/table/pluginassetversion'), meta: { title: '资产版本', icon: '版本' }},
          { path: 'vulnkeyword', name: 'vulnkeyword', component: () => import('@/views/table/vulnkeyword'), meta: { title: '漏洞关键词', icon: '关键词' }},
          { path: 'vulnpluginconfig', name: 'vulnpluginconfig', component: () => import('@/views/table/vulnpluginconfig'), meta: { title: '漏洞插件关联', icon: '关联' }}
        ]
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Config',
    meta: { title: '设置', icon: '设置' },
    children: [
      { path: 'batchmanipulation', name: 'batchmanipulation', component: () => import('@/views/table/batchmanipulation'), meta: { title: '批量导入', icon: '导入' }},
      { path: 'cronjob', name: 'cronjob', component: () => import('@/views/table/cronjob'), meta: { title: '定时任务', icon: '定时' }},
      { path: 'notifysetting', name: 'notifysetting', component: () => import('@/views/table/notifysetting'), meta: { title: '通知', icon: '提醒' }},
      { path: 'useragent', name: 'useragent', component: () => import('@/views/table/useragent'), meta: { title: '爬虫ua', icon: '爬虫' }},
      {
        path: '/risksetting',
        component: () => import('@/views/nested/index.vue'),
        redirect: 'noRedirect',
        name: 'risksetting',
        meta: { title: '高危信息', icon: 'risk' },
        children: [
          { path: 'port', name: 'riskport', component: () => import('@/views/table/riskport'), meta: { title: '端口', icon: '端口' }},
          { path: 'service', name: 'riskservice', component: () => import('@/views/table/riskservice'), meta: { title: '服务', icon: '服务' }},
          { path: 'version', name: 'riskversion', component: () => import('@/views/table/riskversion'), meta: { title: '版本', icon: '版本' }}
        ]
      },
      {
        path: '/dictionary',
        component: () => import('@/views/nested/index.vue'),
        redirect: 'noRedirect',
        name: 'dictionary',
        meta: { title: '字典', icon: '字典' },
        children: [
          { path: 'username', name: 'dictionaryusername', component: () => import('@/views/table/dictionaryusername'), meta: { title: '用户名', icon: 'user' }},
          { path: 'password', name: 'dictionarypassword', component: () => import('@/views/table/dictionarypassword'), meta: { title: '密码', icon: 'password' }}
        ]
      },
      {
        path: '/whitelist',
        component: () => import('@/views/nested/index.vue'),
        redirect: 'noRedirect',
        name: 'Whitelist',
        meta: { title: '白名单', icon: '白名单' },
        children: [
          { path: 'domainwhitelist', name: 'domainwhitelist', component: () => import('@/views/table/domainwhitelist'), meta: { title: '域名', icon: '域名' }},
          { path: 'titlewhitelist', name: 'titlewhitelist', component: () => import('@/views/table/titlewhitelist'), meta: { title: '标题', icon: '标题' }},
          { path: 'ipwhitelist', name: 'ipwhitelist', component: () => import('@/views/table/ipwhitelist'), meta: { title: 'ip', icon: 'ip' }},
          { path: 'ipportwhitelist', name: 'ipportwhitelist', component: () => import('@/views/table/ipportwhitelist'), meta: { title: 'ip-端口', icon: '端口' }},
          { path: 'projectportwhitelist', name: 'projectportwhitelist', component: () => import('@/views/table/projectportwhitelist'), meta: { title: '项目组-端口', icon: '项目' }}
        ]
      },
      {
        path: '/user',
        component: () => import('@/views/nested/index.vue'),
        redirect: 'noRedirect',
        name: 'User',
        meta: { title: '用户管理', icon: 'user' },
        children: [
          { path: 'user', name: 'table', component: () => import('@/views/table/user'), meta: { title: '用户管理', icon: 'user' }}
        ]
      }
    ]
  },

  {
    path: '/wiki',
    component: Layout,
    redirect: 'noRedirect',
    name: 'wiki',
    meta: { title: '漏洞wiki', icon: '漏洞wiki' },
    children: [
      { path: 'categorytop', name: 'categorytop', component: () => import('@/views/table/categorytop'), meta: { title: '一级分类', icon: '一级分类' }},
      { path: 'categorysecond', name: 'categorysecond', component: () => import('@/views/table/categorysecond'), meta: { title: '二级分类', icon: '二级分类' }},
      { path: 'vuln', name: 'vuln', component: () => import('@/views/table/vuln'), meta: { title: '漏洞', icon: '漏洞' }},
      {
        path: '/wiki2',
        component: () => import('@/views/nested/index.vue'),
        redirect: 'noRedirect',
        name: 'wiki2',
        meta: { title: '杂项', icon: '其他' },
        children: [
          { path: 'democode', name: 'democode', component: () => import('@/views/table/democode'), meta: { title: '示例代码', icon: '代码' }},
          { path: 'solution', name: 'solution', component: () => import('@/views/table/solution'), meta: { title: '解决方案', icon: '解决方案' }}
        ]
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Log',
    meta: { title: '日志', icon: '日志' },
    children: [
      { path: 'notifylog', name: 'notifylog', component: () => import('@/views/table/notifylog'), meta: { title: '提醒日志', icon: '提醒' }}
    ]
  },
  {
    path: '/about',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '关于', icon: '关于' },
    children: [
      { path: 'about', name: 'about', component: () => import('@/views/about/about'), meta: { title: '关于', icon: '关于' }}
    ]
  },

  // hidden page
  //
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
