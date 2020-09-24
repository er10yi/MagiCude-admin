<template>
  <div>
    <br>
    <!-- 查询条件 -->
    <el-form ref="searchform" inline size="small" :model="searchMap">
      <!-- <el-form-item label="ip">
        <el-input v-model="searchMap.ip" prop="ip" clearable placeholder="ip" /></el-form-item> -->
      <!-- <el-form-item label="检测白名单">
        <el-input v-model="searchMap.checkwhitelist" prop="checkwhitelist" clearable placeholder="检测白名单" /></el-form-item>
      <el-form-item label="提醒白名单">
        <el-input v-model="searchMap.notifywhitelist" prop="notifywhitelist" clearable placeholder="提醒白名单" /></el-form-item> -->

      <el-form-item prop="ip" label="ip地址">
        <el-select v-model="searchMap.ip" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词" :remote-method="getIpList" :loading="searchLoading">
          <el-option v-for="item in ipList" :key="item.id" :label="item.ip" :value="item.ip" /></el-select>
      </el-form-item>

      <el-form-item prop="checkwhitelist" label="检测白名单">
        <el-switch v-model="searchMap.checkwhitelist" />
      </el-form-item>
      <el-form-item prop="notifywhitelist" label="提醒白名单">
        <el-switch v-model="searchMap.notifywhitelist" />
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
      <!-- <el-table-column sortable prop="id" label="编号" /> -->
      <!-- <el-table-column sortable prop="ip" label="ip" width="130" /> -->
      <!-- <el-table-column sortable prop="checkwhitelist" label="检测白名单" />
      <el-table-column sortable prop="notifywhitelist" label="提醒白名单" /> -->

      <el-table-column sortable align="center" prop="ip" label="ip" width="150">
        <template slot="header">
          <span>ip</span>
          <el-tooltip placement="top">
            <div slot="content">检测白名单及提醒白名单都为false<br>则该ip为ip-端口白名单</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="checkwhitelist" label="检测白名单" width="150">
        <template slot="header">
          <span>检测白名单</span>
          <el-tooltip placement="top">
            <div slot="content">如果ip在白名单<br>则该ip及ip的所有端口<br>都不会进行安全检测（即使端口不在白名单)</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span>{{ formatBoolean(scope.row.checkwhitelist) }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="提醒白名单" width="150">
        <template slot="header">
          <span>提醒白名单</span>
          <el-tooltip placement="top">
            <div slot="content">如果ip在白名单<br>则该ip及ip的所有端口<br>都不提醒负责人（即使端口不在白名单）<br>默认提醒不受限制</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span>{{ formatBoolean(scope.row.notifywhitelist) }}</span>
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

        <!-- <el-form-item label="ip"><el-input v-model="pojo.ip" style="width:300px;" /></el-form-item> -->

        <el-form-item prop="ip" label="ipv4地址">
          <el-select v-model="pojo.ip" style="width:300px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词（搜索资产ip）" :remote-method="getIpaddressv4List" :loading="searchLoading">
            <el-option v-for="item in ipaddressv4List" :key="item.id" :label="item.ipaddressv4" :value="item.ipaddressv4" /></el-select>
        </el-form-item>

        <el-form-item label="检测白名单">
          <el-switch v-model="pojo.checkwhitelist" active-text="检测白名单" />
        </el-form-item>
        <el-form-item label="提醒白名单">
          <el-switch v-model="pojo.notifywhitelist" active-text="提醒白名单" />
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
import ipwhitelistApi from '@/api/ipwhitelist'
import assetipApi from '@/api/assetip'

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
      ipList: [],
      searchLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    cleanCache() {
      this.closeDialogForm()
    },
    getIpList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          ipwhitelistApi.search(1, 10, { 'ip': query }).then(response => {
            this.ipList = response.data.rows.filter(item => {
              return item.ip.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.ipList = []
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

    closeDialogForm() {
      this.dialogFormVisible = false
      this.ipList = []
      this.ipaddressv4List = []
    },

    handleDeleteAll() {
      if (this.multipleSelection && this.multipleSelection.length) {
        this.$confirm('此操作将永久删除已选记录, 包括[ip白名单, ip-端口白名单], 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const ids = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id)
          }
          ipwhitelistApi.deleteAllByIds(ids).then(response => {
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
            '检测白名单',
            '提醒白名单'

          ]
          const filterVal = [
            'ip',
            'checkwhitelist',
            'notifywhitelist'

          ]
          const list = this.multipleSelection
          for (let i = 0; i < list.length; i++) {
            list[i].checkwhitelist = list[i].checkwhitelist ? '是' : ''
            list[i].notifywhitelist = list[i].notifywhitelist ? '是' : ''
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
      this.ipList = []
      this.ipaddressv4List = []
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
      ipwhitelistApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSave() {
      ipwhitelistApi.update(this.id, this.pojo).then(response => {
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
        ipwhitelistApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除已选记录, 包括[ip白名单, ip-端口白名单], 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        ipwhitelistApi.deleteById(id).then(response => {
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
