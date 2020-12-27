<template>
  <div>
    <br>
    <!-- 查询条件 -->
    <el-form ref="searchform" inline size="small" :model="searchMap">

      <el-form-item prop="recipient" label="接收人">
        <el-select v-model="searchMap.recipient" style="width:200px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getRecipientList" :loading="searchLoading">
          <el-option v-for="item in recipientList" :key="item.id" :label="item.recipient" :value="item.recipient" /></el-select>
      </el-form-item>
      <el-form-item prop="receiveuser" label="接收账户">
        <el-select v-model="searchMap.receiveuser" style="width:200px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getReceiveuserList" :loading="searchLoading">
          <el-option v-for="item in receiveuserList" :key="item.id" :label="item.receiveuser" :value="item.receiveuser" /></el-select>
      </el-form-item>
      <el-form-item prop="content" label="内容">
        <el-select v-model="searchMap.content" style="width:200px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getContentList" :loading="searchLoading">
          <el-option v-for="item in contentList" :key="item.id" :label="item.content" :value="item.content" /></el-select>
      </el-form-item>

      <el-form-item label="类型">
        <el-radio-group v-model="searchMap.type" size="mini">
          <el-radio-button label="D" />
          <el-radio-button label="W" />
          <el-radio-button label="E" />
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="success" label="成功">
        <el-switch v-model="searchMap.success" />
      </el-form-item>
      <el-form-item prop="sendtime" label="发送时间">
        <el-date-picker v-model="searchMap.sendtime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" range-separator="-" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:350px;" />
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
      <el-table-column sortable prop="recipient" label="接收人" />
      <el-table-column sortable prop="receiveuser" label="接收账户" />

      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column sortable prop="type" label="类型" align="center" width="80" />

      <el-table-column align="center" sortable label="成功" width="80">
        <template slot-scope="scope">
          <span>{{ formatBoolean(scope.row.success) }}</span>
        </template>
      </el-table-column>

      <el-table-column sortable prop="exception" label="异常消息" show-overflow-tooltip />

      <el-table-column sortable prop="sendtime" label="发送时间">
        <template slot-scope="scope">
          {{ scope.row.sendtime | dateformat() }}
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

        <el-form-item label="接收人"><el-input v-model="pojo.recipient" /></el-form-item>
        <el-form-item label="接收账户"><el-input v-model="pojo.receiveuser" /></el-form-item>
        <el-form-item label="内容"><el-input v-model="pojo.content" :autosize="{maxRows: 10 }" type="textarea" /></el-form-item>

        <el-form-item label="类型">
          <el-radio-group v-model="pojo.type" size="mini">
            <el-radio-button label="D" />
            <el-radio-button label="W" />
            <el-radio-button label="E" />
          </el-radio-group>
        </el-form-item>

        <el-form-item label="成功">
          <el-switch v-model="pojo.success" active-text="成功" />
        </el-form-item>
        <el-form-item label="异常消息"><el-input v-model="pojo.exception" :autosize="{maxRows: 10 }" type="textarea" /></el-form-item>
        <el-form-item label="发送时间">
          <el-date-picker v-model="pojo.sendtime" style="width:300px;" placeholder="发送时间" type="datetime" />
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
import notifylogApi from '@/api/notifylog'
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
      searchLoading: false,
      recipientList: [],
      receiveuserList: [],
      contentList: [],

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
    getRecipientList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          notifylogApi.search(1, 10, { 'recipient': query }).then(response => {
            this.recipientList = response.data.rows.filter(item => {
              return item.recipient.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.recipientList = []
      }
    },
    getReceiveuserList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          notifylogApi.search(1, 10, { 'receiveuser': query }).then(response => {
            this.receiveuserList = response.data.rows.filter(item => {
              return item.receiveuser.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.receiveuserList = []
      }
    },
    getContentList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          notifylogApi.search(1, 10, { 'content': query }).then(response => {
            this.contentList = response.data.rows.filter(item => {
              return item.content.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.contentList = []
      }
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
          notifylogApi.deleteAllByIds(ids).then(response => {
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
            '接收人',
            '接收账户',
            '内容',
            '类型',
            '成功',
            '异常消息',
            '发送时间'

          ]
          const filterVal = [

            'recipient',
            'receiveuser',
            'content',
            'type',
            'success',
            'exception',
            'sendtime'

          ]
          const list = this.multipleSelection
          for (let i = 0; i < list.length; i++) {
            list[i].sendtime = dateformat(list[i].sendtime)
            list[i].passivetime = dateformat(list[i].passivetime)
            list[i].success = list[i].success ? '是' : ''
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
      this.recipientList = []
      this.receiveuserList = []
      this.contentList = []
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
      notifylogApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSave() {
      notifylogApi.update(this.id, this.pojo).then(response => {
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
        notifylogApi.findById(id).then(response => {
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
        notifylogApi.deleteById(id).then(response => {
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
