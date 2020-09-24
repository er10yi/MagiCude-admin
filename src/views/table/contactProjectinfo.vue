<template>
  <div>
    <br>
    <!-- 查询条件 -->
    <el-form ref="searchform" inline size="small" :model="searchMap">
      <el-form-item prop="contactid" label="联系人">
        <el-select v-model="searchMap.contactid" style="width:150px;" filterable remote clearable placeholder="请输入关键词" :remote-method="getContactList" :loading="searchLoading">
          <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item prop="projectinfoid" label="项目信息">
        <el-select v-model="searchMap.projectinfoid" style="width:150px;" filterable remote clearable placeholder="请输入关键词" :remote-method="getProjectinfoList" :loading="searchLoading">
          <el-option v-for="item in projectnameList" :key="item.id" :label="item.projectname" :value="item.id" />
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
        <el-tooltip placement="top">
          <div slot="content">需要新建联系人及<br>项目信息<br>才能新增关联</div>
          <el-button type="primary" @click="handleEdit('')">新增</el-button>
        </el-tooltip>

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

      <el-table-column sortable prop="contactid" width="250" label="联系人">
        <template slot-scope="scope">
          {{ getContactname(scope.row.contactid) }}
        </template>
      </el-table-column>

      <el-table-column sortable prop="projectinfoid" width="400" label="项目信息">
        <template slot-scope="scope">
          {{ getProjectname(scope.row.projectinfoid) }}
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

        <!-- <el-form-item label="联系编号"><el-input v-model="pojo.contactid" style="width:300px;" /></el-form-item> -->
        <!-- <el-form-item label="项目信息编号"><el-input v-model="pojo.projectinfoid" style="width:300px;" /></el-form-item> -->

        <el-form-item required label="联系人">
          <el-select v-model="pojo.contactid" style="width:300px;" filterable clearable placeholder="请输入关键词">
            <el-option
              v-for="item in contactList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item required label="项目信息">
          <el-select v-model="pojo.projectinfoid" style="width:300px;" filterable clearable placeholder="请输入关键词">
            <el-option
              v-for="item in projectInfoList"
              :key="item.id"
              :label="item.projectname"
              :value="item.id"
            />
          </el-select>
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
import contactProjectinfoApi from '@/api/contactProjectinfo'
import contactApi from '@/api/contact'
import projectinfoApi from '@/api/projectinfo'

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
      nameList: [],
      projectnameList: [],
      projectInfoList: [],
      contactList: [],
      contactMap: new Map(),
      projectInfoMap: new Map()

    }
  },
  created() {
    this.getContact()
    this.getProjectInfo()
    this.fetchData()
  },
  methods: {
    cleanCache() {
      this.closeDialogForm()
    },
    closeDialogForm() {
      this.dialogFormVisible = false
      this.nameList = []
      this.projectnameList = []
    },
    getContactname(id) { // 根据id从map获取联系人
      return this.contactMap.get(id)
    },
    getProjectname(id) { // 根据id从map获取项目名字
      return this.projectInfoMap.get(id)
    },
    getContact() {
      contactApi.getList().then(response => {
        this.contactList = response.data
        for (let i = 0; i < this.contactList.length; i++) { // 将项目id和name封装到map中
          this.contactMap.set(this.contactList[i].id, this.contactList[i].name)
        }
      }
      )
    },
    getProjectInfo() {
      projectinfoApi.getList().then(response => {
        this.projectInfoList = response.data
        for (let i = 0; i < this.projectInfoList.length; i++) { // 将项目id和name封装到map中
          this.projectInfoMap.set(this.projectInfoList[i].id, this.projectInfoList[i].projectname)
        }
      }
      )
    },
    getContactList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          contactApi.search(1, 10, { 'name': query }).then(response => {
            this.nameList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.nameList = []
      }
    },
    getProjectinfoList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          projectinfoApi.search(1, 10, { 'projectname': query }).then(response => {
            this.projectnameList = response.data.rows.filter(item => {
              return item.projectname.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.projectnameList = []
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
          contactProjectinfoApi.deleteAllByIds(ids).then(response => {
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
            '联系人',
            '项目信息'
          ]
          const filterVal = [
            'contactid',
            'projectinfoid'
          ]
          const list = this.multipleSelection
          for (let i = 0; i < list.length; i++) {
            list[i].contactid = this.getContactname(list[i].contactid)
            list[i].projectinfoid = this.getProjectname(list[i].projectinfoid)
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
      this.nameList = []
      this.projectnameList = []
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
      contactProjectinfoApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSave() {
      contactProjectinfoApi.update(this.id, this.pojo).then(response => {
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
        contactProjectinfoApi.findById(id).then(response => {
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
        contactProjectinfoApi.deleteById(id).then(response => {
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
