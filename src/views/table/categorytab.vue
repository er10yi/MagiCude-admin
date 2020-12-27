<template>
  <div>
    <br>
    <!-- 查询条件 -->
    <el-form ref="searchform" inline size="small" :model="searchMap">

      <el-form-item prop="nameLike" label="名称">
        <el-select v-model="searchMap.nameLike" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="模糊查询" :remote-method="getNameList" :loading="searchLoading">
          <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.name" /></el-select>
      </el-form-item>

      <el-form-item prop="name" label="名称">
        <el-select v-model="searchMap.id" style="width:150px;" filterable remote clearable placeholder="精准查询" :remote-method="getIdList" :loading="searchLoading">
          <el-option v-for="item in idList" :key="item.id" :label="item.name" :value="item.id" /></el-select>
      </el-form-item>

      <el-form-item label="展开">
        <el-input-number v-model="level" controls-position="right" :min="0" :max="50" @change="handleChange" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData()">查询</el-button>
        <el-button type="info" @click="resetForm('searchform')">重置</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="appendRoot()">新增</el-button>
      </el-form-item>

      <div class="invoice-list">
        <ul class="invoice-header">
          <li class="invoice-item">名称</li>
          <li class="invoice-item">说明</li>
          <li class="invoice-item">创建时间</li>
          <li class="invoice-item">备注</li>
          <li class="invoice-item">操作</li>
        </ul>
        <el-tree
          ref="tree"
          v-loading="listLoading"
          :props="defaultProps"
          :data="treeList"
          node-key="id"
          :default-expanded-keys="expandList"
          :expand-on-click-node="false"

          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >

          <span slot-scope="{ data }" class="custom-tree-node">
            <span class="table_info_item">{{ data.name }} </span>
            <span class="table_info_item">{{ data.description }} </span>
            <span class="table_info_item">{{ data.createtime | dateformat() }}</span>
            <span class="table_info_item">{{ data.remark }} </span>
            <span>
              <!-- <el-button type="text" size="mini" @click="() => append(data)">新增</el-button> -->
              <el-button type="text" size="mini" @click="() => appendChild(data)">新增子类</el-button>
              <el-button type="text" size="mini" @click="() => edit(data)">编辑</el-button>
              <el-button type="text" size="mini" @click="() => editChild(data)">编辑移动包括子类</el-button>
              <el-button type="text" size="mini" @click="() => remove(data)">删除</el-button>
              <el-button type="text" size="mini" @click="() => removeChild(data)">删除包括子类</el-button>
            </span>
          </span>
        </el-tree>
      </div>

      <!-- 底部分页 -->
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[100,200,500,1000,2000,5000]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="fetchData"
      />

      <!-- 编辑框 -->
      <el-dialog title="编辑(可移动当前类别)" :visible.sync="dialogFormVisible" width="50%" center :before-close="cleanCache">
        <el-form label-width="110px">
          <el-form-item required="" label="名称"><el-input v-model="pojo.name" clearable style="width:400px;" /></el-form-item>
          <el-form-item label="父类">
            <span>旧: {{ parentNode }}</span><br>
            <span>新: </span>
            <el-select v-model="pojo.parentId" style="width:378px;" filterable remote clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getCategoryList" :loading="searchLoading">
              <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" /></el-select>
          </el-form-item>

          <el-form-item label="说明"><el-input v-model="pojo.description" :autosize="{miniRows: 1}" type="textarea" clearable style="width:400px;" /></el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="pojo.createtime" style="width:400px;" type="datetime" />
          </el-form-item>
          <el-form-item label="备注"><el-input v-model="pojo.remark" :autosize="{miniRows: 1}" type="textarea" clearable style="width:400px;" /></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSaveNode()">保存</el-button>
          <el-button @click="closeDialogForm()">关闭</el-button>
        </span>
      </el-dialog>

      <!-- 编辑框 -->
      <el-dialog title="编辑(可移动包括子类)" :visible.sync="childNodeFormVisible" width="50%" center :before-close="cleanCache">
        <el-form label-width="110px">
          <el-form-item required="" label="名称"><el-input v-model="pojo.name" clearable style="width:400px;" /></el-form-item>
          <el-form-item label="父类">
            <span>旧: {{ parentNode }}</span><br>
            <span>新: </span>
            <el-select v-model="pojo.parentId" style="width:378px;" filterable remote clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getCategoryList" :loading="searchLoading">
              <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" /></el-select>
          </el-form-item>
          <el-form-item label="说明"><el-input v-model="pojo.description" :autosize="{miniRows: 1}" type="textarea" clearable style="width:400px;" /></el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="pojo.createtime" style="width:400px;" type="datetime" />
          </el-form-item>
          <el-form-item label="备注"><el-input v-model="pojo.remark" :autosize="{miniRows: 1}" type="textarea" clearable style="width:400px;" /></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSaveChildNode()">保存</el-button>
          <el-button @click="closeDialogForm()">关闭</el-button>
        </span>
      </el-dialog>

      <!-- 编辑框 -->
      <el-dialog title="编辑" :visible.sync="treeFormVisible" width="50%" center :before-close="cleanCache">
        <el-form label-width="110px">
          <span v-if="pojo.parentName !=='root'">
            <el-form-item label="父类"><span>{{ pojo.parentName }}</span></el-form-item>
            <br>
          </span>
          <el-form-item required="" label="名称"><el-input v-model="pojo.name" style="width:400px;" /></el-form-item>
          <span :v-model="pojo.parentId" hidden />
          <el-form-item label="说明"><el-input v-model="pojo.description" :autosize="{miniRows: 1}" type="textarea" style="width:400px;" /></el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="pojo.createtime" style="width:400px;" type="datetime" />
          </el-form-item>
          <el-form-item label="备注"><el-input v-model="pojo.remark" :autosize="{miniRows: 1}" type="textarea" style="width:400px;" /></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSave()">保存</el-button>
          <el-button @click="closeDialogForm()">关闭</el-button>
        </span>
      </el-dialog>
    </el-form></div>
