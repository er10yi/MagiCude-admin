<template>
  <div>
    <br>
    <!-- 查询条件 -->
    <el-form ref="searchform" inline size="small" :model="searchMap">
      <el-form-item prop="name" label="漏洞">
        <el-select v-model="searchMap.vulnid" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getNameList" :loading="searchLoading">
          <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select></el-form-item>

      <el-form-item prop="solution" label="修复方案">
        <el-select v-model="searchMap.solution" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getSolutionList" :loading="searchLoading">
          <el-option v-for="item in solutionList" :key="item.id" :label="item.solution" :value="item.solution" />
        </el-select>
      </el-form-item>
      <el-form-item prop="codedemo" label="修复代码示例">
        <el-select v-model="searchMap.codedemo" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getCodedemoList" :loading="searchLoading">
          <el-option v-for="item in codedemoList" :key="item.id" :label="item.codedemo" :value="item.codedemo" />
        </el-select>
      </el-form-item>
      <el-form-item prop="configdemo" label="修复配置示例">
        <el-select v-model="searchMap.configdemo" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getConfigdemoList" :loading="searchLoading">
          <el-option v-for="item in configdemoList" :key="item.id" :label="item.configdemo" :value="item.configdemo" />
        </el-select>
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
      <!-- <el-table-column sortable prop="id" label="修复方案编号" /> -->
      <el-table-column sortable prop="vulnid" label="漏洞" />
      <el-table-column sortable prop="solution" label="修复方案" />
      <el-table-column sortable prop="codedemo" label="修复代码示例" />
      <el-table-column sortable prop="configdemo" label="修复配置示例" />

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

        <el-form-item prop="name" label="漏洞">
          {{ vulname }}
          <el-select v-model="pojo.vulnid" style="width:300px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getNameList" :loading="searchLoading">
            <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select></el-form-item>
        <el-form-item label="修复方案"><el-input v-model="pojo.solution" autosize type="textarea" /></el-form-item>
        <el-form-item label="修复代码示例"><el-input v-model="pojo.codedemo" autosize type="textarea" /></el-form-item>
        <el-form-item label="修复配置示例"><el-input v-model="pojo.configdemo" autosize type="textarea" /></el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import solutionApi from '@/api/solution'
import vulnApi from '@/api/vuln'

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

      searchLoading: false,
      vulnList: [],
      solutionList: [],
      codedemoList: [],
      configdemoList: [],
      nameList: [],
      vulname: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          vulnApi.search(1, 10, { 'name': query }).then(response => {
            this.nameList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.nameList = []
      }
    },
    cleanCache() {
      this.closeDialogForm()
    },
    getConfigdemoList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          solutionApi.search(1, 10, { 'configdemo': query }).then(response => {
            this.configdemoList = response.data.rows.filter(item => {
              return item.configdemo.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.configdemoList = []
      }
    },
    getCodedemoList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          solutionApi.search(1, 10, { 'codedemo': query }).then(response => {
            this.codedemoList = response.data.rows.filter(item => {
              return item.codedemo.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.codedemoList = []
      }
    },
    getSolutionList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          solutionApi.search(1, 10, { 'solution': query }).then(response => {
            this.solutionList = response.data.rows.filter(item => {
              return item.solution.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.solutionList = []
      }
    },
    getVulnList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          vulnApi.search(1, 10, { 'name': query }).then(response => {
            this.vulnList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.vulnList = []
      }
    },
    closeDialogForm() {
      this.dialogFormVisible = false
      this.vulnList = []
      this.nameList = []
      this.vulname = ''
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
          solutionApi.deleteAllByIds(ids).then(response => {
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
            '漏洞',
            '修复方案',
            '修复代码示例',
            '修复配置示例'

          ]
          const filterVal = [
            'vulnid',
            'solution',
            'codedemo',
            'configdemo'

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
      this.vulnList = []
      this.solutionList = []
      this.codedemoList = []
      this.configdemoList = []
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
      solutionApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      }).then(() => {
        this.getVuln()
      })
    },
    handleSave() {
      solutionApi.update(this.id, this.pojo).then(response => {
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
        solutionApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
          }
          vulnApi.findById(this.pojo.vulnid).then(response => {
            this.vulname = response.data.name
          })
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
        solutionApi.deleteById(id).then(response => {
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
