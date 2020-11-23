<template>
  <div>
    <br>

    <div slot="tip" class="el-upload__tip">
      项目组邮件接收漏洞的风险等级
    </div>
    <!-- 项目组接收漏洞的风险等级 表格数据 -->
    <el-table
      ref="multipleTable"
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column prop="risk" label="风险等级" />

      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEditRisk(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="50%" center :before-close="cleanCache">
      <el-form label-width="100px">

        <el-tooltip placement="top">
          <div slot="content">项目负责人邮件接收漏洞的风险等级</div>
          <el-form-item label="风险等级">
            <!-- <el-input v-model="pojo.risk" style="width:300px;" /> -->
            <el-checkbox-group v-model="checkedRisks" size="mini">
              <el-checkbox-button v-for="risk in risks" :key="risk" :label="risk" />
            </el-checkbox-group>
          </el-form-item>
        </el-tooltip>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveRisk()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>
      </span>
    </el-dialog>

    <div slot="tip" class="el-upload__tip">
      IM通知 (接收人列表和项目组联系人)
    </div>
    <!-- im提醒设置 表格数据 -->
    <el-table
      ref="multipleTable"
      :data="listIM"
      border
      fit
      style="width: 100%;"
    >

      <el-table-column align="center" sortable label="开启通知">
        <template slot-scope="scope">
          <span>{{ formatBoolean(scope.row.notify) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable label="提醒所有人">
        <template slot-scope="scope">
          <span>{{ formatBoolean(scope.row.notifyall) }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="secret" label="秘钥" />
      <el-table-column prop="risk" label="风险等级" />
      <el-table-column prop="receiver" label="接收人列表" />
      <el-table-column prop="messageurl" label="消息地址" />
      <el-table-column prop="messagetitle" label="消息标题" />
      <el-table-column prop="messageprefix" label="消息前缀" />
      <el-table-column prop="messagesuffix" label="消息后缀" />
      <el-table-column prop="messagecharset" label="消息编码" />

      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEditIM(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisibleIM" width="50%" center :before-close="cleanCache">
      <el-form label-width="100px">

        <el-form-item label="Boolean">
          <el-switch v-model="pojo.notify" active-text="开启通知" />
          <el-switch v-model="pojo.notifyall" active-text="提醒所有人" />
        </el-form-item>

        <el-form-item label="秘钥"><el-input v-model="pojo.secret" :autosize="{maxRows: 2}" type="textarea" /></el-form-item>

        <el-tooltip placement="top">
          <div slot="content">项目负责人和接收人列表都会接收</div>
          <el-form-item label="风险等级">
            <!-- <el-input v-model="pojo.risk" style="width:300px;" /> -->
            <el-checkbox-group v-model="checkedRisks" size="mini">
              <el-checkbox-button v-for="risk in risks" :key="risk" :label="risk" />
            </el-checkbox-group>
          </el-form-item>
        </el-tooltip>

        <el-tooltip placement="top">
          <div slot="content">钉钉通知暂时用不上<br></div>
          <el-form-item label="接收人列表"><el-input v-model="pojo.receiver" :autosize="{maxRows: 10}" type="textarea" /></el-form-item>
        </el-tooltip>

        <el-form-item label="消息地址"><el-input v-model="pojo.messageurl" :autosize="{maxRows: 2}" type="textarea" /></el-form-item>
        <el-form-item label="消息标题"><el-input v-model="pojo.messagetitle" style="width:300px;" /></el-form-item>
        <el-form-item label="消息前缀"><el-input v-model="pojo.messageprefix" :autosize="{maxRows: 10}" type="textarea" /></el-form-item>
        <el-form-item label="消息后缀"><el-input v-model="pojo.messagesuffix" :autosize="{maxRows: 10}" type="textarea" /></el-form-item>
        <el-form-item label="消息编码"><el-input v-model="pojo.messagecharset" style="width:300px;" /></el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveIM()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>
      </span>
    </el-dialog>

    <div slot="tip" class="el-upload__tip">
      邮件通知
    </div>
    <!-- 邮件提醒设置 表格数据 -->
    <el-table
      ref="multipleTable"
      :data="listEmail"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column prop="sendhost" label="邮箱host" />
      <el-table-column prop="sendfrom" label="账号" />
      <el-table-column prop="sendpassword" label="密码/授权码" />
      <el-table-column prop="sendto" label="提醒邮箱列表">
        <template slot="header">
          <span>提醒邮箱列表</span>
          <el-tooltip placement="top">
            <div slot="content">提醒邮箱, 强制提醒, 不管是否在提醒白名单里<br>提醒包括所有资产和在收件人列表接收漏洞风险中的漏洞</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="sendtorisk" label="风险等级">
        <template slot="header">
          <span>风险等级</span>
          <el-tooltip placement="top">
            <div slot="content">提醒邮箱列表接收漏洞的风险等级</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="vulnsubject" label="漏洞邮件主题" />
      <el-table-column prop="assetsubject" label="资产邮件主题" />
      <el-table-column prop="vulncontent" label="漏洞邮件内容" />
      <el-table-column prop="assetcontent" label="资产邮件内容" />
      <el-table-column prop="excelauthor" label="excel作者" />

      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEditEmail(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisibleEmail" width="50%" center :before-close="cleanCache">
      <el-form label-width="100px">

        <el-form-item label="邮箱host"><el-input v-model="pojo.sendhost" style="width:300px;" /></el-form-item>
        <el-form-item label="账号"><el-input v-model="pojo.sendfrom" style="width:300px;" /></el-form-item>
        <el-form-item label="密码/授权码"><el-input v-model="pojo.sendpassword" style="width:300px;" /></el-form-item>

        <el-tooltip placement="top">
          <div slot="content">多个邮箱逗号分隔<br></div>
          <el-form-item label="提醒邮箱列表"><el-input v-model="pojo.sendto" :autosize="{maxRows: 10}" type="textarea" /></el-form-item>
        </el-tooltip>

        <el-tooltip placement="top">
          <div slot="content">提醒邮箱列表接收漏洞的风险等级</div>
          <el-form-item label="风险等级">
            <!-- <el-input v-model="pojo.sendtorisk" style="width:300px;" /> -->
            <el-checkbox-group v-model="checkedRisks" size="mini">
              <el-checkbox-button v-for="risk in risks" :key="risk" :label="risk" />
            </el-checkbox-group>
          </el-form-item>
        </el-tooltip>

        <el-form-item label="漏洞邮件主题"><el-input v-model="pojo.vulnsubject" style="width:300px;" /></el-form-item>
        <el-form-item label="资产邮件主题"><el-input v-model="pojo.assetsubject" style="width:300px;" /></el-form-item>
        <el-form-item label="漏洞邮件内容"><el-input v-model="pojo.vulncontent" :autosize="{maxRows: 10}" type="textarea" /></el-form-item>
        <el-form-item label="资产邮件内容"><el-input v-model="pojo.assetcontent" :autosize="{maxRows: 10}" type="textarea" /></el-form-item>
        <el-form-item label="excel作者"><el-input v-model="pojo.excelauthor" style="width:300px;" /></el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveEmail()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>
      </span>

    </el-dialog>
  </div>

</template>

<script>
import projectvulnnotifyApi from '@/api/projectvulnnotify'
import imvulnnotifyApi from '@/api/imvulnnotify'
import sendmailconfigApi from '@/api/sendmailconfig'
const riskOptions = ['信息', '低危', '中危', '高危', '严重', '致命']

export default {
  data() {
    return {
      list: [],
      listIM: [],
      listEmail: [],
      dialogFormVisible: false, // 编辑窗口是否可见
      dialogFormVisibleIM: false, // 编辑窗口是否可见
      dialogFormVisibleEmail: false,
      pojo: {}, // 编辑表单绑定的实体对象
      id: '', // 当前用户修改的ID
      idIM: '',
      idEmail: '',

      checkedRisks: [],
      risks: riskOptions

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    formatBoolean(cellValue) {
      return cellValue ? '是' : ''
    },
    cleanCache() {
      this.closeDialogForm()
    },
    closeDialogForm() {
      this.dialogFormVisible = false
      this.dialogFormVisibleIM = false
      this.dialogFormVisibleEmail = false
      this.checkedRisks = []
    },

    fetchData() {
      // projectvulnnotifyApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
      //   this.list = response.data.rows
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
      projectvulnnotifyApi.getList().then(response => {
        this.list = response.data
        // this.total = response.data.total
      })
      imvulnnotifyApi.getList().then(response => {
        this.listIM = response.data
      })
      sendmailconfigApi.getList().then(response => {
        this.listEmail = response.data
      })
    },
    handleSaveRisk() {
      if (this.checkedRisks && this.checkedRisks.length !== 0) {
        this.pojo.risk = this.checkedRisks.join(',')
      } else {
        this.pojo.risk = null
      }
      projectvulnnotifyApi.update(this.id, this.pojo).then(response => {
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
    handleEditRisk(id) {
      this.id = id
      this.dialogFormVisible = true // 打开窗口
      if (id !== '') { // 修改
        projectvulnnotifyApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
            if (this.pojo.risk && this.pojo.risk.length !== 0) {
              this.checkedRisks = this.pojo.risk.split(',')
            }
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleSaveIM() {
      if (this.checkedRisks && this.checkedRisks.length !== 0) {
        this.pojo.risk = this.checkedRisks.join(',')
      } else {
        this.pojo.risk = null
      }
      imvulnnotifyApi.update(this.idIM, this.pojo).then(response => {
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
    handleEditIM(idIM) {
      this.idIM = idIM
      this.dialogFormVisibleIM = true // 打开窗口
      if (idIM !== '') { // 修改
        imvulnnotifyApi.findById(idIM).then(response => {
          if (response.flag) {
            this.pojo = response.data
            if (this.pojo.risk && this.pojo.risk.length !== 0) {
              this.checkedRisks = this.pojo.risk.split(',')
            }
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleSaveEmail() {
      if (this.checkedRisks && this.checkedRisks.length !== 0) {
        this.pojo.sendtorisk = this.checkedRisks.join(',')
      } else {
        this.pojo.sendtorisk = null
      }
      sendmailconfigApi.update(this.idEmail, this.pojo).then(response => {
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
    handleEditEmail(idEmail) {
      this.idEmail = idEmail
      this.dialogFormVisibleEmail = true // 打开窗口
      if (idEmail !== '') { // 修改
        sendmailconfigApi.findById(idEmail).then(response => {
          if (response.flag) {
            this.pojo = response.data
            if (this.pojo.sendtorisk && this.pojo.sendtorisk.length !== 0) {
              this.checkedRisks = this.pojo.sendtorisk.split(',')
            }
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    }
  }
}
</script>