</template>

<script>
import categoryApi from '@/api/categorytab'

export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 100, // 每页大小
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
      treeList: [],
      treeFormVisible: false,
      childNodeFormVisible: false,
      parentNode: '',
      categoryList: [],
      oldName: '',
      oldParentId: '',
      idList: [],
      checkAll: false,
      expandList: [],
      level: 0

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleChange(currentValue, oldValue) {
      this.expandList = []
      this.level = currentValue
      if (this.level > 0 && this.level < 21) {
        categoryApi.getChildren(0, this.level).then(response => {
          if (response.flag) {
            const tempList = response.data
            for (var i = 0; i < tempList.length; i++) {
              this.expandList.push(tempList[i].id)
            }
          }
        })
        // 收缩
        if (currentValue < oldValue) {
          this.fetchData()
        }
      } else {
        this.level = 0
        this.fetchData()
      }
    },
    handleCheckAllChange(val) {
      if (this.checkAll) {
        this.$refs.tree.setCheckedNodes(this.treeList)
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },

    getCategoryList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          categoryApi.search(1, 10, { 'name': query }).then(response => {
            this.categoryList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.categoryList = []
      }
    },
    handleSaveNode() {
      this.id = this.pojo.id
      if (this.pojo.parentId >= 0 && this.oldParentId !== this.pojo.parentId) {
        categoryApi.moveTo(this.id, this.pojo.parentId).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
        })
      }
      this.handleSave()
      this.treeList = []
      this.cleanCache()
    },
    handleSaveChildNode() {
      this.id = this.pojo.id
      if (this.pojo.parentId >= 0 && this.oldParentId !== this.pojo.parentId) {
        categoryApi.moveTreeTo(this.id, this.pojo.parentId).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
        })
      }

      this.handleSave()
      this.treeList = []
      this.cleanCache()
    },
    append(data) {
      this.pojo.parentId = data.parentId
      categoryApi.findById(this.pojo.parentId).then(response => {
        this.pojo.parentName = response.data.name
      }).then(() => {
        this.treeFormVisible = true
      })
    },
    appendRoot() {
      this.pojo.parentId = 0
      this.pojo.parentName = 'root'
      this.treeFormVisible = true
    },
    appendChild(data) {
      this.pojo.parentId = data.id
      this.pojo.parentName = data.name
      this.treeFormVisible = true
    },
    remove(data) {
      this.$confirm('此操作将永久删除当前分类，子类将上移一级, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        categoryApi.delete(data.id).then(response => {
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
    },
    removeChild(data) {
      this.$confirm('此操作将永久删除当前分类及所有子类, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        categoryApi.deleteTree(data.id).then(response => {
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
    },
    edit(data) {
      this.handleEdit(data.id)
    },
    editChild(data) {
      this.childNodeFormVisible = true
      this.handleEdit(data.id)
    },
    cleanCache() {
      this.closeDialogForm()
    },
    closeDialogForm() {
      this.dialogFormVisible = false
      this.treeFormVisible = false
      this.childNodeFormVisible = false
      this.pojo = {}
      this.categoryList = []
      this.parentNode = ''
      this.idList = []
      this.nameList = []
      this.id = ''
    },
    getNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          categoryApi.search(1, 10, { 'name': query }).then(response => {
            this.nameList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.nameList = []
      }
    },
    getIdList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          categoryApi.search(1, 10, { 'name': query }).then(response => {
            this.idList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.idList = []
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
          categoryApi.deleteAllByIds(ids).then(response => {
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
      // const allMenuId = [].concat(this.$refs.tree.getCheckedNodes(), this.$refs.tree.getHalfCheckedNodes(), this.$refs.tree.getHalfCheckedKeys(), this.$refs.tree.getCheckedKeys())
      // console.log(allMenuId)
      if (this.multipleSelection && this.multipleSelection.length) {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '漏洞一级分类名称'

          ]
          const filterVal = [
            'name'

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
      this.cleanCache()
      this.checkAll = false
      this.$refs.tree.setCheckedKeys([])
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
      this.treeList = []
      categoryApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      }).then(() => {
        this.getTreeData()
        console.log(this.treeList)
      })
      this.listLoading = false
    },
    getTreeData() {
      for (let i = 0; i < this.list.length; i++) {
        const parentId = this.list[i].parentId
        if (parentId === 0) {
          const objTemp = {
            id: this.list[i].id,
            name: this.list[i].name,
            description: this.list[i].description,
            createtime: this.list[i].createtime,
            remark: this.list[i].remark,
            parentId: parentId
          }
          this.treeList.push(objTemp)
        }
      }
      this.data2tree(this.list, this.treeList)
    },
    data2tree(datas, dataArray) {
      for (let j = 0; j < dataArray.length; j++) {
        const dataArrayIndex = dataArray[j]
        const childrenArray = []
        const Id = dataArrayIndex.id
        for (let i = 0; i < datas.length; i++) {
          const data = datas[i]
          const parentId = data.parentId
          if (parentId === Id) { // 判断是否为子类
            const objTemp = {
              id: data.id,
              name: data.name,
              description: data.description,
              createtime: data.createtime,
              remark: data.remark,
              parentId: parentId
            }
            childrenArray.push(objTemp)
          }
        }
        dataArrayIndex.children = childrenArray
        if (childrenArray.length > 0) { // 有子类则递归
          this.data2tree(datas, childrenArray)
        }
      }
      return dataArray
    },
    handleSave() {
      categoryApi.update(this.id, this.pojo).then(response => {
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
        categoryApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
            this.oldName = this.pojo.name
            this.oldParentId = this.pojo.parentId
            categoryApi.findById(this.pojo.parentId).then(response => {
              if (response.flag) {
                this.parentNode = response.data.name
              }
            })
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
        categoryApi.deleteById(id).then(response => {
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

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 10px;
    width: 100px;
  }
    /*设置鼠标悬浮经过的颜色*/
    .el-tree-node:hover > .el-tree-node__content {
      background-color: #cad6e963 !important;
    }
    /*设置鼠标点击后的颜色*/
    .el-tree-node:focus > .el-tree-node__content {
      background-color: #c8d0e260 !important;
    }
    /*设置tree每行的高度*/
    .el-tree-node__content {
      height: 30px;
    }

    .invoice-header {
      display: flex;
      font-size: 16px;
      padding: 0 0 0 12px;
    }
     .invoice-item {
        flex: 1;
      }
    .el-tree-node__content {
      height: 35px;
    }
    .el-tree-node__content {
        border-bottom: 1px solid #ebeef5;
      }
    .table_info_item {
          flex: 1;
          padding-left: 10px;
          line-height: 40px;
          width: 300px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
  li {list-style-type:none;}
</style>

