<template>
  <div style="padding:5px;">
    <br>
    <!-- 查询条件 -->
    <el-form ref="searchform" inline size="small" :model="searchMap">
      <!-- <el-form-item label="部门编号">
        <el-input v-model="searchMap.departmentid" prop="departmentid" clearable placeholder="部门编号" /></el-form-item> -->

      <el-form-item prop="departmentid" label="部门">
        <el-select v-model="searchMap.departmentid" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词" :remote-method="getDepartmentnameList" :loading="searchLoading">
          <el-option v-for="item in departmentnameList" :key="item.id" :label="item.departmentname" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item prop="projectname" label="项目信息">
        <el-select v-model="searchMap.projectname" style="width:150px;" filterable allow-create remote clearable placeholder="请输入关键词" :remote-method="getProjectNameList" :loading="searchLoading">
          <el-option v-for="item in projectnameList" :key="item.id" :label="item.projectname" :value="item.projectname" />
        </el-select>
      </el-form-item>

      <el-form-item prop="checkwhitelist" label="安全检测白名单">
        <el-switch v-model="searchMap.checkwhitelist" />
      </el-form-item>
      <el-form-item prop="notifywhitelist" label="提醒白名单">
        <el-switch v-model="searchMap.notifywhitelist" /></el-form-item>

      <el-form-item prop="overrideipwhitelist" label="覆盖ip白名单">
        <el-switch v-model="searchMap.overrideipwhitelist" />
      </el-form-item>

      <el-form-item prop="inserttime" label="新增时间">
        <el-date-picker v-model="searchMap.inserttime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" range-separator="-" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:350px;" />
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
      <el-table-column sortable prop="departmentid" label="部门" />

      <el-table-column sortable prop="projectname" label="项目信息" />
      <el-table-column prop="checkwhitelist" align="center" label="检测白名单">
        <template slot="header">
          <span>检测白名单</span>
          <el-tooltip placement="top">
            <div slot="content">如果项目在白名单<br>则该项目的所有ip<br>都不会进行安全检测</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span>{{ formatBoolean(scope.row.checkwhitelist) }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="notifywhitelist" align="center" label="提醒白名单">
        <template slot="header">
          <span>提醒白名单</span>
          <el-tooltip placement="top">
            <div slot="content">如果项目在白名单<br>则该项目不会提醒负责人<br>默认提醒不受限制</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span>{{ formatBoolean(scope.row.notifywhitelist) }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="overrideipwhitelist" align="center" label="覆盖ip白名单">
        <template slot="header">
          <span>覆盖ip白名单</span>
          <el-tooltip placement="top">
            <div slot="content">默认为false, 如果为true<br>则会对项目下所有的ip进行白名单<br>会覆盖ip白名单, 谨慎操作</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span>{{ formatBoolean(scope.row.overrideipwhitelist) }}</span>
        </template>
      </el-table-column>

      <el-table-column sortable prop="inserttime" label="新增时间">
        <template slot-scope="scope">
          {{ scope.row.inserttime | dateformat() }}
        </template>
      </el-table-column>
      <!-- <el-table-column sortable prop="overrideipwhitelist" label="覆盖ip白名单" /> -->

      <el-table-column sortable prop="contact" label="项目负责人" />

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

        <!-- <el-form-item required label="部门编号"><el-input v-model="pojo.departmentid" style="width:300px;" /></el-form-item> -->

        <el-form-item prop="departmentid" label="部门">
          <el-form>
            <el-form-item label="部门不存在，新增">
              <el-button type="info" size="mini" icon="el-icon-circle-plus-outline" circle @click="handleEditDepartment('')" />
            </el-form-item>
          </el-form>
          <span v-if="pojo.id">
            <span>{{ departmentName }}</span>
            <el-select v-model="pojo.departmentid" style="width:300px;" filterable remote clearable placeholder="请输入关键词" :remote-method="getDepartmentnameList" :loading="searchLoading">
              <el-option v-for="item in departmentnameList" :key="item.id" :label="item.departmentname" :value="item.id" />
            </el-select>
          </span>
        </el-form-item>

        <el-form-item required label="项目信息">
          <el-select v-model="pojo.projectname" style="width:300px;" filterable allow-create remote clearable placeholder="请输入关键词" :remote-method="getProjectNameList" :loading="searchLoading">
            <el-option v-for="item in projectnameList" :key="item.id" :label="item.projectname" :value="item.projectname" />
          </el-select>
        </el-form-item>

        <el-form-item label="白名单">
          <el-switch v-model="pojo.checkwhitelist" active-text="检测" />
          <el-switch v-model="pojo.notifywhitelist" active-text="提醒" />
          <el-tooltip placement="top">
            <div slot="content">覆盖ip白名单, 将导致ip白名单失效<br>且对该项目下所有的ip做白名单, 请谨慎操作</div>
            <el-switch v-model="pojo.overrideipwhitelist" active-text="覆盖ip" />
          </el-tooltip>

        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="pojo.inserttime" style="width:300px;" placeholder="新增时间" type="datetime" />
        </el-form-item>

        <span v-if="pojo.id">
          <!--  联系人  -->
          <!-- 表格数据 -->

          <el-form-item prop="name" label="增加负责人">
            <el-form>
              <el-form-item label="联系人不存在，新增">
                <el-button type="info" size="mini" icon="el-icon-circle-plus-outline" circle @click="handleEditContact('')" />
              </el-form-item>
            </el-form>
            <span v-if="pojo.id">
              <el-select v-model="contactIdAdd" style="width:300px;" filterable remote clearable placeholder="请输入关键词" :remote-method="getNameList" :loading="searchLoading">
                <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.id" /></el-select>
              <el-button type="info" @click="handleAddContact(pojo.id)">增加</el-button>
            </span>
          </el-form-item>

          <el-table :data="contactList" fit>
            <el-table-column sortable prop="name" label="联系人" />
            <el-table-column sortable prop="email" label="邮箱" />
            <el-table-column sortable prop="phone" label="电话" />
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEditContact(scope.row.id)" />
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDeleteContact(pojo.id,scope.row.id)" />
              </template>
            </el-table-column>
          </el-table>
        </span>
        <span v-else>
          <div slot="tip" class="el-upload__tip">保存后才能编辑部门和负责人</div>
        </span>
        <br>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 部门编辑框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisibleDepartment" append-to-body width="40%" center :before-close="cleanCache">
      <el-form label-width="100px">
        <el-form-item label="部门名称">
          <el-select v-model="departmentPojo.departmentname" style="width:300px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词" :remote-method="getDepartmentnameList" :loading="searchLoading">
            <el-option v-for="item in departmentnameList" :key="item.id" :label="item.departmentname" :value="item.departmentname" />
          </el-select>
        </el-form-item>

        <el-button type="primary" @click="handleSaveDepartment()">保存</el-button>
        <el-button @click="closeDialogFormSecond()">关闭</el-button>

      </el-form>

    </el-dialog>

    <!-- 联系人编辑框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisibleContact" append-to-body width="40%" center :before-close="cleanCache">
      <el-form label-width="100px">
        <el-form-item prop="name" label="联系人">
          <el-select v-model="contactPojo.name" style="width:300px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词" :remote-method="getNameList" :loading="searchLoading">
            <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.name" /></el-select>
        </el-form-item>

        <el-form-item prop="email" label="邮箱">
          <el-select v-model="contactPojo.email" style="width:300px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词" :remote-method="getEmailList" :loading="searchLoading">
            <el-option v-for="item in emailList" :key="item.id" :label="item.email" :value="item.email" /></el-select>
        </el-form-item>

        <el-form-item label="电话"><el-input v-model="contactPojo.phone" clearable style="width:300px;" /></el-form-item>

        <el-button type="primary" @click="handleSaveContact()">保存</el-button>
        <el-button @click="closeDialogFormSecond()">关闭</el-button>

      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import projectinfoApi from '@/api/projectinfo'
import departmentApi from '@/api/department'
import contactApi from '@/api/contact'

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
      dialogFormVisibleDepartment: false,
      pojo: {}, // 编辑表单绑定的实体对象
      id: '', // 当前用户修改的ID
      filename: '',
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      searchLoading: false,
      projectnameList: [],
      departmentnameList: [],
      departmentName: '',
      dialogFormVisibleContact: false, // 编辑窗口是否可见

      contactId: '',
      contactPojo: {},
      contactList: [],
      nameList: [],
      emailList: [],
      phoneList: [],
      contactIdAdd: '',

      departmentId: '',
      departmentPojo: {},

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
    getNameList(query) {
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
    getEmailList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          contactApi.search(1, 10, { 'email': query }).then(response => {
            this.emailList = response.data.rows.filter(item => {
              return item.email.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.emailList = []
      }
    },
    closeDialogFormSecond() {
      this.dialogFormVisibleDepartment = false
      this.dialogFormVisibleContact = false
      this.projectnameList = []
      this.nameList = []
      this.emailList = []
    },
    handleSaveContact() {
      contactApi.update(this.contactId, this.contactPojo).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) { // 如果成功
          this.handleEdit(this.id)
        }
      })
      this.closeDialogFormSecond() // 关闭窗口
    },
    handleEditContact(contactId) {
      this.contactId = contactId
      this.dialogFormVisibleContact = true // 打开窗口
      if (contactId !== '') { // 修改
        contactApi.findById(contactId).then(response => {
          if (response.flag) {
            this.contactPojo = response.data
          }
        })
      } else {
        this.contactPojo = {} // 清空数据
      }
    },
    handleSaveDepartment() {
      departmentApi.update(this.departmentId, this.departmentPojo).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) { // 如果成功
          this.handleEdit(this.id)
        }
      })
      this.closeDialogFormSecond()
    },
    handleEditDepartment(departmentId) {
      this.departmentId = departmentId
      this.dialogFormVisibleDepartment = true // 打开窗口
      if (departmentId !== '') { // 修改
        departmentApi.findById(departmentId).then(response => {
          if (response.flag) {
            this.departmentPojo = response.data
          }
        })
      } else {
        this.departmentPojo = {} // 清空数据
      }
    },
    handleAddContact(id) {
      if (id && id !== '') {
        var list = []
        list.push(id)
        list.push(this.contactIdAdd)
        projectinfoApi.addContact(list).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) { // 如果成功
            this.fetchData()
            this.handleEdit(id)
          }
          this.nameList = []
        })
      }
    },
    handleDeleteContact(id, contactid) {
      var list = []
      list.push(id)
      list.push(contactid)
      projectinfoApi.deleteContact(list).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) { // 如果成功
          this.fetchData()
          this.handleEdit(id)
        }
      })
    },
    cleanCache() {
      this.closeDialogForm()
      this.closeDialogFormSecond()
    },
    closeDialogForm() {
      this.dialogFormVisible = false
      this.projectnameList = []
      this.departmentName = ''
    },
    getDepartmentnameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          departmentApi.search(1, 10, { 'departmentname': query }).then(response => {
            this.departmentnameList = response.data.rows.filter(item => {
              return item.departmentname.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.departmentnameList = []
      }
    },
    getProjectNameList(query) {
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
        this.$confirm('此操作将永久删除已选记录, 包括[项目信息, 联系人项目信息管理, 项目信息-端口], 并置空该项目下ip的项目信息, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const ids = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id)
          }
          projectinfoApi.deleteAllByIds(ids).then(response => {
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
            '部门',
            '项目信息',
            '检测白名单',
            '提醒白名单',
            '覆盖ip白名单',
            '新增时间',
            '项目负责人'
          ]
          const filterVal = [
            'departmentid',
            'projectname',
            'checkwhitelist',
            'notifywhitelist',
            'overrideipwhitelist',
            'inserttime',
            'contact'
          ]
          const list = this.multipleSelection
          for (let i = 0; i < list.length; i++) {
            list[i].inserttime = dateformat(list[i].inserttime)
            list[i].checkwhitelist = list[i].checkwhitelist ? '是' : ''
            list[i].notifywhitelist = list[i].notifywhitelist ? '是' : ''
            list[i].overrideipwhitelist = list[i].overrideipwhitelist ? '是' : ''
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
      projectinfoApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSave() {
      var tempId
      projectinfoApi.update(this.id, this.pojo).then(response => {
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

      // this.closeDialogForm() // 关闭窗口
    },
    handleEdit(id) {
      this.id = id
      this.dialogFormVisible = true // 打开窗口
      if (id !== '') { // 修改
        projectinfoApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
            if (this.pojo.departmentid !== null) {
              departmentApi.findById(this.pojo.departmentid).then((response) => {
                if (response.flag) {
                  this.departmentName = response.data.departmentname
                }
              })
            }
            projectinfoApi.findAllContactById(this.pojo.id).then((response) => {
              if (response.flag) {
                this.contactList = response.data
              }
            })
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除已选记录, 包括[项目信息, 联系人项目信息管理, 项目信息-端口], 并置空该项目下ip的项目信息, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        projectinfoApi.deleteById(id).then(response => {
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
