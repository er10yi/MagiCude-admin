<template>
  <div>

    <br>
    <!-- 查询条件 -->
    <el-form ref="searchform" inline size="mini" :model="searchMap">
      <!-- <el-form-item label="名称">
        <el-input v-model="searchMap.name" prop="name" clearable placeholder="名称" /></el-form-item> -->

      <el-form-item prop="name" label="名称">
        <el-select v-model="searchMap.name" filterable remote allow-create default-first-option clearable placeholder="名称" style="width:100px;" :remote-method="getNameList" :loading="searchLoading">
          <el-option v-for="item in pluginnameList" :key="item.id" :label="item.name" :value="item.name" /></el-select>
      </el-form-item>

      <el-form-item prop="args" label="参数">
        <el-select v-model="searchMap.args" filterable remote allow-create default-first-option clearable placeholder="参数" style="width:100px;" :remote-method="getArgsList" :loading="searchLoading">
          <el-option v-for="item in argsList" :key="item.id" :label="item.args" :value="item.args" /></el-select>
      </el-form-item>

      <el-form-item label="风险">
        <el-radio-group v-model="searchMap.risk" size="mini">
          <el-radio-button label="信息" />
          <el-radio-button label="低危" />
          <el-radio-button label="中危" />
          <el-radio-button label="高危" />
          <el-radio-button label="严重" />
          <el-radio-button label="致命" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="searchMap.type" size="mini">
          <el-radio-button label="selfd" />
          <el-radio-button label="nse" />
        </el-radio-group>

      </el-form-item>
      <!-- <el-form-item label="超时">
        <el-input v-model="searchMap.timeout" prop="timeout" clearable placeholder="超时" /></el-form-item> -->

      <el-form-item>
        <el-button type="primary" @click="fetchData()">查询</el-button>
        <el-button type="info" @click="resetForm('searchform')">重置</el-button>
      </el-form-item>
      <!-- 操作 -->
      <el-form-item>
        <el-button type="success" icon="el-icon-unlock" @click="enablePlugin">启用</el-button>
        <el-tooltip placement="top">
          <div slot="content">不选择插件, 则禁用所有已启用插件</div>
          <el-button type="danger" icon="el-icon-lock" @click="disablePlugin">禁用</el-button>
        </el-tooltip>

      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table
      ref="multipleTable"
      :data="list"
      fit
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="序号" type="index" :index="1" align="center" width="50" />
      <!-- <el-table-column sortable prop="id" label="插件配置编号" /> -->
      <el-table-column sortable prop="name" label="名称" />
      <el-table-column sortable prop="args" label="参数" show-overflow-tooltip />
      <el-table-column sortable prop="risk" label="风险" />
      <el-table-column sortable prop="type" label="类型" />
      <!-- <el-table-column sortable prop="timeout" label="超时(毫秒)" /> -->
    </el-table>

    <!-- 底部分页 -->
    <el-pagination
      :current-page.sync="currentPage"
      :page-sizes="[5,10,15,20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
import pluginconfigApi from '@/api/pluginconfig'

export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 5, // 每页大小
      searchMap: {}, // 查询条件
      dialogFormVisible: false, // 编辑窗口是否可见
      pojo: {}, // 编辑表单绑定的实体对象
      id: '', // 当前用户修改的ID

      multipleSelection: [],
      pluginnameList: [],
      argsList: [],
      searchLoading: false,
      taskPluginPojoList: []

    }
  },
  created() {
    this.fetchData()
  },
  methods: {

    cleanCache() {
      this.closeDialogForm()
    },
    getArgsList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          pluginconfigApi.search(1, 10, { 'args': query }).then(response => {
            this.argsList = response.data.rows.filter(item => {
              return item.args.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.argsList = []
      }
    },
    getNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          pluginconfigApi.search(1, 10, { 'name': query }).then(response => {
            this.pluginnameList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.pluginnameList = []
      }
    },
    closeDialogForm() {
      this.dialogFormVisible = false
    },

    enablePlugin() {
      if (this.multipleSelection && this.multipleSelection.length) {
        console.log(this.multipleSelection)

        this.$refs.multipleTable.clearSelection()
      } else {
        this.$message({
          message: '^_^至少选择一条记录哦~',
          type: 'info'
        })
      }
    },
    disablePlugin() {
      if (this.multipleSelection && this.multipleSelection.length) {
        console.log(this.multipleSelection)

        this.$refs.multipleTable.clearSelection()
      } else {
        // 禁用所有插件
        // taskpluginconfigApi.deleteAllByTaskId()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    resetForm(formName) { // 清空搜索表单
      this.$refs[formName].resetFields()
      this.searchMap = {}
      this.pluginnameList = []
      this.argsList = []
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
      pluginconfigApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    handleSave() {
      pluginconfigApi.update(this.id, this.pojo).then(response => {
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
        pluginconfigApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
            this.getTaskPluginByTaskId(id)
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除已选记录信息, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        pluginconfigApi.deleteById(id).then(response => {
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
