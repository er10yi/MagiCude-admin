<template>
  <div>
    <br>
    <!-- 查询条件 -->
    <el-form ref="searchform" inline size="small" :model="searchMap">
      <!-- <el-form-item label="二级分类">
        <el-input v-model="searchMap.categorysecondid" style="width:150px;" prop="categorysecondid" clearable placeholder="二级分类" /></el-form-item> -->

      <el-form-item prop="categorysecondid" label="二级分类">
        <el-select v-model="searchMap.categorysecondid" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getCategorysecondList" :loading="searchLoading">
          <el-option v-for="item in categorysecondList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="">
        <el-input v-model="searchMap.name" prop="" style="width:150px;" clearable placeholder="名称" /></el-form-item> -->
      <el-form-item prop="name" label="名称">
        <el-select v-model="searchMap.name" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getNameList" :loading="searchLoading">
          <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.name" />
        </el-select></el-form-item>
      <el-form-item prop="description" label="描述">
        <el-select v-model="searchMap.description" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getDescriptionList" :loading="searchLoading">
          <el-option v-for="item in descriptionList" :key="item.id" :label="item.description" :value="item.description" />
        </el-select></el-form-item>
      <el-form-item prop="risk" label="风险">
        <el-select v-model="searchMap.risk" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getRiskList" :loading="searchLoading">
          <el-option v-for="item in riskList" :key="item.id" :label="item.risk" :value="item.risk" />
        </el-select></el-form-item>
      <el-form-item prop="refer" label="参考">
        <el-select v-model="searchMap.refer" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getReferList" :loading="searchLoading">
          <el-option v-for="item in referList" :key="item.id" :label="item.refer" :value="item.refer" />
        </el-select></el-form-item>
      <el-form-item prop="impactscope" label="影响范围">
        <el-select v-model="searchMap.impactscope" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getImpactscopeList" :loading="searchLoading">
          <el-option v-for="item in impactscopeList" :key="item.id" :label="item.impactscope" :value="item.impactscope" />
        </el-select></el-form-item>

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

      <el-table-column sortable prop="categorysecondid" label="二级分类" />
      <!-- <el-table-column sortable prop="categorysecondid" label="二级分类">
        <template slot-scope="scope">
          {{ getCategorysecondById(scope.row.categorysecondid) }}
        </template>
      </el-table-column> -->

      <el-table-column sortable prop="name" label="名称" />
      <el-table-column sortable prop="description" label="描述" show-overflow-tooltip />
      <el-table-column sortable prop="risk" label="风险" />
      <el-table-column sortable prop="refer" label="参考" show-overflow-tooltip />
      <el-table-column sortable prop="impactscope" label="影响范围" show-overflow-tooltip />

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

        <!-- <el-form-item label="二级分类"><el-input v-model="pojo.categorysecondid" style="width:300px;" /></el-form-item> -->

        <el-form-item required label="二级分类">
          <span>{{ categorysecondName }}</span>
          <el-select v-model="pojo.categorysecondid" style="width:300px;" filterable remote clearable placeholder="请输入" :remote-method="getCategorysecondList" :loading="searchLoading">
            <el-option v-for="item in categorysecondList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="名称"><el-input v-model="pojo.name" style="width:300px;" /></el-form-item> -->
        <el-form-item prop="name" label="名称">
          <el-select v-model="pojo.name" style="width:300px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getNameList" :loading="searchLoading">
            <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.name" />
          </el-select></el-form-item>

        <el-form-item label="描述"><el-input v-model="pojo.description" autosize type="textarea" /></el-form-item>
        <!-- <el-form-item label="风险"><el-input v-model="pojo.risk" style="width:300px;" /></el-form-item> -->
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
        <el-form-item label="参考"><el-input v-model="pojo.refer" autosize type="textarea" /></el-form-item>
        <el-form-item label="影响范围"><el-input v-model="pojo.impactscope" clearable autosize type="textarea" /></el-form-item>

        <span v-if="pojo.id">
          <!--示例代码 -->
          <!-- 表格数据 -->
          <el-form>
            <el-form-item label="新增示例代码">
              <el-button type="info" size="mini" icon="el-icon-circle-plus-outline" circle @click="handleEditDemocode('')" />
            </el-form-item>
          </el-form>
          <el-table
            :data="democodeList"
            fit
          >
            <!-- <el-table-column label="序号" type="index" :index="1" align="center" width="50" /> -->
            <el-table-column prop="democode" label="漏洞示例代码" />
            <el-table-column prop="poc" label="漏洞poc" />
            <el-table-column
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEditDemocode(scope.row.id)" />
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDeleteDemocode(scope.row.id)" />
              </template>
            </el-table-column>
          </el-table>

          <span hidden>{{ democodePojo.vulnid = pojo.id }}</span>
          <!-- 编辑框 -->
          <el-dialog title="编辑" :visible.sync="dialogFormVisibleDemocode" append-to-body width="40%">
            <el-form label-width="100px">
              <el-form-item label="漏洞示例代码"><el-input v-model="democodePojo.democode" autosize type="textarea" /></el-form-item>
              <el-form-item label="漏洞poc"><el-input v-model="democodePojo.poc" autosize type="textarea" /></el-form-item>

              <el-button type="primary" @click="handleSaveDemocode()">保存</el-button>
              <el-button @click="closeDialogFormSecond()">关闭</el-button>
            </el-form>
          </el-dialog>

          <!-- 解决方案 -->
          <!-- 表格数据 -->
          <el-form>
            <el-form-item label="新增解决方案">
              <el-button type="info" size="mini" icon="el-icon-circle-plus-outline" circle @click="handleEditSolution('')" />
            </el-form-item>
          </el-form>

          <el-table
            :data="solutionList"
            fit
          >
            <!-- <el-table-column label="序号" type="index" :index="1" align="center" width="50" /> -->
            <el-table-column prop="solution" label="修复方案" />
            <el-table-column prop="codedemo" label="修复代码示例" />
            <el-table-column prop="configdemo" label="修复配置示例" />
            <el-table-column
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEditSolution(scope.row.id)" />
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDeleteSolution(scope.row.id)" />
              </template>
            </el-table-column>
          </el-table>

          <span hidden>{{ solutionPojo.vulnid = pojo.id }}</span>
          <!-- 编辑框 -->
          <el-dialog title="编辑" :visible.sync="dialogFormVisibleSolution" append-to-body width="40%">
            <el-form label-width="100px">
              <el-form-item label="修复方案"><el-input v-model="solutionPojo.solution" autosize type="textarea" /></el-form-item>
              <el-form-item label="修复代码示例"><el-input v-model="solutionPojo.codedemo" autosize type="textarea" /></el-form-item>
              <el-form-item label="修复配置示例"><el-input v-model="solutionPojo.configdemo" autosize type="textarea" /></el-form-item>

              <el-button type="primary" @click="handleSaveSolution()">保存</el-button>
              <el-button @click="closeDialogFormSecond()">关闭</el-button>
            </el-form>
          </el-dialog>
        </span>
        <span v-else>
          <div slot="tip" class="el-upload__tip">漏洞保存后才能新增示例代码和解决方案</div>
        </span>
        <br>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import vulnApi from '@/api/vuln'
