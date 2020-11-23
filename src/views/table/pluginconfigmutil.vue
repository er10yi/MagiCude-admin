<template>
  <div>
    <br>
    <!-- 查询条件 -->
    <el-form ref="searchform" inline size="small" :model="searchMap">
      <!-- <el-form-item label="名称">
        <el-input v-model="searchMap.name" prop="name" clearable placeholder="名称" /></el-form-item> -->

      <el-form-item prop="name" label="名称">
        <el-select v-model="searchMap.name" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getNameList" :loading="searchLoading">
          <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.name" /></el-select>
      </el-form-item>

      <el-form-item prop="args" label="参数">
        <el-select v-model="searchMap.args" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getArgsList" :loading="searchLoading">
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

      <!-- <el-form-item label="插件代码">
        <el-input v-model="searchMap.plugincode" prop="plugincode" clearable placeholder="插件代码" /></el-form-item> -->

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

        <el-form-item label="名称" required><el-input v-model="pojo.name" style="width:400px;" /></el-form-item>

        <el-form-item label="参数"><el-input v-model="pojo.args" autosize type="textarea" /></el-form-item>

        <!-- <el-form-item label="风险"><el-input v-model="pojo.risk" style="width:400px;" /></el-form-item> -->
        <el-form-item label="风险">
          <el-radio-group v-model="pojo.risk" size="mini">
            <el-radio-button label="信息" />
            <el-radio-button label="低危" />
            <el-radio-button label="中危" />
            <el-radio-button label="高危" />
            <el-radio-button label="严重" />
            <el-radio-button label="致命" />
          </el-radio-group>
        </el-form-item>

        <el-form-item label="类型">
          <!-- <el-input v-model="pojo.type" style="width:400px;" /> -->
          <el-radio-group v-model="pojo.type" size="mini">
            <el-radio-button label="nse" />
            <el-tooltip placement="top">
              <div slot="content">前端只能新增Python3<br>或HTTP/HTTPS访问的自定义插件</div>
              <el-radio-button label="selfd" />
            </el-tooltip>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="辅助验证" inline>
          <el-checkbox-group v-model="checkedChecktypes" size="mini">
            <el-checkbox-button v-for="check in checks" :key="check" :label="check" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="超时">

          <el-input v-model="pojo.timeout" style="width:400px;" /></el-form-item>

        <!-- 新增服务 -->
        <el-form-item label="服务">
          <el-form-item>
            <el-select
              v-model="selectedServiceList"
              style="width:400px;"
              multiple
              filterable
              remote
              reserve-keyword
              allow-create
              default-first-option
              placeholder="请输入搜索"
              :remote-method="remoteSearchService"
              :loading="searchLoading"
            >
              <el-option
                v-for="item in remoteServiceOptions"
                :key="item"
                :label="item"
                :value="item"
              />
              <!-- <el-option
                v-for="item in remoteServiceOptions"
                :key="item.id"
                :label="item.service"
                :value="item.service"
              /> -->
            </el-select>

          </el-form-item>

        </el-form-item>
        <!-- 显示服务 -->
        <span v-if="pojo.id">
          <el-form-item>
            <el-table
              ref="multipleTable"
              :data="servicePojoList"
              :show-header="false"
            >
              <el-table-column width="400" prop="assetservice" label="服务" />
              <el-table-column width="50">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDeleteService(scope.row.id)" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </span>

        <!-- 新增版本 -->
        <el-form-item label="版本">
          <el-form-item>
            <el-select
              v-model="selectedVersionList"
              style="width:400px;"
              multiple
              filterable
              remote
              reserve-keyword
              allow-create
              default-first-option
              placeholder="请输入搜索"
              :remote-method="remoteSearchVersion"
              :loading="searchLoading"
            >
              <el-option
                v-for="item in remoteVersionOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>

          </el-form-item>

        </el-form-item>
        <!-- 显示版本 -->
        <span v-if="pojo.id">
          <el-form-item>
            <el-table
              ref="multipleTable"
              :data="versionPojoList"
              :show-header="false"
            >
              <el-table-column width="400" prop="assetversion" label="版本" />
              <el-table-column width="50">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDeleteVersion(scope.row.id)" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </span>

        <!-- 新增漏洞关键字 -->
        <el-form-item label="关键字">
          <el-form-item>
            <el-select
              v-model="selectedVulnkeywordList"
              style="width:400px;"
              multiple
              filterable
              remote
              reserve-keyword
              allow-create
              default-first-option
              placeholder="请输入搜索"
              :remote-method="remoteSearchVulnkeyword"
              :loading="searchLoading"
            >
              <el-option
                v-for="item in remoteVulnkeywordOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-form-item>

        <!-- 显示漏洞关键字 -->
        <span v-if="pojo.id">
          <el-form-item>
            <el-table
              ref="multipleTable"
              :data="vulnkeywordPojoList"
              :show-header="false"
            >
              <el-table-column width="400" prop="keyword" label="关键字" />
              <el-table-column width="50">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDeleteVulnkeyword(scope.row.id)" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </span>

        <!-- 新增漏洞插件配置关联 -->
        <el-form-item label="漏洞">
          <el-form-item>
            <el-select
              v-model="selectedVulnList"
              style="width:400px;"
              multiple
              filterable
              remote
              reserve-keyword
              default-first-option
              placeholder="请输入搜索"
              :remote-method="remoteSearchVuln"
              :loading="searchLoading"
            >
              <el-option
                v-for="item in remoteVulnOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form-item>

        <!-- 显示漏洞插件配置关联 -->
        <span v-if="pojo.id">
          <el-form-item>
            <el-table
              ref="multipleTable"
              :data="vulnPluginPojoList"
              :show-header="false"
            >
              <el-table-column width="400" prop="name" label="漏洞" />
              <el-table-column width="50">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDeleteVulnPlugin(scope.row.id)" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </span>
        <!-- <span v-if="pojo.type === 'selfd'"> -->
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
        <!-- </span> -->

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
import pluginassetserviceApi from '@/api/pluginassetservice'
import assetportApi from '@/api/assetport'
import pluginassetversionApi from '@/api/pluginassetversion'
import vulnkeywordApi from '@/api/vulnkeyword'
import vulnpluginconfigApi from '@/api/vulnpluginconfig'
import vulnApi from '@/api/vuln'

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
      dialogFormVisibleService: false, // 编辑窗口是否可见
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

      // 服务
      servicePojo: {},
      servicePojoList: [],
      serviceList: [],
      selectedServiceList: [],
      remoteServiceOptions: [],
      remoteServiceList: [],

      // 版本
      versionPojo: {},
      versionPojoList: [],
      versionList: [],
      selectedVersionList: [],
      remoteVersionOptions: [],
      remoteVersionList: [],

      // 关键字
      vulnkeywordPojo: {},
      vulnkeywordPojoList: [],
      vulnkeywordList: [],
      selectedVulnkeywordList: [],
      remoteVulnkeywordOptions: [],
      remoteVulnkeywordList: [],

      // 漏洞插件配置关联
      vulnList: [],
      selectedVulnList: [],
      remoteVulnOptions: [],
      vulnPluginPojo: {},
      vulnPluginPojoList: [],
      vulnName: '',

      plugindemocdoe: '# -*- coding:utf-8 -*-\n' +
