<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title"><i class="header-icon el-icon-info" />菜单栏隐藏与显示</template>
        <!-- 查询条件 -->
        <el-form ref="searchform" inline size="small" :model="searchMap">

          <el-form-item prop="assetipid" label="ipv4地址">
            <el-select v-model="searchMap.assetip" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getIpaddressv4List" :loading="searchLoading">
              <el-option v-for="item in ipaddressv4List" :key="item.id" :label="item.ipaddressv4" :value="item.ipaddressv4" />
            </el-select>
          </el-form-item>

          <el-form-item prop="port" label="端口">
            <el-select v-model="searchMap.port" style="width:130px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getPortList" :loading="searchLoading">
              <el-option v-for="item in portList" :key="item.id" :label="item.port" :value="item.port" /></el-select>
          </el-form-item>
          <el-form-item prop="protocol" label="协议">
            <el-select v-model="searchMap.protocol" style="width:130px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getProtocolList" :loading="searchLoading">
              <el-option v-for="item in protocolList" :key="item.id" :label="item.protocol" :value="item.protocol" /></el-select>
          </el-form-item>
          <el-form-item prop="state" label="状态">
            <el-select v-model="searchMap.state" style="width:130px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getStateList" :loading="searchLoading">
              <el-option v-for="item in stateList" :key="item.id" :label="item.state" :value="item.state" /></el-select>
          </el-form-item>
          <el-form-item prop="service" label="服务">
            <el-select v-model="searchMap.service" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getServiceList" :loading="searchLoading">
              <el-option v-for="item in serviceList" :key="item.id" :label="item.service" :value="item.service" /></el-select>
          </el-form-item>
          <el-form-item prop="version" label="版本">
            <el-select v-model="searchMap.version" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getVersionList" :loading="searchLoading">
              <el-option v-for="item in versionList" :key="item.id" :label="item.version" :value="item.version" /></el-select>
          </el-form-item>

          <el-form-item label="标签">
            <el-select v-model="searchMap.tabbitmap" style="width:180px;" filterable remote clearable placeholder="请输入名称搜索" :remote-method="getTabList" :loading="searchLoading">
              <el-option v-for="item in tabList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>

          <el-form-item prop="checkwhitelist" label="安全检测白名单">
            <el-switch v-model="searchMap.checkwhitelist" />
          </el-form-item>
          <el-form-item prop="assetnotifywhitelist" label="资产提醒白名单">
            <el-switch v-model="searchMap.assetnotifywhitelist" />
          </el-form-item>
          <el-form-item prop="uptime" label="发现时间">
            <el-date-picker v-model="searchMap.uptime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" range-separator="-" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:350px;" />
          </el-form-item>
          <el-form-item prop="downtime" label="关闭时间">
            <el-date-picker v-model="searchMap.downtime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" range-separator="-" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:350px;" />
          </el-form-item>
          <el-form-item prop="changedtime" label="修改时间">
            <el-date-picker v-model="searchMap.changedtime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" range-separator="-" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:350px;" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchData()">查询</el-button>
            <el-tooltip placement="top">
              <div slot="content">如果选择白名单查询<br>需要清空查询条件<br>数据才是准确的</div>
              <el-button type="info" @click="resetForm('searchform')">重置</el-button>
            </el-tooltip>
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
            <el-button type="primary" @click="handleEdit('')">新增</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>    </el-collapse>

    <el-drawer
      title="详情"
      :visible.sync="drawer"
      :with-header="false"
      direction="rtl"
      size="65%"
      :before-close="handleDrawerClose"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">

          <span><b>  {{ ipv4 }} {{ pojo.port }} 端口所有信息</b></span>
        </div>
        <div class="text">
          <table border="0">
            <tr>
              <td><b>应用系统</b></td>
              <td>
                <span v-if="pojo.appsysname">
                  <span
                    v-for="item in pojo.appsysname.split(',')"
                    :key="item.id"
                    :label="item"
                    :value="item"
                  >
                    <span v-if="item">
                      <el-tag size="mini" type="info" effect="plain">{{ item }}</el-tag>
                    </span>
                  </span>
                </span>
              </td>
              <el-divider direction="vertical" />
              <td><b>标签</b></td>
              <td>
                <span v-if="pojo.tabname">
                  <span
                    v-for="item in pojo.tabname.split(',')"
                    :key="item.id"
                    :label="item"
                    :value="item"
                  >
                    <span v-if="item">
                      <el-tag size="mini" type="info" effect="plain">{{ item }}</el-tag>
                    </span>
                  </span>
                </span>
              </td>
            </tr>
            <tr>
              <td><b>协议</b></td>
              <td>{{ pojo.protocol }}</td>
              <el-divider direction="vertical" />
              <td><b>状态</b></td>
              <td>{{ pojo.state }}</td>
            </tr>
            <tr>
              <td><b>服务</b></td>
              <td>{{ pojo.service }}</td>
              <el-divider direction="vertical" />
              <td><b>版本</b></td>
              <td>{{ pojo.version }}</td>
            </tr>

            <tr>
              <td><b>安全检测白名单</b></td>
              <td>{{ formatBoolean(pojo.checkwhitelist) }}</td>
              <el-divider direction="vertical" />
              <td><b>资产提醒白名单</b></td>
              <td>{{ formatBoolean(pojo.assetnotifywhitelist) }}</td>
            </tr>
            <tr>
              <td><b>发现时间</b></td>
              <td>{{ pojo.uptime| dateformat() }}</td>
              <el-divider direction="vertical" />
              <td><b>关闭时间</b></td>
              <td>{{ pojo.downtime | dateformat() }}</td>
              <el-divider direction="vertical" />
              <td><b>修改时间</b></td>
              <td>{{ pojo.changedtime | dateformat() }}</td>
            </tr>
            <tr>
              <td><b>HTTP链接</b></td>
              <td><el-link :href="'http://'+ipv4+':'+pojo.port" target="_blank" :underline="false">点我打开</el-link></td>
              <el-divider direction="vertical" />
              <td><b>HTTPS链接</b></td>
              <td><el-link :href="'https://'+ipv4+':'+pojo.port" target="_blank" :underline="false">点我打开</el-link></td>

            </tr>
          </table>

        </div>
      </el-card>

      <el-card class="box-card">
        <div class="text">
          <table border="0">
            <tr>
              <td>项目部门 项目组 负责人信息</td>
            </tr>
            <tr>
              <td><b>项目组部门</b></td>
              <td>{{ departmentPojo.departmentname }}</td>
              <td><b>项目组</b></td>
              <td>{{ pojo.projectname }}</td>
            </tr>
          </table>
        </div>
        <!-- 负责人 -->
        <el-table :data="contactList" fit>
          <el-table-column prop="name" label="负责人" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="phone" label="电话" />
        </el-table>
      </el-card>

      <!-- 主机信息 -->
      <el-table :data="hostList" fit>
        <el-table-column prop="macaddress" label="mac地址" />
        <el-table-column prop="hostname" label="主机名" />
        <el-table-column prop="ostype" label="OS类型" />
        <el-table-column prop="osversion" label="OS版本" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="owner" label="所有者" />
        <el-table-column prop="activetime" label="发现时间">
          <template slot-scope="scope">
            {{ scope.row.activetime | dateformat() }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
      </el-table>

      <!-- 检测结果 -->
      <el-table :data="checkresultList" fit>
        <el-table-column prop="vulname" label="漏洞名称" />
        <el-table-column prop="name" label="插件名称" />
        <el-table-column prop="risk" label="风险" />
        <el-table-column prop="result" label="检测结果" show-overflow-tooltip />

        <el-table-column prop="activetime" label="发现时间">
          <template slot-scope="scope">
            {{ scope.row.activetime | dateformat() }}
          </template>
        </el-table-column>
        <el-table-column prop="passivetime" label="修复时间">
          <template slot-scope="scope">
            {{ scope.row.passivetime | dateformat() }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
      </el-table>

      <!-- web信息 -->
      <el-table :data="webinfoList" fit>
        <el-table-column prop="title" label="title" />
        <el-table-column prop="bodychildrenstextcontent" label="body内容" show-overflow-tooltip />
        <el-table-column prop="server" label="server" />
        <el-table-column prop="xpoweredby" label="xpoweredby" show-overflow-tooltip />
        <el-table-column prop="setcookie" label="setcookie" show-overflow-tooltip />
        <el-table-column prop="wwwauthenticate" label="认证方式" show-overflow-tooltip />
        <el-table-column prop="crawltime" label="抓取时间">
          <template slot-scope="scope">
            {{ scope.row.crawltime | dateformat() }}
          </template>
        </el-table-column>
      </el-table>
      <!-- url链接 -->
      <el-table :data="urlList" fit>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="url" label="url">
          <template slot-scope="scope">
            <el-link :href="scope.row.url" target="_blank" :underline="false">{{ scope.row.url }}</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- {{ urlList }} -->

    </el-drawer>

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
      <!-- <el-table-column sortable prop="id" label="端口编号" /> -->

      <el-table-column sortable prop="assetipid" label="资产ip" />

      <!-- <el-table-column sortable prop="port" label="端口" /> -->

      <el-table-column sortable prop="port" label="端口">
        <template slot="header">
          <span>端口</span>
          <el-tooltip placement="top">
            <div slot="content">总漏洞数:未修复漏洞数</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-link :underline="false" @click="handleDrawer(scope.row.id) ">
            {{ scope.row.port }}
          </el-link>
          <span v-if=" scope.row.statistic">
            <el-tag size="mini" type="success" effect="plain">{{ scope.row.statistic }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="tabbitmap" label="标签" /> -->
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

      <el-table-column sortable prop="protocol" label="协议" />
      <el-table-column sortable prop="state" label="状态" />
      <el-table-column sortable prop="service" label="服务" />
      <el-table-column sortable prop="version" label="版本" />
      <el-table-column align="center" sortable label="安全检测白名单">
        <template slot="header">
          <span>安全检测白名单</span>
          <el-tooltip placement="top">
            <div slot="content">如果端口在白名单<br>则该端口不会进行安全检测</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span>{{ formatBoolean(scope.row.checkwhitelist) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" sortable label="资产提醒白名单">
        <template slot="header">
          <span>资产提醒白名单</span>
          <el-tooltip placement="top">
            <div slot="content">如果端口在白名单<br>则该端口不会提醒负责人<br>默认提醒不受限制</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span>{{ formatBoolean(scope.row.assetnotifywhitelist) }}</span>
        </template>
      </el-table-column>

      <el-table-column sortable prop="uptime" label="发现时间">
        <template slot-scope="scope">
          {{ scope.row.uptime | dateformat() }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="downtime" label="关闭时间">
        <template slot-scope="scope">
          {{ scope.row.downtime | dateformat() }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="changedtime" label="修改时间">
        <template slot-scope="scope">
          {{ scope.row.changedtime | dateformat() }}
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

        <el-form-item required label="ipv4地址">
          <span>{{ ipv4 }}</span>
          <span v-if="pojo.id==null">
            <el-select v-model="pojo.assetipid" style="width:400px;" filterable remote clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getIpaddressv4List" :loading="searchLoading">
              <el-option v-for="item in ipaddressv4List" :key="item.id" :label="item.ipaddressv4" :value="item.id" />
            </el-select>
          </span>
        </el-form-item>

        <!-- <el-form-item label="资产ip编号"><el-input v-model="pojo.assetipid" style="width:400px;" /></el-form-item> -->
        <el-form-item required label="端口">
          <el-input v-model="pojo.port" style="width:400px;" />
        </el-form-item>
        <!-- <el-form-item prop="port" label="端口">
          <el-select v-model="pojo.port" style="width:400px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getPortList" :loading="searchLoading">
            <el-option v-for="item in portList" :key="item.id" :label="item.port" :value="item.port" /></el-select>
        </el-form-item> -->
        <!-- 新增标签 -->
        <el-form-item label="标签">
          <el-select
            v-model="selectedTabList"
            style="width:400px;"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入名称搜索"
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

        <el-form-item label="协议"><el-input v-model="pojo.protocol" style="width:400px;" /></el-form-item>
        <el-form-item label="状态"><el-input v-model="pojo.state" style="width:400px;" /></el-form-item>
        <el-form-item label="服务"><el-input v-model="pojo.service" style="width:400px;" /></el-form-item>
        <el-form-item label="版本"><el-input v-model="pojo.version" style="width:400px;" /></el-form-item>

        <el-form-item label="白名单">
          <el-switch v-model="pojo.checkwhitelist" active-text="安全检测" />
          <el-switch v-model="pojo.assetnotifywhitelist" active-text="资产提醒" />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="pojo.uptime" style="width:400px;" placeholder="发现时间" type="datetime" />
          <el-date-picker v-model="pojo.downtime" style="width:400px;" placeholder="关闭时间" type="datetime" />
          <el-date-picker v-model="pojo.changedtime" style="width:400px;" placeholder="修改时间" type="datetime" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import assetportApi from '@/api/assetport'
import assetipApi from '@/api/assetip'
import projectinfoApi from '@/api/projectinfo'
import departmentApi from '@/api/department'
import contactProjectinfoApi from '@/api/contactProjectinfo'
import contactApi from '@/api/contact'
import hostApi from '@/api/host'
import checkresultApi from '@/api/checkresult'
import webinfoApi from '@/api/webinfo'
import urlApi from '@/api/url'
import categorytabApi from '@/api/categorytab'

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
      protocolList: [], // 协议
      stateList: [], // 状态
      serviceList: [], // 服务列表
      versionList: [], // 版本列表
      portList: [], // 端口列表
      filename: '',
      listLoading: true,
      searchLoading: false,
      multipleSelection: [],
      downloadLoading: false,
      ipaddressv4List: [],

      // 多表显示
      projectinfoPojo: {},
      departmentPojo: {},
      contactProjectinfoList: [],
      contactList: [],
      hostList: [],
      checkresultList: [],
      webinfoList: [],
      urlList: [],
      webinfoids: [],
      activeNames: ['1'],
      drawer: false,
      ipv4: '',
      tabList: [],

      // 标签
      tabPojo: {},
      tabPojoList: [],
      selectedTabList: [],
      remoteTabOptions: [],
      remoteTabList: [],
      categorytabMap: new Map(),

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
    this.getRemoteTabList()
  },
  created() {
    this.fetchData()
  },
  methods: {
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
    getTabList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          categorytabApi.search(1, 10, { 'name': query }).then(response => {
            this.tabList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.tabList = []
      }
    },
    handleDrawer(id) {
      this.id = id
      this.drawer = true
      assetportApi.findById(id).then(response => {
        if (response.flag) {
          this.pojo = response.data
          this.tabPojoList = this.pojo.tabList
          // 资产ip
          const assetipidRespose = this.pojo.assetipid
          if (assetipidRespose) {
            assetipApi.findById(assetipidRespose).then(response => {
              this.ipv4 = response.data.ipaddressv4
              const projectinfoid = response.data.projectinfoid
              if (projectinfoid) {
                projectinfoApi.findById(projectinfoid).then(response => {
                  this.projectinfoPojo = response.data
                  const departmentid = this.projectinfoPojo.departmentid
                  if (departmentid) {
                    departmentApi.findById(departmentid).then(response => {
                      this.departmentPojo = response.data
                    })
                  }
                })
                // 负责人信息
                contactProjectinfoApi.findAllByProjectinfoid(projectinfoid).then(response => {
                  this.contactProjectinfoList = response.data
                  for (let i = 0; i < this.contactProjectinfoList.length; i++) {
                    contactApi.findById(this.contactProjectinfoList[i].contactid).then(response => {
                      this.contactList.push(response.data)
                    })
                  }
                })
              }
            })
            // 主机信息
            hostApi.findAllByAssetipId(assetipidRespose).then(response => {
              this.hostList = response.data
            })
            // 检测结果
            checkresultApi.findAllByAssetportId(id).then(response => {
              this.checkresultList = response.data
            })
            // web信息
            webinfoApi.findAllByAssetportId(id).then(response => {
              this.webinfoList = response.data
            }).then(() => {
              // url
              for (let i = 0; i < this.webinfoList.length; i++) {
                this.webinfoids.push(this.webinfoList[i].id)
              }
              urlApi.findAllByWebinfoIds(this.webinfoids).then(response => {
                this.urlList = response.data
              }).then(() => {})
            })
          }
        }
      })
    },
    handleDrawerClose() {
      this.drawer = false
      this.closeDialogForm()
    },
    cleanCache() {
      this.closeDialogForm()
    },
    closeDialogForm() {
      this.dialogFormVisible = false
      this.projectinfoPojo = {}
      this.departmentPojo = {}
      this.contactProjectinfoList = []
      this.contactList = []
      this.hostList = []
      this.checkresultList = []
      this.webinfoList = []
      this.urlList = []
      this.webinfoids = []
      this.ipaddressv4List = []
      this.ipv4 = ''
      this.tabList = []
      this.selectedTabList = []
      this.remoteTabOptions = []
      this.tabnameList = []
      this.tabPojoList = []
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
    getServiceList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          assetportApi.search(1, 10, { 'service': query }).then(response => {
            this.serviceList = response.data.rows.filter(item => {
              return item.service.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.serviceList = []
      }
    },
    getVersionList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          assetportApi.search(1, 10, { 'version': query }).then(response => {
            this.versionList = response.data.rows.filter(item => {
              return item.version.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.versionList = []
      }
    },
    getProtocolList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          assetportApi.search(1, 10, { 'protocol': query }).then(response => {
            this.protocolList = response.data.rows.filter(item => {
              return item.protocol.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.protocolList = []
      }
    },
    getStateList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          assetportApi.search(1, 10, { 'state': query }).then(response => {
            this.stateList = response.data.rows.filter(item => {
              return item.state.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.stateList = []
      }
    },
    handleDeleteAll() {
      if (this.multipleSelection && this.multipleSelection.length) {
        this.$confirm('此操作将永久删除已选记录, 包括 [资产端口, 漏洞检测结果, web信息, url信息], 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const ids = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id)
          }
          assetportApi.deleteAllByIds(ids).then(response => {
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
            '资产ip',
            '端口',
            '标签',
            '协议',
            '状态',
            '服务',
            '版本',
            '安全检测白名单',
            '资产提醒白名单',
            '发现时间',
            '关闭时间',
            '修改时间'

          ]
          const filterVal = [
            'assetipid',
            'port',
            'tabname',
            'protocol',
            'state',
            'service',
            'version',
            'checkwhitelist',
            'assetnotifywhitelist',
            'uptime',
            'downtime',
            'changedtime'

          ]
          const list = this.multipleSelection
          for (let i = 0; i < list.length; i++) {
            list[i].uptime = dateformat(list[i].uptime)
            list[i].downtime = dateformat(list[i].downtime)
            list[i].changedtime = dateformat(list[i].changedtime)
            list[i].checkwhitelist = list[i].checkwhitelist ? '是' : ''
            list[i].assetnotifywhitelist = list[i].assetnotifywhitelist ? '是' : ''
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
      this.protocolList = []
      this.stateList = []
      this.options = []
      this.serviceList = []
      this.versionList = []
      this.portList = []
      this.ipaddressv4List = []
      this.tabList = []
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
      assetportApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
      this.listLoading = false
    },
    handleSave() {
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
      assetportApi.update(this.id, this.pojo).then(response => {
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
        assetportApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
            this.tabPojoList = this.pojo.tabList
            for (var i = 0; i < this.tabPojoList.length; i++) {
              this.categorytabMap.set(this.tabPojoList[i].name, this.tabPojoList[i].id)
              this.selectedTabList.push(this.tabPojoList[i].name)
            }
            assetipApi.findById(this.pojo.assetipid).then(response => {
              if (response.flag) {
                this.ipv4 = response.data.ipaddressv4
              }
            })
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除已选记录, 包括 [资产端口, 漏洞检测结果, web信息, url信息], 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        assetportApi.deleteById(id).then(response => {
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
<style>
.el-drawer__body {
   overflow: auto;
}
 .text {
    font-size: 14px;
    line-height: 20px
  }
</style>