import categorysecondApi from '@/api/categorysecond'
import democodeApi from '@/api/democode'
import solutionApi from '@/api/solution'

export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      searchMap: {}, // 查询条件
      dialogFormVisible: false, // 编辑窗口是否可见
      dialogFormVisibleDemocode: false, // 编辑窗口是否可见
      dialogFormVisibleSolution: false, // 编辑窗口是否可见
      searchLoading: false,
      pojo: {}, // 编辑表单绑定的实体对象
      id: '', // 当前用户修改的ID

      filename: '',
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,

      categorysecondList: [],
      nameList: [],
      descriptionList: [],
      riskList: [],
      referList: [],
      impactscopeList: [],

      democodeId: '',
      democodePojo: {},
      democodeList: [],

      solutionId: '',
      solutionPojo: {},
      solutionList: [],

      tempId: '',
      categorysecondName: ''

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    cleanCache() {
      this.closeDialogForm()
    },
    closeDialogFormSecond() {
      this.dialogFormVisibleDemocode = false
      this.dialogFormVisibleSolution = false
    },
    handleSaveSolution() {
      solutionApi.update(this.solutionId, this.solutionPojo).then(response => {
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
    handleEditSolution(solutionId) {
      this.solutionId = solutionId
      this.dialogFormVisibleSolution = true // 打开窗口
      if (solutionId !== '') { // 修改
        solutionApi.findById(solutionId).then(response => {
          if (response.flag) {
            this.solutionPojo = response.data
          }
        })
      } else {
        this.solutionPojo = {} // 清空数据
      }
    },
    handleDeleteSolution(solutionId) {
      this.$confirm('此操作将永久删除已选记录, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        solutionApi.deleteById(solutionId).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) {
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
    handleSaveDemocode() {
      democodeApi.update(this.democodeId, this.democodePojo).then(response => {
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
    handleEditDemocode(democodeId) {
      this.democodeId = democodeId
      this.dialogFormVisibleDemocode = true // 打开窗口
      if (democodeId !== '') { // 修改
        democodeApi.findById(democodeId).then(response => {
          if (response.flag) {
            this.democodePojo = response.data
          }
        })
      } else {
        this.democodePojo = {} // 清空数据
      }
    },
    handleDeleteDemocode(democodeId) {
      this.$confirm('此操作将永久删除已选记录, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        democodeApi.deleteById(democodeId).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) {
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
    getDescriptionList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          vulnApi.search(1, 10, { 'description': query }).then(response => {
            this.descriptionList = response.data.rows.filter(item => {
              return item.description.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.descriptionList = []
      }
    },
    getRiskList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          vulnApi.search(1, 10, { 'risk': query }).then(response => {
            this.riskList = response.data.rows.filter(item => {
              return item.risk.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.riskList = []
      }
    },
    getReferList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          vulnApi.search(1, 10, { 'refer': query }).then(response => {
            this.referList = response.data.rows.filter(item => {
              return item.refer.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.referList = []
      }
    },
    getImpactscopeList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          vulnApi.search(1, 10, { 'impactscope': query }).then(response => {
            this.impactscopeList = response.data.rows.filter(item => {
              return item.impactscope.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.impactscopeList = []
      }
    },
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
    getCategorysecondList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          categorysecondApi.search(1, 10, { 'name': query }).then(response => {
            this.categorysecondList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.categorysecondList = []
      }
    },
    closeDialogForm() {
      this.dialogFormVisible = false
      this.democodeList = []
      this.solutionList = []
      this.categorysecondList = []
      this.categorysecondName = ''
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
          vulnApi.deleteAllByIds(ids).then(response => {
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
            '二级分类',
            '名称',
            '描述',
            '风险',
            '参考',
            '影响范围'

          ]
          const filterVal = [
            'categorysecondid',
            'name',
            'description',
            'risk',
            'refer',
            'impactscope'

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
      this.categorysecondList = []
      this.nameList = []
      this.descriptionList = []
      this.riskList = []
      this.referList = []
      this.impactscopeList = []
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
      vulnApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSave() {
      vulnApi.update(this.id, this.pojo).then(response => {
        this.tempId = response.data
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) { // 如果成功
          this.fetchData() // 刷新列表
        }
      }).then(() => {
        if (this.tempId) {
          this.handleEdit(this.tempId)
        } else {
          this.closeDialogForm() // 关闭窗口
        }
      })
    },
    handleEdit(id) {
      this.id = id
      this.dialogFormVisible = true // 打开窗口
      if (id !== '') { // 修改
        vulnApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
            categorysecondApi.findById(this.pojo.categorysecondid).then((response) => {
              if (response.flag) {
                this.categorysecondName = response.data.name
                this.pojo.categorysecondid = null
              }
            })
            democodeApi.findAllByVulnId(this.id).then(response => {
              this.democodeList = response.data
            })
            solutionApi.findAllByVulnId(this.id).then(response => {
              this.solutionList = response.data
            })
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除已选记录, 包括 [漏洞, 示例代码, 解决方案], 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        vulnApi.deleteById(id).then(response => {
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
