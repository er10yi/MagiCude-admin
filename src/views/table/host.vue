<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title"><i class="header-icon el-icon-info" />菜单栏隐藏与显示</template>
        <!-- 查询条件 -->
        <el-form ref="searchform" inline size="small" :model="searchMap">
          <!-- <el-form-item label="资产ip编号">
        <el-input v-model="searchMap.assetipid" prop="assetipid" clearable placeholder="资产ip编号" /></el-form-item> -->

          <el-form-item prop="assetipid" label="ipv4地址">
            <el-select v-model="searchMap.assetip" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getIpaddressv4List" :loading="searchLoading">
              <el-option v-for="item in ipaddressv4List" :key="item.id" :label="item.ipaddressv4" :value="item.ipaddressv4" />
            </el-select>
          </el-form-item>

          <el-form-item prop="macaddress" label="mac地址">
            <el-select v-model="searchMap.macaddress" style="width:130px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getMacaddressList" :loading="searchLoading">
              <el-option v-for="item in macaddressList" :key="item.id" :label="item.macaddress" :value="item.macaddress" /></el-select>
          </el-form-item>

          <el-form-item prop="hostname" label="主机/域名">
            <el-select v-model="searchMap.hostname" style="width:130px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getHostnameList" :loading="searchLoading">
              <el-option v-for="item in hostnameList" :key="item.id" :label="item.hostname" :value="item.hostname" /></el-select>
          </el-form-item>

          <el-form-item prop="hostname" label="子域名">
            <el-select v-model="searchMap.subdomain" style="width:130px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getSubdomainList" :loading="searchLoading">
              <el-option v-for="item in subdomainList" :key="item.id" :label="item.subdomain" :value="item.subdomain" /></el-select>
          </el-form-item>

          <el-form-item prop="ostype" label="OS类型">
            <el-select v-model="searchMap.ostype" style="width:130px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getOstypeList" :loading="searchLoading">
              <el-option v-for="item in ostypeList" :key="item.id" :label="item.ostype" :value="item.ostype" /></el-select>
          </el-form-item>

          <el-form-item prop="osversion" label="OS版本">
            <el-select v-model="searchMap.osversion" style="width:130px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getOsversionList" :loading="searchLoading">
              <el-option v-for="item in osversionList" :key="item.id" :label="item.osversion" :value="item.osversion" /></el-select>
          </el-form-item>

          <el-form-item prop="type" label="类型">
            <el-select v-model="searchMap.type" style="width:130px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getTypeList" :loading="searchLoading">
              <el-option v-for="item in typeList" :key="item.id" :label="item.type" :value="item.type" /></el-select>
          </el-form-item>

          <el-form-item prop="owner" label="所有者">
            <el-select v-model="searchMap.owner" style="width:130px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getOwnerList" :loading="searchLoading">
              <el-option v-for="item in ownerList" :key="item.id" :label="item.owner" :value="item.owner" /></el-select>
          </el-form-item>
          <el-form-item prop="uptime" label="发现时间">
            <el-date-picker v-model="searchMap.activetime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" range-separator="-" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:350px;" />
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-model="searchMap.remark" prop="remark" clearable placeholder="备注" /></el-form-item>

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
            <el-button type="primary" @click="handleEdit('')">新增</el-button>
          </el-form-item>
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
      <!-- <el-table-column sortable prop="id" label="主机编号" /> -->

      <el-table-column sortable prop="assetipid" label="资产ip" />
      <el-table-column prop="appsysname" label="应用系统">
        <template slot-scope="scope">
          <span v-if="scope.row.appsysname">
            <span
              v-for="item in scope.row.appsysname.split(',')"
              :key="item.id"
              :label="item"
              :value="item"
            >
              <span v-if="item">
                <el-tag size="mini" type="info" effect="plain">{{ item }}</el-tag>
              </span>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="macaddress" label="mac地址" />
      <el-table-column sortable prop="hostname" label="主机/域名" />

      <el-table-column prop="subdomain" label="子域名">
        <template slot-scope="scope">
          <span v-if="scope.row.subdomain">
            <span
              v-for="item in scope.row.subdomain.split(',')"
              :key="item.id"
              :label="item"
              :value="item"
            >
              <span v-if="item">
                <el-tag size="mini" type="info" effect="plain">{{ item }}</el-tag>
              </span>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column sortable prop="ostype" label="OS类型" />
      <el-table-column sortable prop="osversion" label="OS版本" />
      <el-table-column sortable prop="type" label="类型" />
      <el-table-column sortable prop="owner" label="所有者" />
      <!-- <el-table-column sortable prop="activetime" label="发现时间" /> -->
      <el-table-column sortable prop="activetime" label="发现时间">
        <template slot-scope="scope">
          {{ scope.row.activetime | dateformat() }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="remark" label="备注" />

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

        <!-- <el-form-item label="资产ip编号"><el-input v-model="pojo.assetipid" style="width:400px;" /></el-form-item> -->

        <el-form-item label="ipv4地址">
          <span>{{ ipv4 }}</span>
          <span v-if="pojo.id==null">
            <el-select v-model="pojo.assetipid" style="width:400px;" filterable remote clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getIpaddressv4List" :loading="searchLoading">
              <el-option v-for="item in ipaddressv4List" :key="item.id" :label="item.ipaddressv4" :value="item.id" />
            </el-select>
          </span>
        </el-form-item>

        <el-form-item label="mac地址"><el-input v-model="pojo.macaddress" style="width:400px;" /></el-form-item>
        <el-form-item required label="主机/域名"><el-input v-model="pojo.hostname" style="width:400px;" /></el-form-item>

        <el-form-item label="子域名"><el-input v-model="pojo.subdomain" type="textarea" style="width:400px;" placeholder="英文逗号分隔如: sub.domain.com,sub2.domain.org" />
        </el-form-item>

        <el-form-item label="OS类型"><el-input v-model="pojo.ostype" style="width:400px;" /></el-form-item>
        <el-form-item label="OS版本"><el-input v-model="pojo.osversion" style="width:400px;" /></el-form-item>
        <el-form-item label="类型"><el-input v-model="pojo.type" style="width:400px;" /></el-form-item>
        <el-form-item required label="所有者"><el-input v-model="pojo.owner" style="width:400px;" /></el-form-item>

        <!-- <el-form-item label="发现时间"><el-input v-model="pojo.activetime" style="width:400px;" /></el-form-item> -->
        <el-form-item label="发现时间">
          <el-date-picker v-model="pojo.activetime" style="width:400px;" placeholder="发现时间" type="datetime" />
        </el-form-item>

        <el-form-item label="备注"><el-input v-model="pojo.remark" style="width:400px;" /></el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import hostApi from '@/api/host'
import assetipApi from '@/api/assetip'
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
      ipaddressv4List: [],
      searchLoading: false,
      assetIpMap: [], // ip编号和ip，用于将id转换成ip
      assetipids: [], // 根据当前页面的ip编号数组，获取ip信息
      assetIpIdAndIpList: [],
      hostnameList: [],
      macaddressList: [],
      ostypeList: [],
      osversionList: [],
      ownerList: [],
      typeList: [],
      activeNames: ['1'],
      ipv4: '',
      subdomainList: [],

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
    getSubdomainList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          hostApi.search(1, 10, { 'subdomain': query }).then(response => {
            this.subdomainList = response.data.rows.filter(item => {
              return item.subdomain.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.subdomainList = []
      }
    },
    cleanCache() {
      this.closeDialogForm()
    },
    closeDialogForm() {
      this.dialogFormVisible = false
      this.ipaddressv4List = []
      this.ipv4 = ''
    },
    getHostnameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          hostApi.search(1, 10, { 'hostname': query }).then(response => {
            this.hostnameList = response.data.rows.filter(item => {
              return item.hostname.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.hostnameList = []
      }
    },
    getMacaddressList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          hostApi.search(1, 10, { 'macaddress': query }).then(response => {
            this.macaddressList = response.data.rows.filter(item => {
              return item.macaddress.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.macaddressList = []
      }
    },
    getOstypeList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          hostApi.search(1, 10, { 'ostype': query }).then(response => {
            this.ostypeList = response.data.rows.filter(item => {
              return item.ostype.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.ostypeList = []
      }
    },
    getOsversionList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          hostApi.search(1, 10, { 'osversion': query }).then(response => {
            this.osversionList = response.data.rows.filter(item => {
              return item.osversion.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.osversionList = []
      }
    },
    getOwnerList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          hostApi.search(1, 10, { 'owner': query }).then(response => {
            this.ownerList = response.data.rows.filter(item => {
              return item.owner.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.ownerList = []
      }
    },
    getTypeList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          hostApi.search(1, 10, { 'type': query }).then(response => {
            this.typeList = response.data.rows.filter(item => {
              return item.type.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.typeList = []
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
          hostApi.deleteAllByIds(ids).then(response => {
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
            '应用系统',
            'mac地址',
            '主机/域名',
            '子域名',
            'OS类型',
            'OS版本',
            '类型',
            '所有者',
            '发现时间',
            '备注'

          ]
          const filterVal = [
            'assetipid',
            'appsysname',
            'macaddress',
            'hostname',
            'subdomain',
            'ostype',
            'osversion',
            'type',
            'owner',
            'activetime',
            'remark'

          ]
          const list = this.multipleSelection
          for (let i = 0; i < list.length; i++) {
            list[i].activetime = dateformat(list[i].activetime)
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
      this.hostnameList = {}
      this.macaddressList = {}
      this.ostypeList = {}
      this.osversionList = {}
      this.ownerList = {}
      this.typeList = {}
      this.ipaddressv4List = {}
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
      hostApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
      this.listLoading = false
    },
    handleSave() {
      hostApi.update(this.id, this.pojo).then(response => {
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
        hostApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
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
      this.$confirm('此操作将永久删除已选记录, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        hostApi.deleteById(id).then(response => {
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
