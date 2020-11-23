<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title"><i class="header-icon el-icon-info" />菜单栏隐藏与显示</template>
        <!-- 查询条件 -->
        <el-form ref="searchform" inline size="small" :model="searchMap">
          <el-form-item prop="assetip" label="ip">
            <el-select v-model="searchMap.assetip" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getIpaddressv4List" :loading="searchLoading">
              <el-option v-for="item in ipaddressv4List" :key="item.id" :label="item.ipaddressv4" :value="item.ipaddressv4" />
            </el-select>
          </el-form-item>
          <el-form-item prop="assetport" label="端口">
            <el-select v-model="searchMap.assetport" style="width:100px;" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getPortList" :loading="searchLoading">
              <el-option v-for="item in portList" :key="item.id" :label="item.port" :value="item.port" /></el-select>
          </el-form-item>

          <el-form-item prop="vulname" label="漏洞名称">
            <el-select v-model="searchMap.vulname" filterable remote allow-create default-first-option clearable placeholder="请输入" :remote-method="getVulNameList" :loading="searchLoading">
              <el-option v-for="item in vulNameList" :key="item.id" :label="item.name" :value="item.name" />
            </el-select></el-form-item>

          <el-form-item prop="name" label="插件名称">
            <el-select v-model="searchMap.name" allow-create default-first-option filterable remote clearable placeholder="请输入" :remote-method="getNameList" :loading="searchLoading">
              <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
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

          <el-form-item prop="result" label="检测结果">
            <el-select v-model="searchMap.result" allow-create default-first-option filterable remote clearable placeholder="请输入" :remote-method="getResultList" :loading="searchLoading">
              <el-option v-for="item in resultList" :key="item.id" :label="item.result" :value="item.result" />
            </el-select>
          </el-form-item>

          <el-form-item prop="starttime" label="发现时间">
            <el-date-picker v-model="searchMap.activetime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" range-separator="-" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:350px;" />
          </el-form-item>
          <el-form-item prop="endtime" label="修复时间">
            <el-date-picker v-model="searchMap.passivetime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" range-separator="-" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:350px;" />
          </el-form-item>

          <!-- <el-form-item label="备注">
        <el-input v-model="searchMap.remark" prop="remark" clearable placeholder="备注" /></el-form-item> -->

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
          <!--
          <el-form-item>
            <el-button type="primary" @click="handleEdit('')">新增</el-button>
          </el-form-item> -->
        </el-form>
      </el-collapse-item>    </el-collapse>

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

      <el-table-column sortable prop="assetip" label="ip" />
      <el-table-column sortable prop="assetportid" label="端口" />
      <el-table-column sortable prop="vulname" label="漏洞名称" />

      <el-table-column sortable prop="name" label="插件名称" />

      <el-table-column sortable prop="risk" label="风险">
        <template slot-scope="scope">
          <span v-if="scope.row.risk">
            <span v-if=" scope.row.risk=='致命'">
              <el-tag size="mini" type="danger" effect="plain">{{ scope.row.risk }}</el-tag>
            </span>
            <span v-else-if=" scope.row.risk=='严重'">
              <el-tag size="mini" type="danger" effect="plain">{{ scope.row.risk }}</el-tag>
            </span>
            <span v-else-if=" scope.row.risk=='高危'">
              <el-tag size="mini" type="warning" effect="plain">{{ scope.row.risk }}</el-tag>
            </span>
            <span v-else-if=" scope.row.risk=='中危'">
              <el-tag size="mini" effect="plain">{{ scope.row.risk }}</el-tag>
            </span>
            <span v-else-if=" scope.row.risk=='低危'">
              <el-tag size="mini" type="success" effect="plain">{{ scope.row.risk }}</el-tag>
            </span>
            <span v-else>
              <el-tag size="mini" type="info" effect="plain">{{ scope.row.risk }}</el-tag>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column sortable prop="result" label="检测结果" show-overflow-tooltip />

      <el-table-column sortable prop="activetime" label="发现时间">
        <template slot-scope="scope">
          {{ scope.row.activetime | dateformat() }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="passivetime" label="修复时间">
        <template slot-scope="scope">
          {{ scope.row.passivetime | dateformat() }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="remark" label="备注" />

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

        <el-form-item required label="ip">
          <span>{{ ipv4 }}</span>
          <span v-if="pojo.id==null">
            <el-select v-model="pojo.assetip" style="width:300px;" filterable remote clearable placeholder="请输入" :remote-method="getIpaddressv4List" :loading="searchLoading">
              <el-option v-for="item in ipaddressv4List" :key="item.id" :label="item.ipaddressv4" :value="item.ipaddressv4" />
            </el-select>
          </span>
        </el-form-item>

        <el-form-item required label="端口">
          <span>{{ assetport }}</span>
          <span v-if="pojo.id==null">
            <el-select v-model="pojo.assetport" style="width:300px;" filterable remote clearable placeholder="请输入" :remote-method="getPortList" :loading="searchLoading">
              <el-option v-for="item in portList" :key="item.id" :label="item.port" :value="item.port" /></el-select>
          </span>
        </el-form-item>

        <el-form-item required label="漏洞名称">
          <span>{{ vulname }}</span>
          <span v-if="pojo.id==null">
            <el-select v-model="pojo.vulname" style="width:300px;" filterable remote clearable placeholder="请输入" :remote-method="getVulNameList" :loading="searchLoading">
              <el-option v-for="item in vulNameList" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
          </span>
        </el-form-item>

        <el-form-item label="插件名称">
          <!-- <span>{{ pojo.name }}</span> -->
          <el-input v-model="pojo.name" style="width:300px;" />
        </el-form-item>
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
        <el-form-item label="检测结果"><el-input v-model="pojo.result" type="textarea" autosize /></el-form-item>

        <el-form-item label="时间">
          <el-date-picker v-model="pojo.activetime" placeholder="发现时间" type="datetime" />
          <el-date-picker v-model="pojo.passivetime" placeholder="修复时间" type="datetime" />
        </el-form-item>

        <el-form-item label="备注"><el-input v-model="pojo.remark" type="textarea" autosize /></el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import checkresultApi from '@/api/checkresult'
import assetipApi from '@/api/assetip'
import assetportApi from '@/api/assetport'
import vulnApi from '@/api/vuln'

import Vue from 'vue'
import checkresult from '@/api/checkresult'
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
      nameList: [],
      riskList: [],
      checkresultIds: [],
      resultList: [],
      activeNames: ['1'],
      ipaddressv4List: [],
      portList: [],
      vulNameList: [],
      ipv4: '',
      assetport: '',
      vulname: '',

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
    getVulNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          vulnApi.search(1, 10, { 'name': query }).then(response => {
            this.vulNameList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.vulNameList = []
      }
    },
    getPortList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          assetportApi.search(1, 10, { 'port': query }).then(response => {
            this.portList = response.data.rows.filter(item => {
              return item.port.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.portList = []
      }
    },
    getIpaddressv4List(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          assetipApi.search(1, 10, { 'ipaddressv4': query }).then(response => {
            this.ipaddressv4List = response.data.rows.filter(item => {
              return item.ipaddressv4.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.ipaddressv4List = []
      }
    },
    cleanCache() {
      this.closeDialogForm()
    },
    getResultList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          checkresultApi.search(1, 10, { 'result': query }).then(response => {
            this.resultList = response.data.rows.filter(item => {
              return item.result.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.resultList = []
      }
    },
    getNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          checkresultApi.search(1, 10, { 'name': query }).then(response => {
            this.nameList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.nameList = []
      }
    },
    getRiskList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          checkresultApi.search(1, 10, { 'risk': query }).then(response => {
            this.riskList = response.data.rows.filter(item => {
              return item.risk.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.riskList = []
      }
    },
    closeDialogForm() {
      this.assetport = ''
      this.ipv4 = ''
      this.vulname = ''
      this.ipaddressv4List = []
      this.portList = []
      this.nameList = []
      this.dialogFormVisible = false
    },

    handleDeleteAll() {
      if (this.multipleSelection && this.multipleSelection.length) {
        this.$confirm('此操作将永久删除已选记录,包括 [检测结果, 检测结果漏洞关联], 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const ids = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id)
          }
          checkresultApi.deleteAllByIds(ids).then(response => {
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
            'ip',
            '端口',
            '漏洞名称',
            '插件名称',
            '风险',
            '检测结果',
            '发现时间',
            '修复时间',
            '备注'

          ]
          const filterVal = [
            'assetip',
            'assetportid',
            'vulname',
            'name',
            'risk',
            'result',
            'activetime',
            'passivetime',
            'remark'

          ]
          const list = this.multipleSelection
          for (let i = 0; i < list.length; i++) {
            list[i].activetime = dateformat(list[i].activetime)
            list[i].passivetime = dateformat(list[i].passivetime)
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
      this.riskList = []
      this.resultList = []
      this.ipaddressv4List = []
      this.portList = []
      this.vulNameList = []
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
      checkresultApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSave() {
      checkresultApi.update(this.id, this.pojo).then(response => {
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
        checkresultApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
          }
          assetportApi.findById(this.pojo.assetportid).then(response => {
            if (response.flag) {
              this.assetport = response.data.port
            }
            assetipApi.findById(response.data.assetipid).then(response => {
              if (response.flag) {
                this.ipv4 = response.data.ipaddressv4
              }
            })
            checkresult.findVulNameById(this.pojo.id).then(response => {
              if (response.flag) {
                this.vulname = response.data
              }
            })
          })
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除已选记录,包括 [检测结果, 检测结果漏洞关联], 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        checkresultApi.deleteById(id).then(response => {
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
