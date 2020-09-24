<template>
  <div style="background:#fff;padding:0 10px 0">
    <div slot="tip" class="el-upload__tip">
      重启系统, cron任务会自动恢复<br>
      每天执行一次的任务包括以下:<br>
      1.dns解析获取hostname<br>
      2.nse结果获取hostname<br>
      3.根据ip更新白名单（可在设置-批量导入-立即更新数据库ip端口白名单, 手动更新）<br>
      4.根据项目更新白名单（可在设置-批量导入-立即更新数据库项目信息端口白名单, 手动更新）<br>
    </div>
    <br>
    <!-- 表格数据 -->
    <el-table
      ref="multipleTable"
      :data="list"
      border
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" :index="1" align="center" width="50" />
      <el-table-column sortable prop="name" label="名称" width="300" />
      <el-table-column sortable prop="cronexpression" label="cron表达式" width="400" />
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

    <!-- 编辑框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="50%" center :before-close="cleanCache">
      <el-form label-width="100px">

        <el-form-item label="名称"><span>{{ pojo.name }}</span></el-form-item>
        <el-form-item label="cron表达式"><el-input v-model="pojo.cronexpression" style="width:400px;" /></el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>
      </span>
    </el-dialog>
    <br>
    <el-form ref="searchform" inline size="small" :model="searchMap">
      <el-form-item label="cron表达式解析">
        <el-input v-model="searchMap.cronExpression" style="width:300px;" prop="cronExpression" clearable placeholder="只支持6位" /></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="parseCron()">解析</el-button>
      </el-form-item>
      <br>
      <el-form-item>
        <span v-if="parseList[0]">
          <hr>
          <table border="0">
            <tr>
              <td><b>当前时间</b></td>
              <td>{{ parseList[0] }}</td>
              <el-divider direction="vertical" />
              <td><b>最近十次</b></td>
              <td><b>运行时间</b></td>
            </tr>
            <tr>
              <td><b>一</b></td>
              <td>{{ parseList[1] }}</td>
              <el-divider direction="vertical" />
              <td><b>六</b></td>
              <td>{{ parseList[6] }}</td>
            </tr>
            <tr>
              <td><b>二</b></td>
              <td>{{ parseList[2] }}</td>
              <el-divider direction="vertical" />
              <td><b>七</b></td>
              <td>{{ parseList[7] }}</td>
            </tr>
            <tr>
              <td><b>三</b></td>
              <td>{{ parseList[3] }}</td>
              <el-divider direction="vertical" />
              <td><b>八</b></td>
              <td>{{ parseList[8] }}</td>
            </tr>
            <tr>
              <td><b>四</b></td>
              <td>{{ parseList[4] }}</td>
              <el-divider direction="vertical" />
              <td><b>九</b></td>
              <td>{{ parseList[9] }}</td>
            </tr>
            <tr>
              <td><b>五</b></td>
              <td>{{ parseList[5] }}</td>
              <el-divider direction="vertical" />
              <td><b>十</b></td>
              <td>{{ parseList[10] }}</td>
            </tr>
          </table>
          <hr>
        </span>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import cronjobApi from '@/api/cronjob'

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
      parseList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    cleanCache() {
      this.closeDialogForm()
    },
    parseCron() {
      cronjobApi.parse(this.searchMap).then(response => {
        this.parseList = response.data
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
      }).catch(() => {
        this.parseList = []
      })
    },
    closeDialogForm() {
      this.dialogFormVisible = false
    },
    fetchData() {
      this.listLoading = true
      cronjobApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSave() {
      cronjobApi.update(this.id, this.pojo).then(response => {
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
        cronjobApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将删除计划任务, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        cronjobApi.deleteById(id).then(response => {
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
