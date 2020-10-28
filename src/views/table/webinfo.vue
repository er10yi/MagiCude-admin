<template>
  <div style="padding:5px;">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title"><i class="header-icon el-icon-info" />菜单栏隐藏与显示</template>
        <!-- 查询条件 -->
        <el-form ref="searchform" inline size="small" :model="searchMap">

          <el-form-item prop="assetip" label="ip">
            <el-select v-model="searchMap.assetip" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词" :remote-method="getIpaddressv4List" :loading="searchLoading">
              <el-option v-for="item in ipaddressv4List" :key="item.id" :label="item.ipaddressv4" :value="item.ipaddressv4" />
            </el-select>
          </el-form-item>
          <el-form-item prop="assetport" label="端口">
            <el-select v-model="searchMap.assetport" style="width:100px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词" :remote-method="getPortList" :loading="searchLoading">
              <el-option v-for="item in portList" :key="item.id" :label="item.port" :value="item.port" /></el-select>
          </el-form-item>

          <el-form-item prop="title" label="title">
            <el-select v-model="searchMap.title" allow-create default-first-option filterable remote clearable placeholder="请输入关键词" :remote-method="getTitleNameList" :loading="searchLoading">
              <el-option v-for="item in titleNameList" :key="item.id" :label="item.title" :value="item.title" />
            </el-select>
          </el-form-item>
          <el-form-item prop="bodychildrenstextcontent" label="body内容">
            <el-select v-model="searchMap.bodychildrenstextcontent" allow-create default-first-option filterable remote clearable placeholder="请输入关键词" :remote-method="getBodychildrenstextcontentNameList" :loading="searchLoading">
              <el-option v-for="item in bodychildrenstextcontentNameList" :key="item.id" :label="item.bodychildrenstextcontent" :value="item.bodychildrenstextcontent" />
            </el-select>
          </el-form-item>
          <el-form-item prop="server" label="server">
            <el-select v-model="searchMap.server" allow-create default-first-option filterable remote clearable placeholder="请输入关键词" :remote-method="getServerNameList" :loading="searchLoading">
              <el-option v-for="item in serverNameList" :key="item.id" :label="item.server" :value="item.server" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="showxpoweredby" prop="xpoweredby" label="xpoweredby">
            <el-select v-model="searchMap.xpoweredby" allow-create default-first-option filterable remote clearable placeholder="请输入关键词" :remote-method="getXpoweredbyNameList" :loading="searchLoading">
              <el-option v-for="item in xpoweredbyNameList" :key="item.id" :label="item.xpoweredby" :value="item.xpoweredby" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="showsetcookie" prop="setcookie" label="setcookie">
            <el-select v-model="searchMap.setcookie" allow-create default-first-option filterable remote clearable placeholder="请输入关键词" :remote-method="getSetcookieNameList" :loading="searchLoading">
              <el-option v-for="item in setcookieNameList" :key="item.id" :label="item.setcookie" :value="item.setcookie" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="showwwwauthenticate" prop="wwwauthenticate" label="认证方式">
            <el-select v-model="searchMap.wwwauthenticate" allow-create default-first-option filterable remote clearable placeholder="请输入关键词" :remote-method="getWwwauthenticateNameList" :loading="searchLoading">
              <el-option v-for="item in wwwauthenticateNameList" :key="item.id" :label="item.wwwauthenticate" :value="item.wwwauthenticate" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="showappname" prop="appname" label="应用名称">
            <el-select v-model="searchMap.appname" allow-create default-first-option filterable remote clearable placeholder="请输入关键词" :remote-method="getAppnameNameList" :loading="searchLoading">
              <el-option v-for="item in appnameNameList" :key="item.id" :label="item.appname" :value="item.appname" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="showappversion" prop="appversion" label="应用版本">
            <el-select v-model="searchMap.appversion" allow-create default-first-option filterable remote clearable placeholder="请输入关键词" :remote-method="getAppversionNameList" :loading="searchLoading">
              <el-option v-for="item in appversionNameList" :key="item.id" :label="item.appversion" :value="item.appversion" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="showdevlanguage" prop="devlanguage" label="开发语言">
            <el-select v-model="searchMap.devlanguage" allow-create default-first-option filterable remote clearable placeholder="请输入关键词" :remote-method="getDevlanguageNameList" :loading="searchLoading">
              <el-option v-for="item in devlanguageNameList" :key="item.id" :label="item.devlanguage" :value="item.devlanguage" />
            </el-select>
          </el-form-item>

          <el-form-item prop="crawltime" label="抓取时间">
            <el-date-picker v-model="searchMap.crawltime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" range-separator="-" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:350px;" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="fetchData()">查询</el-button>
            <el-button type="info" @click="resetForm('searchform')">重置</el-button>
          </el-form-item>

          <!-- 操作 -->
          <el-form-item>
            <el-input v-model="filename" placeholder="默认名字：报告" clearable style="width:180px;" prefix-icon="el-icon-document" />
            <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="handleDownload">导出</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" icon="el-icon-delete" @click="handleDeleteAll">删除</el-button>
          </el-form-item>

          <el-form-item>
            <el-popover
              placement="bottom"
              width="300"
              trigger="hover"
            >
              <el-button slot="reference">增加显示</el-button>
              <el-col :span="12"><el-checkbox @change="showHide('showlinks')">页面链接</el-checkbox> </el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showtitlewhitelistid')">不记录页面链接</el-checkbox> </el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showxpoweredby')">xpoweredby</el-checkbox> </el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showsetcookie')">setcookie</el-checkbox> </el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showwwwauthenticate')">认证方式</el-checkbox> </el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showappname')">应用名称</el-checkbox> </el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showappversion')">应用版本</el-checkbox> </el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showdevlanguage')">开发语言</el-checkbox> </el-col>
            </el-popover>
          </el-form-item>
          <!-- <el-form-item>
        <el-button type="primary" @click="handleEdit('')">新增</el-button>
      </el-form-item> -->
        </el-form>
      </el-collapse-item>    </el-collapse>

    <!-- 表格数据 -->
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="序号" type="index" :index="1" align="center" width="50" />
      <!-- <el-table-column sortable prop="id" label="web信息编号" /> -->
      <!-- <el-table-column sortable prop="portid" label="端口编号" /> -->

      <el-table-column key="1" sortable width="150" prop="assetip" label="ip">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="250"
            trigger="hover"
          >
            <el-link slot="reference" :underline="false">{{ scope.row.assetip }}</el-link>
            <el-link :href="'http://'+scope.row.assetip+':'+scope.row.portid" target="_blank" :underline="false">打开HTTP链接</el-link><br>
            <el-link :href="'https://'+scope.row.assetip+':'+scope.row.portid" target="_blank" :underline="false">打开HTTPS链接</el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column key="2" sortable width="80" prop="portid" label="端口" />
      <!-- <el-table-column sortable prop="titlewhitelistid" label="标题白名单编号" /> -->

      <el-table-column v-if="showtitlewhitelistid" key="3" sortable prop="titlewhitelistid" label="不抓取页面链接">
        <template slot-scope="scope">
          <span v-if="scope.row.titlewhitelistid ">
            是
          </span>
        </template>
      </el-table-column>

      <el-table-column key="4" sortable prop="title" label="title">
        <template slot="header">
          <span>title</span>
          <el-tooltip placement="top">
            <div slot="content">如果title加入标题白名单，下次页面发生改变，将不记录该tittle的页面链接</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>

        <template slot-scope="scope">
          <el-popover
            placement="right"
            title=""
            width="250"
            trigger="hover"
          >
            <el-link slot="reference" :underline="false">{{ scope.row.title }}</el-link>
            <el-link :underline="false" @click="addTitle(scope.row.title)">加入标题白名单</el-link><br>
            <el-link :underline="false" @click="deleteTitle(scope.row.title)">删除标题白名单</el-link>
          </el-popover>

        </template>
      </el-table-column>

      <el-table-column key="5" sortable prop="bodychildrenstextcontent" label="body内容" show-overflow-tooltip />
      <el-table-column key="6" sortable prop="server" label="server" />

      <el-table-column v-if="showxpoweredby" key="7" sortable prop="xpoweredby" label="xpoweredby" show-overflow-tooltip />
      <el-table-column v-if="showsetcookie" key="8" sortable prop="setcookie" label="setcookie" show-overflow-tooltip />
      <el-table-column v-if="showwwwauthenticate" key="9" sortable prop="wwwauthenticate" label="认证方式" show-overflow-tooltip />

      <el-table-column v-if="showappname" key="10" sortable prop="appname" label="应用名称" />
      <el-table-column v-if="showappversion" key="11" sortable prop="appversion" label="应用版本" />
      <el-table-column v-if="showdevlanguage" key="12" sortable prop="devlanguage" label="开发语言" />

      <el-table-column key="13" sortable prop="crawltime" label="抓取时间">
        <template slot-scope="scope">
          {{ scope.row.crawltime | dateformat() }}
        </template>
      </el-table-column>
      <el-table-column v-if="showlinks" key="14" sortable prop="url" label="页面链接">
        <template slot-scope="scope">
          {{ scope.row.url }}
        </template>
      </el-table-column>

      <el-table-column

        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEdit(scope.row.id)" />
          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部分页 -->
    <el-pagination
      :current-page.sync="currentPage"
      :page-sizes="[10,20,50,200,500,1000]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="fetchData"
    />

    <!-- 编辑框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="50%" center :before-close="cleanCache">
      <el-form label-width="100px">

        <!-- <el-form-item label="端口编号"><el-input v-model="pojo.portid" style="width:300px;" /></el-form-item> -->

        <!-- <el-form-item label="标题白名单编号"><el-input v-model="pojo.titlewhitelistid" style="width:300px;" /></el-form-item> -->

        <el-form-item label="ip:port">
          <span>{{ ipv4 }}:{{ assetport }}</span>
        </el-form-item>

        <el-form-item label="title"><el-input v-model="pojo.title" autosize type="textarea" /></el-form-item>
        <el-form-item label="body内容"><el-input v-model="pojo.bodychildrenstextcontent" autosize type="textarea" /></el-form-item>
        <el-form-item label="server"><el-input v-model="pojo.server" autosize type="textarea" /></el-form-item>
        <el-form-item label="xpoweredby"><el-input v-model="pojo.xpoweredby" autosize type="textarea" /></el-form-item>
        <el-form-item label="setcookie"><el-input v-model="pojo.setcookie" autosize type="textarea" /></el-form-item>
        <el-form-item label="认证方式"><el-input v-model="pojo.wwwauthenticate" autosize type="textarea" /></el-form-item>

        <el-form-item label="应用名称"><el-input v-model="pojo.appname" autosize type="textarea" /></el-form-item>
        <el-form-item label="应用版本"><el-input v-model="pojo.appversion" autosize type="textarea" /></el-form-item>
        <el-form-item label="开发语言"><el-input v-model="pojo.devlanguage" autosize type="textarea" /></el-form-item>

        <el-form-item label="抓取时间">
          <el-date-picker v-model="pojo.crawltime" placeholder="抓取时间" type="datetime" />
        </el-form-item>

        <el-form-item label="页面链接"><el-input v-model="links" autosize type="textarea" />        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import webinfoApi from '@/api/webinfo'
