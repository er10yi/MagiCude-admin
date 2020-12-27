<template>
  <div>
    <br>

    <el-card class="box-card">
      <div slot="header" align="center" class="clearfix">
        <div slot="content"><b>项目组邮件接收漏洞的风险等级</b></div>
        <!-- 项目组接收漏洞的风险等级 表格数据 -->
        <el-table
          ref="multipleTable"
          :data="list"
        >
          <el-table-column align="center" prop="risk">
            <template slot="header">
              <span>风险等级</span>
              <el-tooltip placement="top">
                <div slot="content">配置[ip项目组-[项目组/项目组负责人/负责人信息]],同时ip归属项目组之后<br>
                  邮件发送漏洞报告时,风险等级中的漏洞会发给项目组负责人<br>
                  项目组负责人仅能收到自己负责的项目组的报告
                </div>
                <i class="el-icon-info" />
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.risk">
                <span
                  v-for="item in scope.row.risk.split(',')"
                  :key="item.id"
                  :label="item"
                  :value="item"
                >
                  <el-tag size="mini" type="info" effect="plain">{{ item }}</el-tag>
                </span>
              </span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEditRisk(scope.row.id)" />
            </template>
          </el-table-column>
        </el-table>
        <!-- 编辑框 -->
        <el-dialog title="项目组邮件接收漏洞的风险等级" :visible.sync="dialogFormVisible" width="50%" center :before-close="cleanCache">
          <el-form label-width="110px">
            <el-tooltip placement="top">
              <div slot="content">项目组负责人邮件接收漏洞的风险等级</div>
              <el-form-item label="风险等级">
                <!-- <el-input v-model="pojo.risk" style=" width:400px;" /> -->
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
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" align="center" class="clearfix">
        <div slot="content"><b>IM通知</b></div>
        <!-- im提醒设置 表格数据 -->
        <el-table
          ref="multipleTable"
          :data="listIM"
        >

          <el-table-column align="center" label="钉钉群机器人">
            <template slot-scope="scope">
              <el-tag size="mini" type="info" effect="plain">通知:{{ formatBoolean(scope.row.dingtalknotify) }}</el-tag><br>
              <el-tag size="mini" type="info" effect="plain">提醒所有人:{{ formatBoolean(scope.row.dingtalknotifyall) }}</el-tag><br>
              <el-button size="mini" type="text" @click="sendDingTalk()">
                <el-tag size="mini" type="success">发送测试消息</el-tag>
                <el-tooltip placement="top">
                  <div slot="content">通知开启或关闭都能发送测试消息</div>
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-button>
            </template>
          </el-table-column>

          <el-table-column align="center" label="企微群机器人">
            <template slot-scope="scope">
              <el-tag size="mini" type="info" effect="plain">通知:{{ formatBoolean(scope.row.wechatnotify) }}</el-tag><br>
              <el-tag size="mini" type="info" effect="plain">提醒所有人:{{ formatBoolean(scope.row.wechatnotifyall) }}</el-tag><br>
              <el-button size="mini" type="text" @click="sendWeChat()">
                <el-tag size="mini" type="success">发送测试消息</el-tag>
                <el-tooltip placement="top">
                  <div slot="content">通知开启或关闭都能发送测试消息</div>
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-button>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="secret" label="秘钥" /> -->
          <el-table-column align="center" prop="risk" label="风险等级">
            <template slot="header">
              <span>风险等级</span>
              <el-tooltip placement="top">
                <div slot="content">风险等级中的漏洞会实时推送到钉钉群和企微群中</div>
                <i class="el-icon-info" />
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.risk">
                <span
                  v-for="item in scope.row.risk.split(',')"
                  :key="item.id"
                  :label="item"
                  :value="item"
                >
                  <el-tag size="mini" type="info" effect="plain">{{ item }}</el-tag>
                </span>
              </span>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="riskassetnotify" label="高危资产推送">
            <template slot-scope="scope">
              <el-tag size="mini" type="info" effect="plain">{{ formatBoolean(scope.row.riskassetnotify) }}</el-tag>
            </template>
          </el-table-column>
          riskassetnotify
          <!-- <el-table-column prop="receiver" label="接收人列表" /> -->
          <!-- <el-table-column prop="messageurl" label="消息地址" /> -->
          <el-table-column prop="messagetitle" label="消息标题" />
          <el-table-column prop="messageprefix" label="消息前缀" />
          <el-table-column prop="messagesuffix" label="消息后缀" />
          <!-- <el-table-column prop="messagecharset" label="消息编码" /> -->

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
        <el-dialog title="IM通知配置" :visible.sync="dialogFormVisibleIM" width="50%" center :before-close="cleanCache">
          <el-form label-width="110px">

            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>钉钉群机器人</span>
                <el-tooltip placement="top">
                  <div slot="content">推荐使用加签的方式, 其他方式自行测试</div>
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-form-item label="Boolean">
                <el-switch v-model="pojo.dingtalknotify" active-text="开启通知" />
                <el-switch v-model="pojo.dingtalknotifyall" active-text="提醒所有人" />
              </el-form-item>

              <el-form-item label="签名密钥"><el-input v-model="pojo.secret" :autosize="{maxRows: 2}" type="textarea" /></el-form-item>

              <!-- <el-tooltip placement="top">
            <div slot="content">钉钉通知暂时用不上<br></div>
            <el-form-item label="接收人列表"><el-input v-model="pojo.receiver" :autosize="{maxRows: 10}" type="textarea" /></el-form-item>
          </el-tooltip> -->

              <el-form-item label="Webhook地址"><el-input v-model="pojo.dingtalkmessageurl" :autosize="{maxRows: 2}" type="textarea" /></el-form-item>
            </el-card>

            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>企微群机器人</span>
              </div>
              <el-form-item label="Boolean">
                <el-switch v-model="pojo.wechatnotify" active-text="开启通知" />
                <el-switch v-model="pojo.wechatnotifyall" active-text="提醒所有人" />
                <el-tooltip placement="top">
                  <div slot="content">开启提醒所有人,消息会转换成text格式发送,markdown格式不支持@all<br>
                    同时无法标记新增的ip
                  </div>
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-form-item>

              <!-- <el-tooltip placement="top">
            <div slot="content">钉钉通知暂时用不上<br></div>
            <el-form-item label="接收人列表"><el-input v-model="pojo.receiver" :autosize="{maxRows: 10}" type="textarea" /></el-form-item>
          </el-tooltip> -->

              <el-form-item label="Webhook地址"><el-input v-model="pojo.wechatmessageurl" :autosize="{maxRows: 2}" type="textarea" /></el-form-item>
            </el-card>

            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>全局配置</span>
              </div>

              <!-- <el-tooltip placement="top"> -->
              <!-- <div slot="content">项目负责人和接收人列表都会接收</div> -->
              <el-form-item label="风险等级">
                <el-tooltip placement="top">
                  <div slot="content">开启通知后,风险等级中的漏洞会实时推送到钉钉群和企微群中</div>
                  <el-checkbox-group v-model="checkedRisks" size="mini">
                    <el-checkbox-button v-for="risk in risks" :key="risk" :label="risk" />
                  </el-checkbox-group>
                </el-tooltip>
                <!-- <el-input v-model="pojo.risk" style=" width:400px;" /> -->
              </el-form-item>
              <el-form-item label="高危资产推送">
                <el-tooltip placement="top">
                  <div slot="content">开启后,新增ip的端口信息如果在[设置-高危信息]中,会实时推送到钉钉群和企微群中<br>
                    nmap类型的任务,推送的端口有详细信息<br>
                    mass类型的任务,只有端口和协议<br>
                    mass2Nmap类型的任务,会推送两次,第一次推送mass的结果(只有端口和协议),第二次推送nmap的结果(有详细信息)
                  </div>
                  <el-switch v-model="pojo.riskassetnotify" active-text="开启" />
                </el-tooltip>
                <!-- <el-input v-model="pojo.risk" style=" width:400px;" /> -->
              </el-form-item>
              <!-- </el-tooltip> -->

              <el-form-item label="消息标题"><el-input v-model="pojo.messagetitle" style=" width:400px;" /></el-form-item>
              <el-form-item label="消息前缀"><el-input v-model="pojo.messageprefix" :autosize="{maxRows: 10}" type="textarea" /></el-form-item>
              <el-form-item label="消息后缀"><el-input v-model="pojo.messagesuffix" :autosize="{maxRows: 10}" type="textarea" /></el-form-item>
              <!-- <el-form-item label="消息编码"><el-input v-model="pojo.messagecharset" style=" width:400px;" /></el-form-item> -->
            </el-card>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSaveIM()">保存</el-button>
            <el-button @click="closeDialogForm()">关闭</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" align="center" class="clearfix">
        <div slot="content"><b>邮件通知</b></div>

        <!-- 邮件提醒设置 表格数据 -->
        <el-table
          ref="multipleTable"
          :data="listEmail"
        >
          <!-- <el-table-column prop="sendhost" label="邮箱host" /> -->
          <!-- <el-table-column prop="sendfrom" label="账号" /> -->
          <!-- <el-table-column prop="sendpassword" label="密码/授权码" /> -->

          <el-table-column align="center" label="发送测试邮件">
            <el-button size="mini" type="text" @click="sendEmailTest()">
              <el-tag size="mini" type="success">发送测试邮件</el-tag>
              <el-tooltip placement="top">
                <div slot="content">仅向提醒邮箱列表发送，不会向项目组负责人发送</div>
                <i class="el-icon-info" />
              </el-tooltip>
            </el-button>
          </el-table-column>
          <el-table-column prop="sendto" label="提醒邮箱列表" show-overflow-tooltip>
            <template slot="header">
              <span>提醒邮箱列表</span>
              <el-tooltip placement="top">
                <div slot="content">提醒邮箱, 强制提醒, 不管是否在提醒白名单里<br>提醒包括所有资产和在邮件通知风险等级中的漏洞</div>
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
            <template slot-scope="scope">
              <span v-if="scope.row.sendtorisk">
                <span
                  v-for="item in scope.row.sendtorisk.split(',')"
                  :key="item.id"
                  :label="item"
                  :value="item"
                >
                  <el-tag size="mini" type="info" effect="plain">{{ item }}</el-tag>
                </span>
              </span>
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
        <el-dialog title="邮件通知配置" :visible.sync="dialogFormVisibleEmail" width="50%" center :before-close="cleanCache">
          <el-form label-width="110px">

            <el-form-item label="邮箱host">
              <el-tooltip placement="top">
                <div slot="content">非自建邮服需要开启SMTP,同时需要注意发信数量和附件大小的限制</div>
                <i class="el-icon-info" />
              </el-tooltip>
              <el-input v-model="pojo.sendhost" style=" width:400px;" /></el-form-item>
            <el-form-item label="账号"><el-input v-model="pojo.sendfrom" style=" width:400px;" /></el-form-item>
            <el-form-item label="密码/授权码"><el-input v-model="pojo.sendpassword" style=" width:400px;" /></el-form-item>

            <el-tooltip placement="top">
              <div slot="content">多个邮箱逗号分隔<br></div>
              <el-form-item label="提醒邮箱列表"><el-input v-model="pojo.sendto" :autosize="{maxRows: 10}" type="textarea" /></el-form-item>
            </el-tooltip>

            <el-tooltip placement="top">
              <div slot="content">提醒邮箱列表接收漏洞的风险等级</div>
              <el-form-item label="风险等级">
                <!-- <el-input v-model="pojo.sendtorisk" style=" width:400px;" /> -->
                <el-checkbox-group v-model="checkedRisks" size="mini">
                  <el-checkbox-button v-for="risk in risks" :key="risk" :label="risk" />
                </el-checkbox-group>
              </el-form-item>
            </el-tooltip>

            <el-form-item label="漏洞邮件主题"><el-input v-model="pojo.vulnsubject" style=" width:400px;" /></el-form-item>
            <el-form-item label="资产邮件主题"><el-input v-model="pojo.assetsubject" style=" width:400px;" /></el-form-item>
            <el-form-item label="漏洞邮件内容"><el-input v-model="pojo.vulncontent" :autosize="{maxRows: 10}" type="textarea" /></el-form-item>
            <el-form-item label="资产邮件内容"><el-input v-model="pojo.assetcontent" :autosize="{maxRows: 10}" type="textarea" /></el-form-item>
            <el-form-item label="excel作者"><el-input v-model="pojo.excelauthor" style=" width:400px;" /></el-form-item>

          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSaveEmail()">保存</el-button>
            <el-button @click="closeDialogForm()">关闭</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>

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
    sendDingTalk() {
      imvulnnotifyApi.sendDingTalkTest().then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
      })
    },
    sendWeChat() {
      imvulnnotifyApi.sendCorWechatTest().then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
      })
    },
    sendEmailTest() {
      imvulnnotifyApi.sendEmailTest().then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
      })
    },
    formatBoolean(cellValue) {
      return cellValue ? '是' : '否'
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