'# plugin code demo\n' +
'# @auther 贰拾壹\n' +
'# https://github.com/er10yi\n' +
'\n' +
'def check(ip, port, args, timeout, payload_map):\n' +
'    # 插件名字包含WeakPass，payload_map才会有用户名密码\n' +
"    username_list = payload_map.get('username')\n" +
"    password_list = payload_map.get('password')\n" +
'\n' +
'    # 辅助验证为http，页面返回的data会作为关键词\n' +
"    http_validate_list = payload_map.get('http_validate')\n" +
'    http_validate = http_validate_list[0]\n' +
'    # curl http_validate\n' +
'\n' +
'    # 辅助验证为dns，dns解析的域名，需要自己手动添加到关键词，否则检测不到\n' +
"    dns_validate_list = payload_map.get('dns_validate')\n" +
'    dns_validate = dns_validate_list[0]\n' +
'    # nslookup args dns_validate\n' +
'\n' +
'    check_result = "执行的结果"\n' +
'\n' +
'    try:\n' +
'        # 只有return的结果，才会带回去，print是没用的\n' +
"        return check_result + ' ' + http_validate + ' ' + dns_validate\n" +
'    except Exception:\n' +
'        raise\n',
      // 代码编辑器
      codeTemp: '',
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
        extraKeys: {
          'Ctrl': 'autocomplete',
          Tab: (CodeMirror) => {
            if (CodeMirror.somethingSelected()) { // 存在文本选择
              CodeMirror.indentSelection('add') // 正向缩进文本
            } else { // 无文本选择
              // cm.indentLine(cm.getCursor().line, "add");  // 整行缩进 不符合预期
              CodeMirror.replaceSelection(Array(CodeMirror.getOption('indentUnit') + 1).join(' '), 'end', '+input') // 光标处插入 indentUnit 个空格
            }
          }
        },
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
      // ,
      // {
      //   value: 'javascript',
      //   label: 'Javascript'
      // }
      // , {
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
    this.getRemoteServiceList()
    this.getRemoteVersionList()
    this.getRemoteVulnkeywordList()
  },
  methods: {
    // 初始化
    codeMirrorInitialize(plugincode) {
      // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
      if (this.$refs.textarea) {
        this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options)

        // 编辑器赋值
        if (plugincode !== null) {
          this.coder.setValue(plugincode)
        // if (plugincode.indexOf('def check')) {
        //   this.coder.setValue(plugincode)
        // } else {
        //   this.coder.setValue(JSON.stringify(JSON.parse(plugincode), null, 4))
        // }
        } else {
          this.coder.setValue('')
        }

        // 支持双向绑定
        this.coder.on('change', (coder) => {
          this.code = coder.getValue()
          this.pojo.plugincode = this.code
          if (this.$emit) {
            this.$emit('input', this.code)
          }
        })

        // 尝试从父容器获取语法类型
        if (this.language) {
        // 获取具体的语法类型对象
          const modeObj = this._getLanguage(this.language)

          // 判断父容器传入的语法是否被支持
          if (modeObj) {
            this.mode = modeObj.label
          }
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

        // 由于真实值可能不规范，例如 java 的真实值是 x-java ，所以将 value 和 label 同时和传入语法进行比较
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
    remoteSearchVuln(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          vulnApi.search(1, 10, { 'name': query }).then(response => {
            this.remoteVulnOptions = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.remoteVulnOptions = []
      }
    },
    getRemoteServiceList() {
      assetportApi.findAllDistinctService().then(response => {
        this.remoteServiceList = response.data
      })
    },
    getRemoteVersionList() {
      assetportApi.findAllDistinctVersion().then(response => {
        this.remoteVersionList = response.data
      })
    },
    getRemoteVulnkeywordList() {
      vulnkeywordApi.findAllDistinctVulnKeyword().then(response => {
        this.remoteVulnkeywordList = response.data
      })
    },
    remoteSearchService(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          this.remoteServiceOptions = this.remoteServiceList.filter(item => {
            return item.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.remoteServiceOptions = []
      }
    },
    // remoteSearchService(query) {
    //   if (query !== '' && query) {
    //     this.searchLoading = true
    //     setTimeout(() => {
    //       this.searchLoading = false
    //       assetportApi.search(1, 10, { 'service': query }).then(response => {
    //         this.remoteServiceOptions = response.data.rows.filter(item => {
    //           return item.service.toLowerCase().indexOf(query.toLowerCase()) > -1
    //         })
    //       })
    //     }, 200)
    //   } else {
    //     this.remoteServiceOptions = []
    //   }
    // },
    remoteSearchVersion(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          this.remoteVersionOptions = this.remoteVersionList.filter(item => {
            return item.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.remoteVersionOptions = []
      }
    },
    remoteSearchVulnkeyword(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          this.remoteVulnkeywordOptions = this.remoteVulnkeywordList.filter(item => {
            return item.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.remoteVulnkeywordOptions = []
      }
    },
    handleSaveService(id, data) {
      this.servicePojo.pluginconfigid = id
      this.servicePojo.assetservice = data
      pluginassetserviceApi.save(this.servicePojo)
      this.servicePojo = {}
      // this.handleEdit(this.id)
    },
    handleDeleteService(id) {
      this.$confirm('此操作将永久删除已选记录, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        pluginassetserviceApi.deleteById(id).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) {
            this.closeDialogForm()
            this.handleEdit(this.id)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSaveVersion(id, data) {
      this.versionPojo.pluginconfigid = id
      this.versionPojo.assetversion = data
      pluginassetversionApi.save(this.versionPojo)
      this.versionPojo = {}
      // this.handleEdit(this.id)
    },
    handleDeleteVersion(id) {
      this.$confirm('此操作将永久删除已选记录, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        pluginassetversionApi.deleteById(id).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) {
            this.closeDialogForm()
            this.handleEdit(this.id)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSaveVulnkeyword(id, data) {
      this.vulnkeywordPojo.pluginconfigid = id
      this.vulnkeywordPojo.keyword = data
      vulnkeywordApi.save(this.vulnkeywordPojo)
      this.vulnkeywordPojo = {}
      // this.handleEdit(this.id)
    },
    handleDeleteVulnkeyword(id) {
      this.$confirm('此操作将永久删除已选记录, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        vulnkeywordApi.deleteById(id).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) {
            this.closeDialogForm()
            this.handleEdit(this.id)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSaveVulnPlugin(id, data) {
      this.vulnPluginPojo.pluginconfigid = id
      this.vulnPluginPojo.vulnid = data
      vulnpluginconfigApi.save(this.vulnPluginPojo)
      this.vulnPluginPojo = {}
      // this.handleEdit(this.id)
    },
    handleDeleteVulnPlugin(id) {
      this.$confirm('此操作将永久删除已选记录, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        vulnpluginconfigApi.deleteById(id).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) {
            this.closeDialogForm()
            this.handleEdit(this.id)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
      if (this.coder && this.$refs.textarea) {
        this.coder.toTextArea()
      }
    },
    closeOpenDialogForm() {
      this.closeDialogForm()
      this.dialogFormVisible = true
    },

    handleDeleteAll() {
      if (this.multipleSelection && this.multipleSelection.length) {
        this.$confirm('此操作将永久删除已选记录信息, 包括 [插件配置, 资产服务, 资产版本, 漏洞关键词, 漏洞插件配置关联, 任务插件配置], 是否继续?', '警告', {
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
      let addFlag = true
      if (this.checkedChecktypes && this.checkedChecktypes.length !== 0) {
        this.pojo.validatetype = this.checkedChecktypes.join(',')
      } else {
        this.pojo.validatetype = null
      }
      if (this.pojo.type === 'selfd') {
        if (this.pojo.plugincode === '') {
          this.pojo.plugincode = null
        } else {
          this.pojo.plugincode = this.coder.getValue()
        }
      }

      pluginconfigApi.update(this.id, this.pojo).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) { // 如果成功
          if (this.id === '') {
            for (let i = 0; i < this.selectedServiceList.length; i++) {
              this.handleSaveService(response.data, this.selectedServiceList[i])
            }
            for (let i = 0; i < this.selectedVersionList.length; i++) {
              this.handleSaveVersion(response.data, this.selectedVersionList[i])
            }
            for (let i = 0; i < this.selectedVulnkeywordList.length; i++) {
              this.handleSaveVulnkeyword(response.data, this.selectedVulnkeywordList[i])
            }
            for (let i = 0; i < this.selectedVulnList.length; i++) {
              this.handleSaveVulnPlugin(response.data, this.selectedVulnList[i])
            }
            addFlag = false
            this.fetchData()
            this.closeDialogForm()
          }
          this.fetchData()
        }
      })

      if (addFlag && this.id !== '') {
        for (let i = 0; i < this.selectedServiceList.length; i++) {
          this.handleSaveService(this.pojo.id, this.selectedServiceList[i])
        }
        for (let i = 0; i < this.selectedVersionList.length; i++) {
          this.handleSaveVersion(this.pojo.id, this.selectedVersionList[i])
        }
        for (let i = 0; i < this.selectedVulnkeywordList.length; i++) {
          this.handleSaveVulnkeyword(this.pojo.id, this.selectedVulnkeywordList[i])
        }
        for (let i = 0; i < this.selectedVulnList.length; i++) {
          this.handleSaveVulnPlugin(this.pojo.id, this.selectedVulnList[i])
        }
      }
      if (addFlag && this.id !== '') {
        this.closeDialogForm()
        // 暂时去除编辑保存后重新打开，此时插件代码还是上一次编辑的，刷新不了
        // this.fetchData()
        // this.handleEdit(this.id)
      }
      if (this.coder && this.$refs.textarea) {
        this.coder.toTextArea()
      }
    },
    getServiceByPluginId(id) {
      pluginassetserviceApi.findByPluginId(id).then(response => {
        if (response.flag) {
          this.servicePojoList = response.data
        }
      })
    },
    getVersionByPluginId(id) {
      pluginassetversionApi.findByPluginId(id).then(response => {
        if (response.flag) {
          this.versionPojoList = response.data
        }
      })
    },
    getVulnkeywordByPluginId(id) {
      vulnkeywordApi.findByPluginId(id).then(response => {
        if (response.flag) {
          this.vulnkeywordPojoList = response.data
        }
      })
    },
    getVulnPluginByPluginId(id) {
      vulnpluginconfigApi.findByPluginId(id).then(response => {
        if (response.flag) {
          this.vulnPluginPojoList = response.data
        }
      })
    },
    handleEdit(id) {
      this.servicePojo = {}
      this.versionPojo = {}
      this.vulnkeywordPojo = {}
      this.id = id
      this.dialogFormVisible = true // 打开窗口
      if (id !== '') { // 修改
        pluginconfigApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
            if (this.pojo.validatetype && this.pojo.validatetype.length !== 0) {
              this.checkedChecktypes = this.pojo.validatetype.split(',')
            }
            this.getServiceByPluginId(id)
            this.getVersionByPluginId(id)
            this.getVulnkeywordByPluginId(id)
            this.getVulnPluginByPluginId(id)
          }
        }).then(() => {
          if (this.pojo.type === 'selfd') {
            this.codeMirrorInitialize(this.pojo.plugincode)
          }
        })
      } else {
        this.codeMirrorInitialize(this.plugindemocdoe)
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除已选记录信息, 包括 [插件配置, 资产服务, 资产版本, 漏洞关键词, 漏洞插件配置关联, 任务插件配置], 是否继续?', '警告', {
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