import assetipApi from '@/api/assetip'
import assetportApi from '@/api/assetport'
import urlApi from '@/api/url'
import titlewhitelistApi from '@/api/titlewhitelist'

import Vue from 'vue'
const dateformat = Vue.filter('dateformat')

export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      searchMap: {}, // 查询条件
      dialogFormVisible: false, // 编辑窗口是否可见
      pojo: {}, // 编辑表单绑定的实体对象
      id: '', // 当前用户修改的ID

      filename: '',
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      titlewhitelistList: [],
      searchLoading: false,
      titleNameList: [],
      bodychildrenstextcontentNameList: [],
      serverNameList: [],
      xpoweredbyNameList: [],
      setcookieNameList: [],
      wwwauthenticateNameList: [],
      appnameNameList: [],
      appversionNameList: [],
      devlanguageNameList: [],
      activeNames: ['1'],
      ipv4: '',
      assetport: '',
      links: '',
      showlinks: false,
      showxpoweredby: false,
      showsetcookie: false,
      showwwwauthenticate: false,
      showappname: false,
      showappversion: false,
      showdevlanguage: false,
      showtitlewhitelistid: false,
      ipaddressv4List: [],
      portList: [],

      pickerOptions: { // 日期选择
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getPortList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          assetportApi.search(1, 10, { 'port': query }).then(response => {
            this.portList = response.data.rows.filter(item => {
              return item.port.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.portList = []
      }
    },
    getIpaddressv4List(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          assetipApi.search(1, 10, { 'ipaddressv4': query }).then(response => {
            this.ipaddressv4List = response.data.rows.filter(item => {
              return item.ipaddressv4.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.ipaddressv4List = []
      }
    },
    addTitle(title) {
      this.pojo.title = title
      titlewhitelistApi.update(this.id, this.pojo).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
      })
    },
    deleteTitle(title) {
      titlewhitelistApi.deleteByTitle(title).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
      })
    },
    showHide(para) {
      if (para === 'showlinks') {
        this.showlinks = !this.showlinks
      }
      if (para === 'showxpoweredby') {
        this.showxpoweredby = !this.showxpoweredby
      }
      if (para === 'showsetcookie') {
        this.showsetcookie = !this.showsetcookie
      }
      if (para === 'showwwwauthenticate') {
        this.showwwwauthenticate = !this.showwwwauthenticate
      }
      if (para === 'showappname') {
        this.showappname = !this.showappname
      }
      if (para === 'showappversion') {
        this.showappversion = !this.showappversion
      }
      if (para === 'showdevlanguage') {
        this.showdevlanguage = !this.showdevlanguage
      }
      if (para === 'showtitlewhitelistid') {
        this.showtitlewhitelistid = !this.showtitlewhitelistid
      }
    },
    cleanCache() {
      this.closeDialogForm()
    },
    getTitleNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          webinfoApi.search(1, 10, { 'title': query }).then(response => {
            this.titleNameList = response.data.rows.filter(item => {
              return item.title.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.titleNameList = []
      }
    },
    getBodychildrenstextcontentNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          webinfoApi.search(1, 10, { 'bodychildrenstextcontent': query }).then(response => {
            this.bodychildrenstextcontentNameList = response.data.rows.filter(item => {
              return item.bodychildrenstextcontent.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.bodychildrenstextcontentNameList = []
      }
    },
    getServerNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          webinfoApi.search(1, 10, { 'server': query }).then(response => {
            this.serverNameList = response.data.rows.filter(item => {
              return item.server.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.serverNameList = []
      }
    },
    getXpoweredbyNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          webinfoApi.search(1, 10, { 'xpoweredby': query }).then(response => {
            this.xpoweredbyNameList = response.data.rows.filter(item => {
              return item.xpoweredby.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.xpoweredbyNameList = []
      }
    },
    getSetcookieNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          webinfoApi.search(1, 10, { 'setcookie': query }).then(response => {
            this.setcookieNameList = response.data.rows.filter(item => {
              return item.setcookie.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.setcookieNameList = []
      }
    },
    getWwwauthenticateNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          webinfoApi.search(1, 10, { 'wwwauthenticate': query }).then(response => {
            this.wwwauthenticateNameList = response.data.rows.filter(item => {
              return item.wwwauthenticate.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.wwwauthenticateNameList = []
      }
    },
    getAppnameNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          webinfoApi.search(1, 10, { 'appname': query }).then(response => {
            this.appnameNameList = response.data.rows.filter(item => {
              return item.appname.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.appnameNameList = []
      }
    },
    getAppversionNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          webinfoApi.search(1, 10, { 'appversion': query }).then(response => {
            this.appversionNameList = response.data.rows.filter(item => {
              return item.appversion.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.appversionNameList = []
      }
    },
    getDevlanguageNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          webinfoApi.search(1, 10, { 'devlanguage': query }).then(response => {
            this.devlanguageNameList = response.data.rows.filter(item => {
              return item.devlanguage.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.devlanguageNameList = []
      }
    },
    closeDialogForm() {
      this.assetport = ''
      this.ipv4 = ''
      this.dialogFormVisible = false
    },

    handleDeleteAll() {
      if (this.multipleSelection && this.multipleSelection.length) {
        this.$confirm('此操作将永久删除已选记录,包括 [web信息, url信息], 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const ids = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id)
          }
          webinfoApi.deleteAllByIds(ids).then(response => {
            this.$message({
              message: response.message,
              type: (response.flag ? 'success' : 'error')
            })
            if (response.flag) {
              this.fetchData() // 刷新数据
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          message: '^_^至少选择一条记录哦~',
          type: 'info'
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDownload() {
      if (this.multipleSelection && this.multipleSelection.length) {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            'ip',
            'port',
            '不记录页面链接',
            'title',
            'body内容',
            'server',
            'xpoweredby',
            'setcookie',
            '认证方式',
            '应用名称',
            '应用版本',
            '开发语言',
            '抓取时间',
            '页面链接'

          ]
          const filterVal = [
            'assetip',
            'portid',
            'titlewhitelistid',
            'title',
            'bodychildrenstextcontent',
            'server',
            'xpoweredby',
            'setcookie',
            'wwwauthenticate',
            'appname',
            'appversion',
            'devlanguage',
            'crawltime',
            'url'

          ]

          const list = this.multipleSelection
          for (let i = 0; i < list.length; i++) {
            if (list[i].titlewhitelistid) {
              list[i].titlewhitelistid = '是'
            }
            list[i].crawltime = dateformat(list[i].crawltime)
          }
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename
          })
          this.$refs.multipleTable.clearSelection()
          this.downloadLoading = false
        })
        this.fetchData()
      } else {
        this.$message({
          message: '^_^至少选择一条记录哦~',
          type: 'info'
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    resetForm(formName) { // 清空搜索表单
      this.$refs[formName].resetFields()
      this.searchMap = {}
      this.titleNameList = []
      this.bodychildrenstextcontentNameList = []
      this.serverNameList = []
      this.xpoweredbyNameList = []
      this.setcookieNameList = []
      this.wwwauthenticateNameList = []
      this.appnameNameList = []
      this.appversionNameList = []
      this.devlanguageNameList = []
      this.showlinks = false
      this.showxpoweredby = false
      this.showsetcookie = false
      this.showwwwauthenticate = false
      this.showappname = false
      this.showappversion = false
      this.showdevlanguage = false
      this.showtitlewhitelistid = false
      this.ipaddressv4List = []
      this.portList = []
      this.$message({
        message: '已清空搜索条件',
        type: 'info'
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    formatBoolean(cellValue) {
      return cellValue ? '是' : ''
    },
    fetchData() {
      this.listLoading = true
      webinfoApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSave() {
      webinfoApi.update(this.id, this.pojo).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) { // 如果成功
          this.fetchData() // 刷新列表
        }
      })
      this.closeDialogForm() // 关闭窗口
    },
    handleEdit(id) {
      this.id = id
      this.dialogFormVisible = true // 打开窗口
      if (id !== '') { // 修改
        webinfoApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
          }
          assetportApi.findById(this.pojo.portid).then(response => {
            if (response.flag) {
              this.assetport = response.data.port
            }
            assetipApi.findById(response.data.assetipid).then(response => {
              if (response.flag) {
                this.ipv4 = response.data.ipaddressv4
              }
            })
            urlApi.findLinksByWebinfoId(this.pojo.id).then(response => {
              if (response.flag) {
                this.links = response.data
              }
            })
          })
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除已选记录,包括 [web信息, url信息], 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        webinfoApi.deleteById(id).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) {
            this.fetchData() // 刷新数据
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
