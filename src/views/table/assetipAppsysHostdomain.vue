<template>
  <div>
    <br>
    <!-- 查询条件 -->
    <el-form ref="searchform" inline size="small" :model="searchMap">
      <el-form-item label="资产ip编号">
        <el-input v-model="searchMap.assetipid" prop="assetipid" clearable placeholder="资产ip编号" />
      </el-form-item>
      <el-form-item label="应用系统编号">
        <el-input v-model="searchMap.appsysid" prop="appsysid" clearable placeholder="应用系统编号" />
      </el-form-item>
      <el-form-item label="主机域名编号">
        <el-input v-model="searchMap.hostdomainid" prop="hostdomainid" clearable placeholder="主机域名编号" />
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
      <el-table-column sortable prop="id" label="编号" />
      <el-table-column sortable prop="assetipid" label="资产ip编号" />
      <el-table-column sortable prop="assetportid" label="资产端口编号" />
      <el-table-column sortable prop="appsysid" label="应用系统编号" />
      <el-table-column sortable prop="hostdomainid" label="主机域名编号" />

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

        <el-form-item label="资产ip编号"><el-input v-model="pojo.assetipid" style="width:400px;" /></el-form-item>
        <el-form-item label="应用系统编号"><el-input v-model="pojo.appsysid" style="width:400px;" /></el-form-item>
        <el-form-item label="主机域名编号"><el-input v-model="pojo.hostdomainid" style="width:400px;" /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import assetipAppsysHostdomainApi from '@/api/assetipAppsysHostdomain'
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
    cleanCache() {
      this.closeDialogForm()
    },
    closeDialogForm() {
      this.dialogFormVisible = false
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
          assetipAppsysHostdomainApi.deleteAllByIds(ids).then(response => {
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
            '资产ip编号',
            '应用系统编号',
            '主机域名编号'

          ]
          const filterVal = [
            'assetipid',
            'appsysid',
            'hostdomainid'
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
      assetipAppsysHostdomainApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSave() {
      assetipAppsysHostdomainApi.update(this.id, this.pojo).then(response => {
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
        assetipAppsysHostdomainApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
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
        assetipAppsysHostdomainApi.deleteById(id).then(response => {
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
