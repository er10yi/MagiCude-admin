<template>
  <div>
    <br>
    <!-- 查询条件 -->
    <el-form ref="searchform" inline size="small" :model="searchMap">
      <el-form-item prop="name" label="名称">
        <el-select v-model="searchMap.name" style="width:180px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getNameList" :loading="searchLoading">
          <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.name" /></el-select>
      </el-form-item>

      <el-form-item prop="accessurl" label="访问地址">
        <el-select v-model="searchMap.accessurl" style="width:180px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getAccessurlList" :loading="searchLoading">
          <el-option v-for="item in accessurlList" :key="item.id" :label="item.accessurl" :value="item.accessurl" /></el-select>
      </el-form-item>

      <el-form-item prop="level" label="等级">
        <el-select v-model="searchMap.level" style="width:180px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getLevelList" :loading="searchLoading">
          <el-option v-for="item in levelList" :key="item.id" :label="item.level" :value="item.level" /></el-select>
      </el-form-item>

      <el-form-item label="负责人">
        <el-select v-model="searchMap.managerid" style="width:100px;" filterable remote clearable placeholder="管理" :remote-method="getManagerList" :loading="searchLoading">
          <el-option v-for="item in managerList" :key="item.id" :label="item.name" :value="item.id" /></el-select>
        <el-select v-model="searchMap.devmanagerid" style="width:100px;" filterable remote clearable placeholder="开发" :remote-method="getDevManagerList" :loading="searchLoading">
          <el-option v-for="item in devmanagerList" :key="item.id" :label="item.name" :value="item.id" /></el-select>
        <el-select v-model="searchMap.opermanagerid" style="width:100px;" filterable remote clearable placeholder="运维" :remote-method="getOpManagerList" :loading="searchLoading">
          <el-option v-for="item in opermanagerList" :key="item.id" :label="item.name" :value="item.id" /></el-select>
      </el-form-item>

      <el-form-item label="标签">
        <el-select v-model="searchMap.tabbitmap" style="width:180px;" filterable remote clearable placeholder="请输入标签名称搜索" :remote-method="getTabnameList" :loading="searchLoading">
          <el-option v-for="item in tabnameList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData()">查询</el-button>
        <el-button type="info" @click="resetForm('searchform')">重置</el-button>
      </el-form-item>

      <!-- 操作 -->
      <el-form-item>
        <el-input v-model="filename" placeholder="默认名字：报告" style="width:180px;" prefix-icon="el-icon-document" />
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="handleDownload">导出已选</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" icon="el-icon-delete" @click="handleDeleteAll">删除已选</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleEdit('')">新增</el-button>
      </el-form-item>
    </el-form>

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

      <el-table-column sortable prop="name" label="名称" />
      <!-- <el-table-column prop="accessurl" label="访问地址" /> -->
      <el-table-column prop="accessurl" label="访问地址">
        <template slot-scope="scope">
          <el-link :href="scope.row.accessurl" target="_blank" :underline="false">{{ scope.row.accessurl }}</el-link>
        </template>
      </el-table-column>
      <!--
          {{ scope.row.middList.assetipid }}
          {{ scope.row.middList.assetportid }}
          {{ scope.row.middList.hostdomainid }} -->
      <!-- <el-table-column sortable prop="middList" label="等级" /> -->

      <el-table-column prop="middName" label="ip端口主机域名">
        <template slot-scope="scope">
          <span v-if="scope.row.middName">
            <span
              v-for="item in scope.row.middName.split(',')"
              :key="item.id"
              :label="item"
              :value="item"
            >
              <span v-if="item">
                <el-tag size="mini" type="info" effect="plain">{{ item }}</el-tag><br>
              </span>

            </span>
          </span>
        </template>
      </el-table-column>

      <!-- <el-table-column sortable prop="level" label="等级" /> -->
      <el-table-column sortable prop="level" label="等级">
        <template slot-scope="scope">
          <span v-if="scope.row.level">
            <el-tag size="mini" type="info" effect="plain">{{ scope.row.level }}</el-tag>
          </span>
        </template>

      </el-table-column>
      <el-table-column sortable prop="managerinfo" label="负责人">
        <template slot-scope="scope">
          <span v-if="scope.row.manager">
            <el-tag size="mini" type="info" effect="plain">管理:{{ scope.row.manager }}</el-tag>
            <br>
          </span>
          <span v-if="scope.row.devmanager">
            <el-tag size="mini" type="info" effect="plain">开发:{{ scope.row.devmanager }}</el-tag>
            <br>
          </span>
          <span v-if="scope.row.opermanager">
            <el-tag size="mini" type="info" effect="plain">运维:{{ scope.row.opermanager }}</el-tag>
          </span>
        </template></el-table-column>

      <!-- <el-table-column sortable prop="devmanager" label="负责人" />
      <el-table-column sortable prop="opermanager" label="负责人" /> -->

      <el-table-column prop="developdesc" label="研发说明" />
      <el-table-column prop="deploydesc" label="部署说明" />
      <el-table-column prop="whitelist" label="白名单访问列表" />

      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="tabname" label="标签">
        <template slot-scope="scope">
          <span v-if="scope.row.tabname">
            <span
              v-for="item in scope.row.tabname.split(',')"
              :key="item.id"
              :label="item"
              :value="item"
            >
              <el-tag size="mini" type="info" effect="plain">{{ item }}</el-tag>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
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
      <el-form label-width="110px">

        <el-form-item label="名称"><el-input v-model="pojo.name" style="width:400px;" /></el-form-item>
        <el-form-item label="访问地址"><el-input v-model="pojo.accessurl" style="width:400px;" /></el-form-item>

        <!-- <el-form-item label="ip"><el-input v-model="pojo.assetipid" style="width:400px;" /></el-form-item>
        <el-form-item label="端口"><el-input v-model="pojo.assetportid" style="width:400px;" /></el-form-item>
        <el-form-item label="域名"><el-input v-model="pojo.hostdomainid" style="width:400px;" /></el-form-item> -->

        <el-form-item label="等级">
          <span>{{ pojo.level }} </span>
          <el-select v-model="rootCategoryId" style="width:195px;" clearable filterable placeholder="类别选择" @change="rootSelectChange">
            <el-option
              v-for="item in rootCategoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>

          <!-- <el-input v-model="pojo.level" style="width:200px;" /> -->
          <span v-if="rootCategoryId">
            <el-select v-model="pojo.level" style="width:195px;" clearable filterable placeholder="等级选择">
              <el-option
                v-for="item in secondCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </span>
        </el-form-item>

        <el-form-item label="负责人">
          <span>管理: {{ manager }} </span>
          <el-select v-model="pojo.managerid" style="width:300px;" filterable remote clearable placeholder="请输入管理员名称搜索" :remote-method="getManagerList" :loading="searchLoading">
            <el-option v-for="item in managerList" :key="item.id" :label="item.name" :value="item.id" /></el-select>
          <el-tooltip placement="top">
            <div slot="content">需要在[分类管理-公司部门人员]新增后, 才能在这里选择</div>
            <i class="el-icon-info" />
          </el-tooltip>
          <br>
          <span>开发: {{ devmanager }} </span>
          <el-select v-model="pojo.devmanagerid" style="width:300px;" filterable remote clearable placeholder="请输入开发负责人名称搜索" :remote-method="getDevManagerList" :loading="searchLoading">
            <el-option v-for="item in devmanagerList" :key="item.id" :label="item.name" :value="item.id" /></el-select>
          <br>
          <span>运维: {{ opermanager }} </span>
          <el-select v-model="pojo.opermanagerid" style="width:300px;" filterable remote clearable placeholder="请输入运维负责人名称搜索" :remote-method="getOpManagerList" :loading="searchLoading">
            <el-option v-for="item in opermanagerList" :key="item.id" :label="item.name" :value="item.id" /></el-select>
        </el-form-item>

        <el-form-item label="研发说明"><el-input v-model="pojo.developdesc" :autosize="{miniRows: 1}" type="textarea" style="width:400px;" /></el-form-item>
        <el-form-item label="部署说明"><el-input v-model="pojo.deploydesc" :autosize="{miniRows: 1}" type="textarea" style="width:400px;" /></el-form-item>
        <el-form-item label="白名单访问列表"><el-input v-model="pojo.whitelist" :autosize="{miniRows: 1}" type="textarea" style="width:400px;" /></el-form-item>

        <el-form-item label="备注"><el-input v-model="pojo.remark" :autosize="{miniRows: 1}" type="textarea" style="width:400px;" /></el-form-item>
        <!-- <el-form-item label="标签"><el-input v-model="pojo.tabbitmap" style="width:400px;" /></el-form-item> -->

        <!-- 新增标签 -->
        <el-form-item label="标签">
          <el-form-item>
            <el-select
              v-model="selectedTabList"
              style="width:400px;"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入标签名称搜索"
              :remote-method="remoteSearchTab"
              :loading="searchLoading"
            >
              <el-option
                v-for="item in remoteTabOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-button icon="el-icon-delete" size="mini" circle @click="clearSelectedTab()" />
            <el-tooltip placement="top">
              <div slot="content">标签可在[分类管理-标签综合分类]中管理</div>
              <i class="el-icon-info" />
            </el-tooltip>
          </el-form-item>
        </el-form-item>

        <span v-if="pojo.id">
          <!--  增加ip端口域名  -->
          <!-- 表格数据 -->

          <el-form-item prop="name" label="增加ip端口域名">
            <el-button type="info" size="mini" icon="el-icon-circle-plus-outline" circle @click="handleAddMiddTable(pojo.id)" />
          </el-form-item>

          <el-table :data="middTableList" fit>
            <el-table-column sortable prop="assetip" label="ipv4" />
            <el-table-column sortable prop="assetport" label="端口" />
            <!-- <el-table-column sortable prop="appsysid" label="应用" /> -->
            <el-table-column sortable prop="hostdomain" label="主机域名" />
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEditMiddTable(scope.row.id)" />
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDeleteMiddTable(scope.row.id,pojo.id)" />
              </template>
            </el-table-column>
          </el-table>
        </span>
        <span v-else>
          <div slot="tip" class="el-upload__tip">保存后才能编辑ip端口主机域名</div>
        </span>
        <br>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 中间件表编辑框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisibleMidd" append-to-body width="40%" center :before-close="cleanCache">
      <el-form label-width="110px">
        <!-- <el-form-item label="ipv4"><el-input v-model="middPojo.assetipid" style="width:400px;" /></el-form-item>
        <el-form-item label="端口"><el-input v-model="middPojo.assetportid" style="width:400px;" /></el-form-item>
        <el-form-item label="应用系统编号"><el-input v-model="middPojo.appsysid" style="width:400px;" /></el-form-item>
        <el-form-item label="主机域名"><el-input v-model="middPojo.hostdomainid" style="width:400px;" /></el-form-item> -->

        <el-form-item label="ipv4">
          <span> {{ middAssetip }} </span>
          <el-select v-model="middPojo.assetipid" style="width:400px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择, ipv4不存在会自动新增" :remote-method="getIpaddressv4List" :loading="searchLoading">
            <el-option v-for="item in ipaddressv4List" :key="item.id" :label="item.ipaddressv4" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="port" label="端口">
          <span> {{ middAssetport }} </span>
          <el-select v-model="middPojo.assetportid" style="width:400px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择, 端口不存在会自动新增" :remote-method="getPortList" :loading="searchLoading">
            <el-option v-for="item in portList" :key="item.id" :label="item.port" :value="item.id" /></el-select>
        </el-form-item>
        <el-form-item prop="hostdomainid" label="主机域名">
          <span> {{ middHostdomain }} </span>
          <el-select v-model="middPojo.hostdomainid" style="width:400px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择, 主机域名不存在会自动新增" :remote-method="getHostdomainList" :loading="searchLoading">
            <el-option v-for="item in hostdomainList" :key="item.id" :label="item.hostname" :value="item.id" /></el-select>
        </el-form-item>

        <el-button type="primary" @click="handleSaveMiddTable()">保存</el-button>
        <el-button @click="closeDialogFormSecond()">关闭</el-button>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>

