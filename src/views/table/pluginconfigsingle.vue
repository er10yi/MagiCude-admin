<template>
  <div>
    <br>
    <!-- 查询条件 -->
    <el-form ref="searchform" inline size="small" :model="searchMap">
      <!-- <el-form-item label="名称">
        <el-input v-model="searchMap.name" prop="name" clearable placeholder="名称" /></el-form-item> -->

      <el-form-item prop="name" label="名称">
        <el-select v-model="searchMap.name" filterable remote allow-create default-first-option clearable placeholder="请输入关键词" :remote-method="getNameList" :loading="searchLoading">
          <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.name" /></el-select>
      </el-form-item>

      <el-form-item prop="args" label="参数">
        <el-select v-model="searchMap.args" filterable remote allow-create default-first-option clearable placeholder="请输入关键词" :remote-method="getArgsList" :loading="searchLoading">
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
          <el-radio-button label="nse" />
          <el-tooltip placement="top">
            <div slot="content">前端只能新增Python3<br>或HTTP/HTTPS访问的自定义插件</div>
            <el-radio-button label="selfd" />
          </el-tooltip>
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
      <!-- <el-table-column sortable prop="id" label="插件配置编号" /> -->
      <el-table-column sortable prop="name" label="名称" />
      <el-table-column sortable prop="args" label="参数" show-overflow-tooltip />
      <el-table-column sortable prop="risk" label="风险" />
      <el-table-column sortable prop="type" label="类型" />
      <el-table-column sortable prop="validatetype" label="辅助验证" />
      <el-table-column sortable prop="timeout" label="超时" />
      <el-table-column sortable prop="plugincode" label="插件代码" show-overflow-tooltip />

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

        <el-form-item label="名称"><el-input v-model="pojo.name" style="width:300px;" /></el-form-item>
        <el-form-item label="参数"><el-input v-model="pojo.args" style="width:300px;" /></el-form-item>
        <el-form-item label="风险"><el-input v-model="pojo.risk" style="width:300px;" /></el-form-item>

        <el-form-item label="类型">
          <!-- <el-input v-model="pojo.type" style="width:300px;" /> -->
          <el-radio-group v-model="pojo.type" size="mini">
            <el-radio-button label="nse" />
            <el-radio-button label="selfd" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="辅助验证" inline>
          <el-checkbox-group v-model="checkedChecktypes" size="mini">
            <el-checkbox-button v-for="check in checks" :key="check" :label="check" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="超时"><el-input v-model="pojo.timeout" style="width:300px;" /></el-form-item>
        <!-- <el-form-item label="插件代码"><code><el-input v-model="pojo.plugincode" type="textarea" :autosize="{maxRows: 50}" /></code></el-form-item> -->

        <el-form-item label="插件代码">
          <!-- <code><el-input v-model="pojo.plugincode" type="textarea" :autosize="{maxRows: 50}" /></code> -->

          <div class="in-coder-panel">
            <textarea ref="textarea" v-model="nodearea" />
            <el-select
              v-model="mode"
              class="code-mode-select"
              @change="changeMode"
            >
              <el-option
                v-for="smode in modes"
                :key="smode.value"
                :label="smode.label"
                :value="smode.value"
              />
            </el-select>
          </div>
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
import pluginconfigApi from '@/api/pluginconfig'

// 引入全局实例
import _CodeMirror from 'codemirror'

// 核心样式
import 'codemirror/lib/codemirror.css'
// 引入主题后还需要在 options 中指定主题才会生效
import 'codemirror/theme/idea.css'

// 需要引入具体的语法高亮库才会有对应的语法高亮效果
// codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
// 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入
// import 'codemirror/mode/javascript/javascript.js'
// import 'codemirror/mode/css/css.js'
// import 'codemirror/mode/xml/xml.js'
// import 'codemirror/mode/clike/clike.js'
// import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/mode/python/python.js'
// import 'codemirror/mode/r/r.js'
// import 'codemirror/mode/shell/shell.js'
// import 'codemirror/mode/sql/sql.js'
// import 'codemirror/mode/swift/swift.js'
// import 'codemirror/mode/vue/vue.js'

// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/xml-fold.js'

// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/match-highlighter.js'
const CodeMirror = window.CodeMirror || _CodeMirror
const checkOptions = ['http', 'dns']

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
      nameList: [],
      argsList: [],
      searchLoading: false,

      checkedChecktypes: [],
      checks: checkOptions,

      value: '',
      nodearea: '',
      // 内部真实的内容
      code: '',
      // 默认的语法类型
      mode: 'Python',
      // 编辑器实例
      coder: null,
      // 默认配置
      options: {
        // 缩进格式
        tabSize: 4,
        // 主题，对应主题库 JS 需要提前引入
        theme: 'idea',
        // 显示行号
        lineNumbers: true,
        styleActiveLine: true, // 高亮选中行
        line: true,
        extraKeys: { 'Ctrl': 'autocomplete' },
        foldGutter: true, // 块槽
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }, // 可以启用该选项来突出显示当前选中的内容的所有实例
        mode: { // 模式, 可查看 codemirror/mode 中的所有模式
          name: 'python',
          json: true
        }
      },
      // 支持切换的语法高亮类型，对应 JS 已经提前引入
      // 使用的是 MIME-TYPE ，不过作为前缀的 text/ 在后面指定时写死了
      modes: [{
        value: 'x-python',
        label: 'Python'

      }
      // ,{
      //   value: 'javascript',
      //   label: 'Javascript'
      // }, {
      //   value: 'html',
      //   label: 'XML/HTML'
      // }, {
      //   value: 'x-java',
      //   label: 'Java'
      // }, {
      //   value: 'x-objectivec',
      //   label: 'Objective-C'
      // }, {
      //   value: 'css',
      //   label: 'CSS'
      // }, {
      //   value: 'x-rsrc',
      //   label: 'R'
      // }, {
      //   value: 'x-sh',
      //   label: 'Shell'
      // }, {
      //   value: 'x-sql',
      //   label: 'SQL'
      // }, {
      //   value: 'x-swift',
      //   label: 'Swift'
      // }, {
      //   value: 'x-vue',
      //   label: 'Vue'
      // }, {
      //   value: 'markdown',
      //   label: 'Markdown'
      // }
      ]

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 初始化
    _initialize(plugincode) {
      // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置

      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options)
      // 编辑器赋值
      if (plugincode !== null) {
        this.coder.setValue(plugincode)
      }

      // 支持双向绑定
      // this.coder.on('change', (coder) => {
      // this.code = coder.getValue()
      // this.pojo.plugincode = this.code
      // if (this.$emit) {
      //   this.$emit('input', this.code)
      // }
      // })

      // 尝试从父容器获取语法类型
      if (this.language) {
        // 获取具体的语法类型对象
        const modeObj = this._getLanguage(this.language)

        // 判断父容器传入的语法是否被支持
        if (modeObj) {
          this.mode = modeObj.label
        }
      }
    },
    // 获取当前语法类型
    _getLanguage(language) {
      // 在支持的语法类型列表中寻找传入的语法类型
      return this.modes.find((mode) => {
        // 所有的值都忽略大小写，方便比较
        const currentLanguage = language.toLowerCase()
        const currentLabel = mode.label.toLowerCase()
        const currentValue = mode.value.toLowerCase()

        // 由于真实值可能不规范，例如 java 的真实值是 x-java ，所以讲 value 和 label 同时和传入语法进行比较
        return currentLabel === currentLanguage || currentValue === currentLanguage
      })
    },
    // 更改模式
    changeMode(val) {
      // 修改编辑器的语法配置
      this.coder.setOption('mode', `text/${val}`)

      // 获取修改后的语法
      const label = this._getLanguage(val).label.toLowerCase()

      // 允许父容器通过以下函数监听当前的语法值
      this.$emit('language-change', label)
    },
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
            this.nameList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.nameList = []
      }
    },
    closeDialogForm() {
      this.dialogFormVisible = false
      this.dialogFormVisible = false
      this.selectedServiceList = []
      this.remoteServiceOptions = []
      this.selectedVersionList = []
      this.remoteServiceOptions = []
      this.selectedVulnkeywordList = []
      this.remoteVulnkeywordOptions = []
      this.selectedVulnList = []
      this.remoteVulnOptions = []
      this.checkedChecktypes = []
      this.code = ''
      this.coder.toTextArea()
    },

    handleDeleteAll() {
      if (this.multipleSelection && this.multipleSelection.length) {
        this.$confirm('此操作将永久删除已选记录信息, 包括 插件配置, 资产服务, 资产版本, 漏洞关键词, 漏洞插件配置关联], 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const ids = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id)
          }
          pluginconfigApi.deleteAllByIds(ids).then(response => {
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
            '名称',
            '参数',
            '风险',
            '类型',
            '辅助验证',
            '超时',
            '插件代码'

          ]
          const filterVal = [
            'name',
            'args',
            'risk',
            'type',
            'validatetype',
            'timeout',
            'plugincode'

          ]``
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
      this.nameList = []
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
      this.listLoading = true
      pluginconfigApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSave() {
      if (this.checkedChecktypes && this.checkedChecktypes.length !== 0) {
        this.pojo.validatetype = this.checkedChecktypes.join(',')
      } else {
        this.pojo.validatetype = null
      }
      if (this.pojo.plugincode === '') {
        this.pojo.plugincode = null
      } else {
        if (this.coder !== null) {
          this.pojo.plugincode = this.coder.getValue()
        }
      }
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
            if (this.pojo.validatetype && this.pojo.validatetype.length !== 0) {
              this.checkedChecktypes = this.pojo.validatetype.split(',')
            }
            this._initialize(response.data.plugincode)
          }
        })
      } else {
        this._initialize('hello plugin')
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除已选记录信息, 包括 插件配置, 资产服务, 资产版本, 漏洞关键词, 漏洞插件配置关联], 是否继续?', '警告', {
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

<style lang="stylus" rel="stylesheet/stylus">
  .in-coder-panel
    flex-grow 1
    display flex
    position relative

    .CodeMirror
      flex-grow 1
      z-index 1
      .CodeMirror-code
        line-height 20px

    .code-mode-select
      position absolute
      z-index 2
      right 10px
      top 10px
      max-width 130px
</style>
