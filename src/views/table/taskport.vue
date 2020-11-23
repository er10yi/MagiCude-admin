<template>
  <div>
    <br>
    <!-- 查询条件 -->
    <el-form ref="searchform" inline size="small" :model="searchMap">
      <!-- <el-form-item label="任务ip编号">
        <el-input v-model="searchMap.taskipid" prop="taskipid" clearable placeholder="任务ip编号" /></el-form-item> -->

      <el-form-item prop="taskid" label="任务名称">
        <el-select v-model="searchMap.taskid" style="width:150px;" filterable remote clearable placeholder="请输入" :remote-method="getTaskNameList" :loading="searchLoading">
          <el-option v-for="item in taskNameList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item prop="taskipid" label="任务ip">
        <el-select v-model="searchMap.taskipid" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getIpaddressv4List" :loading="searchLoading">
          <el-option v-for="item in ipaddressv4List" :key="item.id" :label="item.ipaddressv4" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item prop="port" label="端口">
        <el-select v-model="searchMap.port" style="width:130px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getPortList" :loading="searchLoading">
          <el-option v-for="item in portList" :key="item.id" :label="item.port" :value="item.port" /></el-select>
      </el-form-item>
      <el-form-item prop="protocol" label="协议">
        <el-select v-model="searchMap.protocol" style="width:130px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getProtocolList" :loading="searchLoading">
          <el-option v-for="item in protocolList" :key="item.id" :label="item.protocol" :value="item.protocol" /></el-select>
      </el-form-item>
      <el-form-item prop="state" label="端口状态">
        <el-select v-model="searchMap.state" style="width:130px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getStateList" :loading="searchLoading">
          <el-option v-for="item in stateList" :key="item.id" :label="item.state" :value="item.state" /></el-select>
      </el-form-item>
      <el-form-item prop="service" label="服务">
        <el-select v-model="searchMap.service" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getServiceList" :loading="searchLoading">
          <el-option v-for="item in serviceList" :key="item.id" :label="item.service" :value="item.service" /></el-select>
      </el-form-item>
      <el-form-item prop="version" label="版本">
        <el-select v-model="searchMap.version" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getVersionList" :loading="searchLoading">
          <el-option v-for="item in versionList" :key="item.id" :label="item.version" :value="item.version" /></el-select>
      </el-form-item>
      <el-form-item prop="checkwhitelist" label="安全检测白名单">
        <el-switch v-model="searchMap.checkwhitelist" />
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
      <!-- <el-table-column sortable prop="id" label="端口编号" /> -->
      <el-table-column sortable prop="taskname" label="任务名称" />

      <el-table-column sortable prop="taskipid" label="任务ip" />
      <!-- <el-table-column sortable prop="taskipid" label="任务ip">
        <template slot-scope="scope">
          {{ getTaskipById(scope.row.taskipid) }}
        </template>
      </el-table-column> -->

      <el-table-column sortable prop="port" label="端口" />
      <el-table-column sortable prop="protocol" label="协议" />
      <el-table-column sortable prop="state" label="开放状态" />
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
      <el-form label-width="100px">

        <!-- <el-form-item label="任务ip编号"><el-input v-model="pojo.taskipid" style="width:300px;" /></el-form-item> -->

        <el-form-item required label="ipv4地址">
          <span>{{ ipv4 }}</span>
          <span v-if="pojo.id==null">
            <el-select v-model="pojo.taskipid" style="width:300px;" filterable remote clearable placeholder="请输入" :remote-method="getIpaddressv4List" :loading="searchLoading">
              <el-option v-for="item in ipaddressv4List" :key="item.id" :label="item.ipaddressv4" :value="item.id" />
            </el-select>
          </span>
        </el-form-item>

        <el-form-item label="端口"><el-input v-model="pojo.port" style="width:300px;" /></el-form-item>
        <el-form-item label="协议"><el-input v-model="pojo.protocol" style="width:300px;" /></el-form-item>
        <el-form-item label="开放状态"><el-input v-model="pojo.state" style="width:300px;" /></el-form-item>
        <el-form-item label="服务"><el-input v-model="pojo.service" style="width:300px;" /></el-form-item>
        <el-form-item label="版本"><el-input v-model="pojo.version" style="width:300px;" /></el-form-item>
        <el-form-item label="白名单">
          <el-switch v-model="pojo.checkwhitelist" active-text="安全检测" />
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
import taskportApi from '@/api/taskport'
import taskipApi from '@/api/taskip'
import taskApi from '@/api/task'

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
      searchLoading: false,
      filename: '',
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      protocolList: [], // 协议
      stateList: [], // 状态
      serviceList: [], // 服务列表
      versionList: [], // 版本列表
      portList: [], // 端口列表
      ipaddressv4List: [],
      ipv4: '',
      taskNameList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getTaskNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          taskApi.search(1, 10, { 'name': query }).then(response => {
            this.taskNameList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.taskNameList = []
      }
    },
    cleanCache() {
      this.closeDialogForm()
    },
    closeDialogForm() {
      this.dialogFormVisible = false
      this.serviceList = []
      this.portList = []
      this.ipv4 = ''
      this.ipaddressv4List = []
      this.taskNameList = []
    },
    getIpaddressv4List(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          taskipApi.search(1, 10, { 'ipaddressv4': query }).then(response => {
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
          taskportApi.search(1, 10, { 'port': query }).then(response => {
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
          taskportApi.search(1, 10, { 'service': query }).then(response => {
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
          taskportApi.search(1, 10, { 'version': query }).then(response => {
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
          taskportApi.search(1, 10, { 'protocol': query }).then(response => {
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
          taskportApi.search(1, 10, { 'state': query }).then(response => {
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
          taskportApi.deleteAllByIds(ids).then(response => {
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
            '任务名称',
            '任务ip',
            '端口',
            '协议',
            '开放状态',
            '服务',
            '版本',
            '安全检测白名单'

          ]
          const filterVal = [
            'taskname',
            'taskipid',
            'port',
            'protocol',
            'state',
            'service',
            'version',
            'checkwhitelist'

          ]
          const list = this.multipleSelection
          for (let i = 0; i < list.length; i++) {
            list[i].checkwhitelist = list[i].checkwhitelist ? '是' : ''
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
      this.ipaddressv4List = []
      this.protocolList = []
      this.stateList = []
      this.serviceList = []
      this.versionList = []
      this.portList = []
      this.taskNameList = []
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
      taskportApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSave() {
      taskportApi.update(this.id, this.pojo).then(response => {
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
        taskportApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
            taskipApi.findById(this.pojo.taskipid).then(response => {
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
        taskportApi.deleteById(id).then(response => {
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