import appsystemApi from '@/api/appsystem'
import categorytabApi from '@/api/categorytab'
import categorycomstruApi from '@/api/categorycomstru'
import assetportApi from '@/api/assetport'
import assetipApi from '@/api/assetip'
import hostApi from '@/api/host'
import assetipAppsysHostdomainApi from '@/api/assetipAppsysHostdomain'
// import Vue from 'vue'
// const dateformat = Vue.filter('dateformat')

export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
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
      rootCategoryList: [],
      secondCategoryList: [],
      rootCategoryId: '',
      searchLoading: false,
      manager: '',
      devmanager: '',
      opermanager: '',
      managerList: [],
      devmanagerList: [],
      opermanagerList: [],

      // 标签
      tabPojo: {},
      tabPojoList: [],
      selectedTabList: [],
      remoteTabOptions: [],
      remoteTabList: [],
      categorytabMap: new Map(),

      nameList: [],
      accessurlList: [],
      levelList: [],
      tabnameList: [],

      portList: [], // 端口列表
      ipaddressv4List: [],
      hostdomainList: [],

      middTableList: [],
      middId: '',
      middPojo: {},
      dialogFormVisibleMidd: false,

      middAssetip: '',
      middAssetport: '',
      middHostdomain: '',

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
  mounted() {
    this.getRootCategoryChildren()
    this.getRemoteTabList()
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleDeleteMiddTable(id, appsysid) {
      assetipAppsysHostdomainApi.deleteByIdAndAppsysid(id, appsysid).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        assetipAppsysHostdomainApi.findAllByAppsysid(this.pojo.id).then((response) => {
          if (response.flag) {
            this.middTableList = response.data
          }
        })
      })
    },
    closeDialogFormSecond() {
      this.dialogFormVisibleMidd = false
      this.middAssetip = ''
      this.middAssetport = ''
      this.middHostdomain = ''
      this.portList = []
      this.hostdomainList = []
      this.ipaddressv4List = []
    },
    handleSaveMiddTable() {
      console.log(this.middPojo)
      assetipAppsysHostdomainApi.update(this.middId, this.middPojo).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        assetipAppsysHostdomainApi.findAllByAppsysid(this.pojo.id).then((response) => {
          if (response.flag) {
            this.middTableList = response.data
          }
        })
      })
      this.closeDialogFormSecond() // 关闭窗口
    },
    handleAddMiddTable(id) {
      this.middPojo = {}
      this.middPojo.appsysid = id
      this.middId = null
      this.dialogFormVisibleMidd = true // 打开窗口
    },
    handleEditMiddTable(middId) {
      this.middId = middId
      this.dialogFormVisibleMidd = true // 打开窗口
      if (middId !== '') { // 修改
        assetipAppsysHostdomainApi.findById(middId).then(response => {
          if (response.flag) {
            this.middPojo = response.data
            this.middAssetip = this.middPojo.assetip
            this.middAssetport = this.middPojo.assetport
            this.middHostdomain = this.middPojo.hostdomain
          }
        })

        //         middAssetip
        // middAssetport
        // middHostdomain
      } else {
        this.middPojo = {} // 清空数据
      }
    },
    getHostdomainList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          hostApi.search(1, 10, { 'hostname': query }).then(response => {
            this.hostdomainList = response.data.rows.filter(item => {
              return item.hostname.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.hostdomainList = []
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
    getPortList(query) {
      if (query !== '' && query && this.middPojo.assetipid) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          assetportApi.search(1, 10, { 'port': query, 'assetipid': this.middPojo.assetipid }).then(response => {
            this.portList = response.data.rows.filter(item => {
              return item.port.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.portList = []
      }
    },
    getTabnameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          categorytabApi.search(1, 10, { 'name': query }).then(response => {
            this.tabnameList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.tabnameList = []
      }
    },
    getLevelList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          appsystemApi.search(1, 10, { 'level': query }).then(response => {
            this.levelList = response.data.rows.filter(item => {
              return item.level.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.levelList = []
      }
    },
    getAccessurlList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          appsystemApi.search(1, 10, { 'accessurl': query }).then(response => {
            this.accessurlList = response.data.rows.filter(item => {
              return item.accessurl.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.accessurlList = []
      }
    },
    getNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          appsystemApi.search(1, 10, { 'name': query }).then(response => {
            this.nameList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.nameList = []
      }
    },
    getManagerList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          categorycomstruApi.search(1, 10, { 'name': query }).then(response => {
            this.managerList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.managerList = []
      }
    },
    getDevManagerList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          categorycomstruApi.search(1, 10, { 'name': query }).then(response => {
            this.devmanagerList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.devmanagerList = []
      }
    },
    getOpManagerList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          categorycomstruApi.search(1, 10, { 'name': query }).then(response => {
            this.opermanagerList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.opermanagerList = []
      }
    },
    clearSelectedTab() {
      this.selectedTabList = []
    },
    getRemoteTabList() {
      categorytabApi.getList().then(response => {
        this.remoteTabList = response.data
      })
    },
    remoteSearchTab(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          this.remoteTabOptions = this.remoteTabList.filter(item => {
            return item.name.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.remoteTabOptions = []
      }
    },
    rootSelectChange(change) {
      if (this.rootCategoryId !== null & this.rootCategoryId !== '') {
        categorytabApi.getChildren(this.rootCategoryId, 1).then(response => {
          if (response.flag) {
            this.secondCategoryList = response.data
          }
        })
      }
    },
    getCategoryChildren(parent, id) {
      this.tempId = this.rootCategoryId
      if (this.secondCategoryList.length === 0) {
        categorytabApi.getChildren(parent, id).then(response => {
          if (response.flag) {
            this.secondCategoryList = response.data
          }
        })
        return this.secondCategoryList
      }
    },
    getRootCategoryChildren() {
      categorytabApi.getChildren(0, 1).then(response => {
        if (response.flag) {
          this.rootCategoryList = response.data
        }
      })
    },
    cleanCache() {
      this.closeDialogForm()
    },
    closeDialogForm() {
      this.dialogFormVisible = false
      this.selectedTabList = []
      this.remoteTabOptions = []
      this.tempId = ''
      this.secondCategoryList = []
      this.rootCategoryId = ''
      this.tabPojoList = []
      this.manager = ''
      this.devmanager = ''
      this.opermanager = ''
      this.managerList = []
      this.devmanagerList = []
      this.opermanagerList = []
      this.accessurlList = []
      this.levelList = []
      this.tabnameList = []
      this.dialogFormVisibleMidd = false
      this.middAssetip = ''
      this.middAssetport = ''
      this.middHostdomain = ''
      this.portList = []
      this.hostdomainList = []
      this.ipaddressv4List = []
      this.fetchData()
    },
    handleDeleteAll() {
      if (this.multipleSelection && this.multipleSelection.length) {
        this.$confirm('此操作将永久删除已选记录, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const ids = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id)
          }
          appsystemApi.deleteAllByIds(ids).then(response => {
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
            '名称',
            '访问地址',
            'ip端口主机域名',
            '等级',
            '负责人',
            '研发说明',
            '部署说明',
            '白名单访问列表',
            '详细地址',
            '备注',
            '标签'

          ]
          const filterVal = [
            'name',
            'accessurl',
            'middName',
            'level',
            'managerinfo',
            'developdesc',
            'deploydesc',
            'whitelist',
            'distdetail',
            'remark',
            'tabname'

          ]
          const list = this.multipleSelection
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
      this.nameList = []
      this.accessurlList = []
      this.levelList = []
      this.tabnameList = []
      this.managerList = []
      this.devmanagerList = []
      this.opermanagerList = []
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
      appsystemApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSave() {
      var tempId
      if (this.selectedTabList.length !== 0) {
        const submitList = []
        for (var i = 0; i < this.selectedTabList.length; i++) {
          if (this.categorytabMap.get(this.selectedTabList[i])) {
            submitList.push(this.categorytabMap.get(this.selectedTabList[i]))
          } else {
            submitList.push(this.selectedTabList[i])
          }
        }
        this.pojo.tabbitmap = submitList.join(',')
      } else {
        this.pojo.tabbitmap = null
      }
      appsystemApi.update(this.id, this.pojo).then(response => {
        tempId = response.data
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) { // 如果成功
          this.fetchData() // 刷新列表
        }
      }).then(() => {
        if (tempId) {
          this.handleEdit(tempId)
        } else {
          this.closeDialogForm() // 关闭窗口
        }
      })
    },

    handleEdit(id) {
      this.id = id
      this.dialogFormVisible = true // 打开窗口
      if (id !== '') { // 修改
        appsystemApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
            this.tabPojoList = this.pojo.tabList
            this.manager = this.pojo.manager
            this.devmanager = this.pojo.devmanager
            this.opermanager = this.pojo.opermanager
            for (var i = 0; i < this.tabPojoList.length; i++) {
              this.categorytabMap.set(this.tabPojoList[i].name, this.tabPojoList[i].id)
              this.selectedTabList.push(this.tabPojoList[i].name)
            }

            assetipAppsysHostdomainApi.findAllByAppsysid(this.pojo.id).then((response) => {
              if (response.flag) {
                this.middTableList = response.data
              }
            })
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除已选记录, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        appsystemApi.deleteById(id).then(response => {
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
