<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title"><i class="header-icon el-icon-info" />菜单栏隐藏与显示</template>
        <!-- 查询条件 -->
        <el-form ref="searchform" inline size="small" :model="searchMap">
          <!-- <el-form-item label="任务父编号"> -->
          <!-- <el-input v-model="searchMap.taskparentid" prop="taskparentid" clearable placeholder="任务父编号" /></el-form-item> -->
          <!-- <el-form-item prop="projectid" label="父任务">
            <el-select v-model="searchMap.taskparentid" filterable clearable placeholder="请输入关键词搜索并手动选择">
              <el-option
                v-for="item in list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item> -->

          <!-- <el-form-item label="任务项目编号">
        <el-input v-model="searchMap.projectid" prop="projectid" clearable placeholder="任务项目编号" /></el-form-item> -->

          <el-form-item prop="showChildTask" label="显示子任务">
            <el-switch v-model="showChildTask" />
          </el-form-item>

          <el-form-item v-if="showproject" prop="projectid" label="任务项目">
            <el-select v-model="searchMap.projectid" style="width:150px;" filterable remote clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getProjectnameList" :loading="searchLoading">
              <el-option v-for="item in projectnameList" :key="item.id" :label="item.name" :value="item.id" /></el-select>
          </el-form-item>

          <el-form-item prop="name" label="名称">
            <el-select v-model="searchMap.name" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getTaskNameList" :loading="searchLoading">
              <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.name" /></el-select>
          </el-form-item>

          <el-form-item prop="starttime" label="开始">
            <el-date-picker v-model="searchMap.starttime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" range-separator="-" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:350px;" />
          </el-form-item>
          <el-form-item prop="endtime" label="结束">
            <el-date-picker v-model="searchMap.endtime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" range-separator="-" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:350px;" />
          </el-form-item>

          <el-form-item prop="worktype" label="类型">
            <el-select v-model="searchMap.worktype" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getWorktypeList" :loading="searchLoading">
              <el-option v-for="item in worktypeList" :key="item.id" :label="item.worktype" :value="item.worktype" /></el-select>
          </el-form-item>
          <el-form-item v-if="showcheck" prop="checktype" label="检测">
            <el-select v-model="searchMap.checktype" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getChecktypeList" :loading="searchLoading">
              <el-option v-for="item in checktypeList" :key="item.id" :label="item.checktype" :value="item.checktype" /></el-select>
          </el-form-item>
          <el-form-item v-if="showadditionoption" prop="additionoption" label="选项">
            <el-select v-model="searchMap.additionoption" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getAdditionoptionList" :loading="searchLoading">
              <el-option v-for="item in additionoptionList" :key="item.id" :label="item.additionoption" :value="item.additionoption" /></el-select>
          </el-form-item>
          <el-form-item prop="targetip" label="目标">
            <el-select v-model="searchMap.targetip" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getTargetipList" :loading="searchLoading">
              <el-option v-for="item in targetipList" :key="item.id" :label="item.targetip" :value="item.targetip" /></el-select>
          </el-form-item>
          <el-form-item prop="targetport" label="端口">
            <el-select v-model="searchMap.targetport" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getTargetportList" :loading="searchLoading">
              <el-option v-for="item in targetportList" :key="item.id" :label="item.targetport" :value="item.targetport" /></el-select>
          </el-form-item>
          <el-form-item v-if="showexcludeip" prop="excludeip" label="排除ip">
            <el-select v-model="searchMap.excludeip" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getExcludeipList" :loading="searchLoading">
              <el-option v-for="item in excludeipList" :key="item.id" :label="item.excludeip" :value="item.excludeip" /></el-select>
          </el-form-item>

          <el-form-item v-if="showcron" prop="crontask" label="cron">
            <el-switch v-model="searchMap.crontask" />
          </el-form-item>
          <el-form-item v-if="showexcludedbip" prop="dbipisexcludeip" label="排除db中ip">
            <el-switch v-model="searchMap.dbipisexcludeip" />
          </el-form-item>
          <el-form-item v-if="showmerge2asset" prop="merge2asset" label="结果合并到资产">
            <el-switch v-model="searchMap.merge2asset" />
          </el-form-item>

          <el-form-item label="描述">
            <el-input v-model="searchMap.description" prop="description" clearable placeholder="描述" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="fetchData()"> 查询</el-button>
            <el-button type="info" @click="resetForm('searchform')">重置</el-button>
            <el-input v-model="filename" placeholder="默认名字：报告" clearable style="width:180px;" prefix-icon="el-icon-document" />
            <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="handleDownload">导出</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleDeleteAll">删除</el-button>
            <el-button type="primary" @click="handleEdit('')">新建任务</el-button>
          </el-form-item>

          <el-form-item>
            <el-popover
              placement="bottom"
              width="400"
              trigger="hover"
            >
              <el-button slot="reference">增加显示</el-button>
              <el-col :span="12"><el-checkbox @change="showHide('showcheck')">检测类型</el-checkbox></el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showproject')">任务项目</el-checkbox></el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showrate')">速率</el-checkbox></el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showexcludeip')">排除ip</el-checkbox></el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showthreadn')">线程数量</el-checkbox></el-col>
              <!-- <el-col :span="12"><el-checkbox @change="showHide('showcronexp')">cron表达式</el-checkbox></el-col>  -->
              <el-col :span="12"><el-checkbox @change="showHide('showcron')">是否cron任务</el-checkbox></el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showparent')">父任务(需开启显示子任务)</el-checkbox></el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showipn')">单个ip扫描次数</el-checkbox></el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showipslicesize')">ip分组大小</el-checkbox></el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showportsize')">端口分组大小</el-checkbox></el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showexcludedbip')">是否排除数据库ip</el-checkbox></el-col>
              <el-col :span="12"><el-checkbox @change="showHide('showmerge2asset')">合并到资产库</el-checkbox></el-col>
            </el-popover>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <!-- 子任务显示 -->
    <el-drawer
      title="子任务"
      :visible.sync="drawer"
      :with-header="false"
      direction="rtl"
      size="65%"
      :before-close="handleDrawerClose"
    >

      <el-collapse v-model="childActiveNames">
        <el-collapse-item name="1">
          <template slot="title"><i class="header-icon el-icon-info" />子任务-菜单栏隐藏与显示</template>
          <!-- 查询条件 -->
          <el-form ref="searchformchild" inline size="small" :model="childSearchMap">

            <!-- <el-form-item prop="name" label="名称">
              <el-select v-model="childSearchMap.name" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getTaskNameList" :loading="searchLoading">
                <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.name" /></el-select>
            </el-form-item> -->

            <el-form-item prop="starttime" label="开始">
              <el-date-picker v-model="childSearchMap.starttime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" range-separator="-" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:350px;" />
            </el-form-item>
            <el-form-item prop="endtime" label="结束">
              <el-date-picker v-model="childSearchMap.endtime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" range-separator="-" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:350px;" />
            </el-form-item>

            <!-- <el-form-item prop="worktype" label="类型">
              <el-select v-model="childSearchMap.worktype" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getWorktypeList" :loading="searchLoading">
                <el-option v-for="item in worktypeList" :key="item.id" :label="item.worktype" :value="item.worktype" /></el-select>
            </el-form-item>
            <el-form-item prop="additionoption" label="选项">
              <el-select v-model="childSearchMap.additionoption" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getAdditionoptionList" :loading="searchLoading">
                <el-option v-for="item in additionoptionList" :key="item.id" :label="item.additionoption" :value="item.additionoption" /></el-select>
            </el-form-item>
            <el-form-item prop="targetip" label="目标">
              <el-select v-model="childSearchMap.targetip" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getTargetipList" :loading="searchLoading">
                <el-option v-for="item in targetipList" :key="item.id" :label="item.targetip" :value="item.targetip" /></el-select>
            </el-form-item>
            <el-form-item prop="targetport" label="端口">
              <el-select v-model="childSearchMap.targetport" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getTargetportList" :loading="searchLoading">
                <el-option v-for="item in targetportList" :key="item.id" :label="item.targetport" :value="item.targetport" /></el-select>
            </el-form-item>
            <el-form-item prop="excludeip" label="排除ip">
              <el-select v-model="childSearchMap.excludeip" style="width:150px;" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getExcludeipList" :loading="searchLoading">
                <el-option v-for="item in excludeipList" :key="item.id" :label="item.excludeip" :value="item.excludeip" /></el-select>
            </el-form-item> -->

            <el-form-item>
              <el-button type="primary" @click="childFetchData()"> 查询</el-button>
              <el-button type="info" @click="resetForm('searchformchild')">重置</el-button>
              <el-button type="danger" icon="el-icon-delete" @click="childHandleDeleteAll">删除</el-button>
              <!-- <el-button type="primary" @click="handleEdit('')">新增</el-button> -->
            </el-form-item>

          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-table
        ref="multipleTable"
        v-loading="childListLoading"
        :data="childList"
        border
        fit
        style="width: 100%;"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        @selection-change="childHandleSelectionChange"
      >

        <el-table-column type="selection" align="center" />
        <el-table-column label="序号" type="index" :index="1" align="center" width="50" />

        <!-- <el-table-column sortable prop="name" label="名称" /> -->

        <el-table-column sortable prop="starttime" label="开始">
          <template slot-scope="scope">
            {{ scope.row.starttime | dateformat() }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="endtime" label="结束">
          <template slot-scope="scope">
            {{ scope.row.endtime | dateformat() }}
          </template>
        </el-table-column>

        <el-table-column align="center" prop="worktype" label="类型" width="100">

          <template slot-scope="scope">
            <el-progress :text-inside="true" :stroke-width="20" :percentage="parseInt(scope.row.percentage)" :class="parseInt(scope.row.percentage)|showProgressColor" />
            <span v-if="scope.row.worktype">

              {{ scope.row.worktype }}<br>
              <!-- <span v-if="!scope.row.checktype">
                <el-tooltip placement="top">
                  <div slot="content">开始</div>
                  <el-button type="success" size="mini" icon="el-icon-video-play" circle @click="executeTask(scope.row.id)" />
                </el-tooltip>
              </span> -->

              <el-tooltip placement="top">
                <div slot="content">停止</div>
                <el-button type="danger" size="mini" icon="el-icon-video-pause" circle @click="stopTask(scope.row.id)" />
              </el-tooltip>

              <!-- <br>
              <span v-if="scope.row.worktype!='nse'&&scope.row.worktype!='selfd'&&scope.row.worktype!='httpp'">
                <el-tooltip placement="top">
                  <div slot="content">重新开始</div>
                  <el-button size="mini" icon="el-icon-refresh" circle @click="repeatTask(scope.row.id)" />
                </el-tooltip>
              </span> -->

              <el-tooltip placement="top">
                <div slot="content">获取状态</div>
                <el-button type="info" size="mini" icon="el-icon-warning-outline" circle @click="getChildTaskStatusPercent(scope.row.id)" />
              </el-tooltip>

            </span>
          </template>

        </el-table-column>

        <el-table-column prop="threadnumber" label="线程" />
        <!-- <el-table-column sortable prop="singleipscantime" label="ip扫描次数" /> -->
        <el-table-column prop="additionoption" label="选项" />
        <el-table-column prop="rate" label="速率" />
        <el-table-column prop="targetip" label="目标" show-overflow-tooltip />
        <el-table-column prop="targetport" label="端口" show-overflow-tooltip />
        <el-table-column prop="excludeip" label="排除ip" show-overflow-tooltip />
        <el-table-column prop="ipslicesize" label="ip分组" />
        <el-table-column prop="portslicesize" label="端口分组" />

        <!-- <el-table-column align="center" sortable label="排除db中ip">
          <template slot-scope="scope">
            <span>{{ formatBoolean(scope.row.dbipisexcludeip) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable label="结果合并到资产">
          <template slot-scope="scope">
            <span>{{ formatBoolean(scope.row.merge2asset) }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <!-- <el-table-column
          fixed="right"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEdit(scope.row.id)" />
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)" />
          </template>
        </el-table-column> -->

      </el-table>

      <!-- 底部分页 -->
      <el-pagination
        :current-page.sync="childCurrentPage"
        :page-sizes="[10,20,50,200]"
        :page-size="childPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="childTotal"
        @size-change="childHandleSizeChange"
        @current-change="childFetchData"
      />

    </el-drawer>

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
      <!-- <el-table-column sortable prop="id" label="任务编号" /> -->
      <el-table-column v-if="showparent" key="2" prop="taskparentid" label="父任务" />

      <el-table-column v-if="showproject" key="3" prop="projectid" label="任务项目" />

      <!-- <el-table-column sortable prop="projectid" label="项目" /> -->

      <!-- <el-table-column sortable prop="name" label="名称" /> -->

      <el-table-column key="4" prop="name" label="名称">
        <template slot="header">
          <span>名称</span>
          <el-tooltip placement="top">
            <div slot="content">子任务数量</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.taskparentid===null">
            <span v-if="scope.row.statistic!=='0'">
              <el-link :underline="false" @click="handleDrawer(scope.row.id) ">
                {{ scope.row.name }}
              </el-link>
              <span v-if=" scope.row.statistic"> <el-tag size="mini" type="success" effect="plain">{{ scope.row.statistic }}</el-tag></span>

            </span>
            <span v-else>
              {{ scope.row.name }} <el-tag size="mini" type="info" effect="plain">0</el-tag>
            </span>
          </span>
          <span v-else>
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="showcronexp" key="5" width="120" prop="cronexpression" label="cron表达式" /> -->

      <el-table-column prop="cronexpression" label="cron表达式">
        <template slot="header">
          <span>cron表达式</span>
          <el-tooltip placement="top">
            <div slot="content">调度状态</div>
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="当前只解析时间，调度状态正常才会执行"
            width="450"
            trigger="click"
          >
            <el-alert :closable="false">
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
            </el-alert>
            <el-link slot="reference" :underline="false" @click="parseCron(scope.row.cronexpression)"> {{ scope.row.cronexpression }}
              <span v-if="scope.row.jobstate">
                <span v-if=" scope.row.jobstate=='正常'">
                  <el-tag size="mini" type="success" effect="plain">{{ scope.row.jobstate }}</el-tag>
                </span>
                <span v-else-if=" scope.row.jobstate=='出错'">
                  <el-tag size="mini" type="danger" effect="plain">{{ scope.row.jobstate }}</el-tag>
                </span>
                <span v-else-if=" scope.row.jobstate=='阻塞'">
                  <el-tag size="mini" type="warning" effect="plain">{{ scope.row.jobstate }}</el-tag>
                </span>
                <span v-else>
                  <el-tag size="mini" type="info" effect="plain">{{ scope.row.jobstate }}</el-tag>
                </span>
              </span>
            </el-link>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column v-if="showcron" key="6" align="center" label="cron" width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.crontask ">
            <!-- <span>{{ formatBoolean(scope.row.crontask) }}</span><br> -->
            <!-- <el-link @click="stopScheduleTask(scope.row.id)">删除</el-link> -->
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="stopScheduleTask(scope.row.id)" />
          </span>
        </template>
      </el-table-column>

      <el-table-column key="7" width="160" sortable prop="starttime" label="开始">
        <template slot-scope="scope">
          {{ scope.row.starttime | dateformat() }}
        </template>
      </el-table-column>
      <el-table-column key="8" width="160" sortable prop="endtime" label="结束">
        <template slot-scope="scope">
          {{ scope.row.endtime | dateformat() }}
        </template>
      </el-table-column>

      <el-table-column key="9" align="center" prop="worktype" label="类型" width="170">

        <template slot-scope="scope">
          <span v-if="scope.row.worktype">

            <el-progress :text-inside="true" :stroke-width="20" :percentage="parseInt(scope.row.percentage)" :class="parseInt(scope.row.percentage)|showProgressColor" />
            <span>{{ scope.row.worktype }}</span><br>
            <span v-if="!scope.row.checktype&&scope.row.taskparentid===null">
              <el-tooltip placement="top">
                <div slot="content">开始</div>
                <el-button type="success" size="mini" icon="el-icon-video-play" circle @click="executeTask(scope.row.id)" />
              </el-tooltip>
            </span>
            <!-- <span v-if="scope.row.targetip!=='ipNoPort'&&scope.row.targetip!=='unknownPortSerVer'&&scope.row.targetip!=='ipAllPort'"> -->

            <el-tooltip placement="top">
              <div slot="content">停止</div>
              <el-button type="danger" size="mini" icon="el-icon-video-pause" circle @click="stopTask(scope.row.id)" />
            </el-tooltip>
            <!-- </span> -->
            <!-- <br> -->
            <span v-if="scope.row.worktype!='nse'&&scope.row.worktype!='selfd'&&scope.row.worktype!='httpp'&&scope.row.taskparentid===null">
              <el-tooltip placement="top">
                <div slot="content">重新开始</div>
                <el-button size="mini" icon="el-icon-refresh" circle @click="repeatTask(scope.row.id)" />
              </el-tooltip>
            </span>

            <el-tooltip placement="top">
              <div slot="content">获取状态</div>
              <el-button type="info" size="mini" icon="el-icon-warning-outline" circle @click="getTaskStatusPercent(scope.row.id)" />
            </el-tooltip>
          </span>
          <span v-if="scope.row.crontask ">
            <el-tooltip placement="top">
              <div slot="content">删除cron任务</div>
              <el-button type="info" size="mini" icon="el-icon-delete-solid" circle @click="stopScheduleTask(scope.row.id)" />
            </el-tooltip>
            <!-- <span>{{ formatBoolean(scope.row.crontask) }}</span><br> -->
          </span>
        </template>

      </el-table-column>

      <el-table-column v-if="showcheck" key="10" align="center" prop="checktype" label="检测">

        <template slot-scope="scope">
          <span v-if="scope.row.checktype">
            {{ scope.row.checktype }}<br>
            <span v-if="scope.row.starttime && scope.row.endtime&&!scope.row.taskparentid">
              <el-tooltip placement="top">
                <div slot="content">开始</div>
                <el-button type="success" size="mini" icon="el-icon-video-play" circle @click="executeCheck(scope.row.id)" />
              </el-tooltip>
            </span>
          </span>
        </template>

      </el-table-column>

      <el-table-column v-if="showthreadn" key="11" prop="threadnumber" width="50" label="线程" />
      <el-table-column v-if="showipn" key="12" prop="singleipscantime" width="50" label="次数" />
      <el-table-column v-if="showadditionoption" key="13" prop="additionoption" label="选项" />
      <el-table-column v-if="showrate" key="14" prop="rate" width="80" label="速率" />
      <el-table-column key="15" prop="targetip" label="目标" show-overflow-tooltip />
      <el-table-column key="16" prop="targetport" label="端口" show-overflow-tooltip />
      <el-table-column v-if="showexcludeip" key="17" prop="excludeip" label="排除ip" show-overflow-tooltip />
      <el-table-column v-if="showipslicesize" key="18" prop="ipslicesize" label="ip分组" />
      <el-table-column v-if="showportsize" key="19" prop="portslicesize" label="端口分组" />

      <el-table-column v-if="showexcludedbip" key="20" align="center" label="排除db中ip">
        <template slot-scope="scope">
          <span>{{ formatBoolean(scope.row.dbipisexcludeip) }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showmerge2asset" key="21" align="center" label="结果合并到资产">
        <template slot-scope="scope">
          <span>{{ formatBoolean(scope.row.merge2asset) }}</span>
        </template>
      </el-table-column>
      <el-table-column key="22" prop="description" label="描述" show-overflow-tooltip />
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

    <el-dialog title="新建任务" :visible.sync="newTaskDialogFormVisible" width="50%" center :before-close="closeNewTaskDialogForm">
      <el-steps :active="active" finish-status="success">
        <el-step title="名称及扫描类型" />
        <el-step title="选择任务类型" />
        <el-step title="设置目标" />
      </el-steps>

      <el-alert :closable="false" title="临时显示区">
        任务名称 : {{ pojo.name }} <br>
        扫描类型 : {{ targetType }}<br>
        任务类型 : {{ pojo.worktype }}<br>
        <span v-if="pojo.checktype">
          检测类型 : {{ pojo.checktype }}<br>
        </span>
        目 标 : {{ pojo.targetip }}<br>

      </el-alert>

      <br>
      <!-- 选择目标类型 -->
      <el-form label-width="200px">
        <div v-if="active==0">
          <el-form label-width="110px">
            <el-form-item required label="任务名称"><el-input v-model="pojo.name" clearable /></el-form-item>
            <el-form-item required label="扫描类型">
              <el-radio-group v-model="targetType">
                <el-radio-button label="端口扫描" />
                <el-radio-button label="安全扫描" />
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>

        <!-- 选择任务类型 -->
        <div v-if="active==1">
          <el-form label-width="110px">
            <span v-if="targetType =='端口扫描'">
              <el-form-item required label="类型">
                <el-radio-group v-model="pojo.worktype">
                  <el-radio-button label="nmap" />
                  <el-radio-button label="mass" />
                  <el-radio-button label="mass2Nmap" />
                </el-radio-group>
              </el-form-item>
            </span>

            <span v-if="targetType =='安全扫描'">
              <el-form-item required label="类型">
                <el-radio-group v-model="pojo.worktype">
                  <el-radio-button label="nse" />
                  <el-radio-button label="selfd" />
                  <el-radio-button label="httpp" />
                </el-radio-group>
              </el-form-item>
            </span>

            <!-- <span v-if="targetType =='安全扫描'">
              <el-form-item required label="类型">
                <el-radio-group v-model="pojo.worktype">
                  <el-radio-button label="nmap" />
                  <el-radio-button label="mass" />
                  <el-radio-button label="mass2Nmap" />
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-checkbox-group v-model="checkedChecktypes">
                  <el-checkbox-button v-for="check in checks" :key="check" :label="check" />
                </el-checkbox-group>

              </el-form-item>
            </span> -->

          </el-form>
        </div>

        <!-- 目标或插件 -->
        <div v-if="active==2">
          <el-form label-width="110px">
            <span v-if="targetType =='端口扫描' && pojo.worktype=='nmap'">
              <el-form-item required label="目标">
                <el-radio-group v-model="assetTargetOrInput">
                  <el-radio-button label="手动填写的ip或域名" />
                  <el-radio-button label="数据库中的ip" />
                  <!-- <el-radio-button label="数据库中的域名" /> -->
                </el-radio-group>
              </el-form-item>
              <span v-if="assetTargetOrInput =='数据库中的ip'">
                <el-form-item label="选择ip类型">
                  <el-radio-group v-model="pojo.targetip">
                    <el-tooltip placement="top">
                      <div slot="content">数据库中所有没有端口且未下线的ip</div>
                      <el-radio-button label="ipNoPort" />
                    </el-tooltip>

                    <el-tooltip placement="top">
                      <div slot="content">更新符合以下情况的ip的service和version:<br>端口service [为空, null, tcpwrapped, unknown, 包含?] 的ip<br>端口version [为空, null] 的ip</div>
                      <el-radio-button label="unknownPortSerVer" />
                    </el-tooltip>

                    <el-tooltip placement="top">
                      <div slot="content">数据库中全部有端口的ip和端口</div>
                      <el-radio-button label="ipAllPort" />
                    </el-tooltip>
                  </el-radio-group>
                </el-form-item>

              </span>
            </span>

            <span v-if="assetTargetOrInput =='数据库中的域名'">
              <span hidden> {{ pojo.targetip='assetdomain' }}</span>
            </span>

            <span v-if="assetTargetOrInput =='手动填写的ip或域名'&&pojo.worktype!=='mass'&&pojo.worktype!=='mass2Nmap'">
              <el-form-item required label="填写目标">
                <el-input v-model="pojo.targetip" :autosize="{maxRows: 10}" type="textarea" placeholder="格式:单个ip,ip段,CIDR或域名, 举例: assetip或192.168.1.1,192.168.2.1-192.168.2.100,192.168.3.0/24,nmap.org" />
              </el-form-item>
            </span>
            <span v-if="pojo.worktype=='mass'||pojo.worktype=='mass2Nmap'">
              <el-form-item required label="填写ip">
                <el-input v-model="pojo.targetip" :autosize="{maxRows: 10}" type="textarea" placeholder="格式:单个ip,ip段,CIDR, 举例: 192.168.1.1,192.168.2.1-192.168.2.100,192.168.3.0/24" />
              </el-form-item>
            </span>
          </el-form>

          <el-form label-width="110px">
            <span v-if="targetType =='安全扫描'">
              <el-form-item required label="目标">
                <el-radio-group v-model="assetTargetOrInput">
                  <!-- <el-radio-button label="手动填写的ip或域名" /> -->
                  <el-radio-button label="数据库中的ip" />
                  <!-- <el-radio-button label="数据库中的域名" /> -->
                </el-radio-group>
              </el-form-item>
            </span>

            <span v-if="assetTargetOrInput =='数据库中的ip'&&pojo.worktype!=='nmap'&&pojo.worktype!=='mass'&&pojo.worktype!=='mass2Nmap'">
              <span hidden>{{ pojo.targetip='assetip' }}</span>

            </span>
            <span v-if="assetTargetOrInput =='数据库中的域名'">
              <span hidden> {{ pojo.targetip='assetdomain' }}</span>
            </span>

          </el-form>

          <!-- 高级选项 -->
          <span v-if="assetTargetOrInput=='数据库中的ip'||assetTargetOrInput =='数据库中的域名'||assetTargetOrInput=='手动填写的ip或域名'||pojo.worktype=='mass'||pojo.worktype=='mass2Nmap'">
            <el-form label-width="110px">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="高级选项(可选配置)">
                  <el-form-item prop="projectid" label="任务项目">
                    <el-select v-model="pojo.projectid" style="width:400px;" filterable remote clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getProjectnameList" :loading="searchLoading">
                      <el-option v-for="item in projectnameList" :key="item.id" :label="item.name" :value="item.id" /></el-select>

                  </el-form-item>

                  <span v-if="pojo.worktype == 'nmap'&&(pojo.portslicesize == null||pojo.portslicesize == '')&&pojo.targetip !=='unknownPortSerVer'&&pojo.targetip !=='ipAllPort'&&pojo.additionoption !== '-sn'">
                    <el-tooltip placement="top">
                      <div slot="content">格式1: <br>格式2:regular<br>格式3:80,443,1-1001<br>格式说明: 为空代表所有端口, regular为nmap默认端口</div>
                      <el-form-item label="端口"><el-input v-model="pojo.targetport" clearable :autosize="{maxRows: 10}" type="textarea" placeholder="格式: 留空或regular或80,443,1-1001" /></el-form-item>
                    </el-tooltip>
                  </span>
                  <span v-if="pojo.worktype == 'mass' || pojo.worktype == 'mass2Nmap'">
                    <el-tooltip placement="top">
                      <div slot="content">格式1: <br>格式2:regular<br>格式3:80,443,1-1001<br>格式说明: 为空代表所有端口, regular为nmap默认端口</div>
                      <el-form-item label="端口"><el-input v-model="pojo.targetport" clearable :autosize="{maxRows: 10}" type="textarea" placeholder="格式: 留空或80,443,1-1001" /></el-form-item>
                    </el-tooltip>
                  </span>

                  <span v-if="pojo.worktype == 'nmap'||pojo.worktype == 'nse'">
                    <el-form-item label="选项"><el-input v-model="pojo.additionoption" clearable placeholder="nmap/nse默认-Pn -sV --max-retries=1 --open" /></el-form-item>
                  </span>
                  <span v-if="pojo.worktype == 'mass2Nmap'||pojo.worktype == 'mass'">
                    <el-form-item label="选项"><el-input v-model="pojo.additionoption" clearable placeholder="无默认选项" /></el-form-item>
                  </span>

                  <!-- <el-form-item> -->
                  <span v-if="pojo.worktype && pojo.worktype == 'mass2Nmap'">
                    <el-form inline>
                      <el-form-item label="Nmap配置" size="mini" />
                      <el-form-item label="选项" size="mini"><el-input v-model="nmapPojo.additionoption" placeholder="-Pn -sV --max-retries=1" /></el-form-item>
                      <!-- <i>{{ getNmapConfigByTaskId(pojo.id) }}</i> -->
                      <el-form-item label="线程" size="mini">
                        <el-input-number v-model="nmapPojo.threadnumber" :min="1" placeholder="10" />
                        <!-- <el-input v-model="nmapPojo.threadnumber" style="width:400px;" placeholder="默认10" /> -->
                      </el-form-item>

                      <el-form-item label="ip扫描次数" size="mini">
                        <el-input-number v-model="nmapPojo.singleipscantime" :min="1" placeholder="1" />
                        <!-- <el-input v-model="nmapPojo.singleipscantime" style="width:400px;" placeholder="默认1" /> -->

                      </el-form-item>
                    </el-form>
                  </span>
                  <!-- </el-form-item> -->

                  <el-form-item label="数量" inline>
                    <span v-if="pojo.worktype == 'nse'||pojo.worktype == 'selfd'||pojo.worktype == 'httpp'">
                      <el-tooltip placement="top">
                        <div slot="content">线程数量 : 默认4</div>
                        <el-input-number v-model="pojo.threadnumber" :min="1" size="small" placeholder="线程" />
                        <!-- <el-input v-model="pojo.threadnumber" style="width:110px;" clearable placeholder="线程" /> -->
                      </el-tooltip>
                    </span>
                    <span v-else>
                      <el-tooltip placement="top">
                        <div slot="content">线程数量 : 默认4</div>
                        <el-input-number v-model="pojo.threadnumber" :min="1" size="small" placeholder="线程" />
                        <!-- <el-input v-model="pojo.threadnumber" style="width:110px;" clearable placeholder="线程" /> -->
                      </el-tooltip>

                      <el-tooltip placement="top">
                        <div slot="content">单ip扫描次数 : 默认1</div>
                        <el-input-number v-model="pojo.singleipscantime" :min="1" size="small" placeholder="单ip扫描次数" />
                        <!-- <el-input v-model="pojo.singleipscantime" style="width:130px;" clearable placeholder="单ip扫描次数" /> -->
                      </el-tooltip>

                      <span v-if="pojo.worktype == 'mass2Nmap'||pojo.worktype == 'mass'">
                        <el-tooltip placement="top">
                          <div slot="content">mass扫描速率 : 默认1000</div>
                          <el-input-number v-model="pojo.rate" :min="100" size="small" :step="1000" placeholder="mass速率" />
                          <!-- <el-input v-model="pojo.rate" style="width:130px;" clearable placeholder="mass速率" /> -->
                        </el-tooltip>
                      </span>
                      <span v-if="pojo.targetip !=='unknownPortSerVer'&&pojo.targetip !=='ipAllPort'&&pojo.additionoption !== '-sn'">
                        <el-tooltip placement="top">
                          <div slot="content">ip分组大小 : 默认255</div>
                          <el-input-number v-model="pojo.ipslicesize" :min="1" size="small" placeholder="ip分组大小" />
                          <!-- <el-input v-model="pojo.ipslicesize" style="width:120px;" clearable placeholder="ip分组大小" /> -->
                        </el-tooltip>
                      </span>

                      <!-- 没有端口的ip全端口扫描 端口分组和附加选项-->
                      <!-- ||pojo.worktype == 'ipNoPort'||pojo.worktype == 'unknownPortSerVer' -->
                      <span v-if="pojo.worktype == 'nmap'&&(pojo.targetport == null||pojo.targetport == '')&&pojo.targetip !=='unknownPortSerVer'&&pojo.targetip !=='ipAllPort'">
                        <span v-if="pojo.additionoption == '-sn'" />
                        <span v-else>
                          <el-tooltip placement="top">
                            <div slot="content">端口分组大小 : 默认1000<br>只对nmap全端口模式有效<br>范围：1000-10000<br></div>
                            <el-input-number v-model="pojo.portslicesize" :min="1000" :max="10000" :step="1000" size="small" placeholder="端口分大小" />
                            <!-- <el-input v-model="pojo.portslicesize" style="width:140px;" clearable placeholder="端口分组大小" /> -->
                          </el-tooltip>
                        </span>

                      </span>
                    </span>
                  </el-form-item>

                  <span v-if="(pojo.worktype == 'nmap'||pojo.worktype == 'mass2Nmap'||pojo.worktype == 'mass')&&pojo.targetip !=='unknownPortSerVer'&&pojo.targetip !=='ipAllPort'&&pojo.additionoption !== '-sn'">
                    <el-form-item label="排除ip"><el-input v-model="pojo.excludeip" clearable :autosize="{maxRows: 10}" type="textarea" placeholder="格式:单个ip,ip段,CIDR,举例: 192.168.1.1,192.168.2.1-192.168.2.100,192.168.3.0/24" /></el-form-item>
                  </span>

                  <el-form-item label="Boolean">
                    <el-tooltip placement="top">
                      <div slot="content">默认false<br>cron任务需要手动点开始</div>
                      <el-switch v-model="pojo.crontask" active-text="cron任务" />
                    </el-tooltip>

                    <span v-if="(pojo.worktype == 'nmap'||pojo.worktype == 'mass2Nmap'||pojo.worktype == 'mass')&&pojo.targetip !=='unknownPortSerVer'&&pojo.targetip !=='ipAllPort'&&pojo.targetip !=='ipNoPort'&&pojo.additionoption !== '-sn'">
                      <el-tooltip placement="top">
                        <div slot="content">默认false</div>
                        <el-switch v-model="pojo.dbipisexcludeip" active-text="排除db中ip" />
                      </el-tooltip>
                    </span>

                    <el-tooltip placement="top">
                      <div slot="content">默认true</div>
                      <el-switch v-model="pojo.merge2asset" active-text="结果合并到资产" />
                    </el-tooltip>
                  </el-form-item>

                  <span v-if="pojo.crontask===true">
                    <!-- <el-form-item required="" label="cron表达式">
            <el-input v-model="pojo.cronexpression" clearable style="width:400px;" />
            <el-button type="info" @click="parseCron(pojo.cronexpression)">cron模拟解析</el-button>
            <br> -->
                    <el-form ref="searchform" inline size="small" :model="searchMap">
                      <el-form-item label="cron表达式">
                        <cron-input v-model="cron" clearable style="width:400px;" @change="change" @reset="reset" />
                      </el-form-item>
                      <el-form-item>
                        <el-button type="info" @click="parseCron('')">解析</el-button>
                      </el-form-item>
                      <br>
                      <span v-if="parseList[0]">
                        <el-alert :closable="false" center>
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
                        </el-alert>
                      </span>

                    </el-form>
                  </span>
                  <el-form-item label="描述"><el-input v-model="pojo.description" autosize type="textarea" /></el-form-item>

                  <span v-if="(pojo.worktype == 'nse'||pojo.worktype == 'selfd')||( pojo.worktype == 'nmap'||pojo.worktype == 'mass2Nmap'||pojo.worktype == 'mass')&&pojo.checktype&&pojo.checktype!='httpp'">
                    <el-divider />
                    <span v-if="pojo.id==null">
                      <el-form-item label="插件">
                        <b>保存任务后才能启用插件</b>
                      </el-form-item>
                    </span>
                  </span>

                  <span slot="footer" class="dialog-footer">
                    <!-- <el-button type="info" @click="handleSaveAndStart()">保存并开始</el-button> -->
                    <el-button type="primary" @click="handleSave()">保存</el-button>
                    <el-button @click="closeDialogForm()">关闭</el-button>

                  </span>

                </el-collapse-item>
              </el-collapse>
            </el-form>

            <!-- 新增插件 -->
            <div v-if="checkTask">
              <el-form>
                <span v-if="(pojo.worktype=='nse'||pojo.worktype=='selfd')&&pojo.worktype!=='httpp'&&pojo.worktype!=='nmap'&&pojo.worktype!=='mass'&&pojo.worktype!=='mass2Nmap'">
                  <el-collapse v-model="activePluginNames">
                    <el-collapse-item title="插件(可选配置)">
                      <el-form-item>
                        <span v-if="taskPluginPojoList.length==0">
                          <span><b>当前未选择插件, 默认启用 {{ pojo.worktype }} 类型的所有插件</b></span>
                        </span>

                        <el-form ref="searchform2" inline size="mini" :model="searchMap">

                          <el-form-item prop="name" label="名称">
                            <el-select v-model="searchMap.name" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" style="width:130px;" :remote-method="getNameList" :loading="searchLoading">
                              <el-option v-for="item in pluginnameList" :key="item.id" :label="item.name" :value="item.name" /></el-select>
                          </el-form-item>

                          <el-form-item prop="args" label="参数">
                            <el-select v-model="searchMap.args" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" style="width:130px;" :remote-method="getArgsList" :loading="searchLoading">
                              <el-option v-for="item in argsList" :key="item.id" :label="item.args" :value="item.args" /></el-select>
                          </el-form-item>

                          <el-form-item label="风险">
                            <el-select v-model="searchMap.risk" placeholder="请选择" clearable style="width:90px;">
                              <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-form-item>
                          <span v-if="pojo.checktype">
                            <el-form-item label="类型">
                              <el-radio-group v-model="searchMap.type" size="mini">
                                <el-radio-button label="selfd" />
                                <el-radio-button label="nse" />
                              </el-radio-group>
                            </el-form-item>
                          </span>
                          <!-- <el-form-item label="超时">
        <el-input v-model="searchMap.timeout" prop="timeout" clearable placeholder="超时" /></el-form-item> -->

                          <el-form-item>
                            <el-button type="primary" size="mini" @click="fetchPluginconfigData()">查询</el-button>
                            <el-button type="info" size="mini" @click="resetForm('searchform2')">重置</el-button>

                            <!-- 操作 -->
                            <el-button type="success" size="mini" @click="enableTaskPlugin(pojo.id)">启用</el-button>
                            <el-tooltip placement="top">
                              <div slot="content">不选择插件, 则禁用所有已启用插件</div>
                              <el-button type="danger" size="mini" @click="disablePlugin(pojo.id)">禁用</el-button>
                            </el-tooltip>

                          </el-form-item>
                        </el-form>
                        <!-- 表格数据 -->
                        <el-table
                          ref="multipleTable"
                          :data="pluginconfigList"
                          fit
                          style="width: 100%;"
                          size="medium"
                          @selection-change="handleSelectionChange"
                        >
                          <el-table-column type="selection" align="center" />
                          <el-table-column label="序号" type="index" :index="1" align="center" width="50" />
                          <el-table-column sortable prop="name" label="名称" />
                          <el-table-column sortable prop="args" label="参数" show-overflow-tooltip />
                          <el-table-column sortable prop="risk" label="风险" />
                          <el-table-column sortable prop="type" label="类型" />

                          <el-table-column
                            label="操作"
                            width="140"
                          >
                            <template slot-scope="scope">
                              <span v-if="checkPlugin(scope.row.id)">
                                <el-button type="success" size="mini" @click="enableTaskPluginById(pojo.id,scope.row.id)">启用</el-button>
                              </span>
                              <span v-else>
                                <el-button type="danger" size="mini" @click="handleDeleteTaskPluginById(pojo.id,scope.row.id)">禁用</el-button>
                              </span>

                            </template>
                          </el-table-column>

                        </el-table>

                        <!-- 底部分页 -->
                        <el-pagination
                          :current-page.sync="pluginconfigcurrentPage"
                          :page-sizes="[5,15,20,100,200]"
                          :page-size="pluginconfigpageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="pluginconfigtotal"
                          @size-change="handlePluginconfigSizeChange"
                          @current-change="fetchPluginconfigData"
                        />

                      </el-form-item>
                    </el-collapse-item>
                  </el-collapse>

                </span>
              </el-form>
            </div>

          </span>
        </div>

        <!-- 步骤跳跃 -->
        <el-form label-width="110px">
          <el-form-item>
            <span v-if="active==2 &&(pojo.targetip||assetTargetOrInput)">
              <!-- <el-button type="info" style="margin-top: 12px;" @click="forward">保存并开始</el-button> -->
              <el-button type="primary" style="margin-top: 12px;" @click="handleSave()">保存</el-button>
            </span>

            <span v-if="active==1 &&(pojo.worktype == 'nse'||pojo.worktype == 'selfd')">
              <el-button type="primary" style="margin-top: 12px;" @click="handleSaveCheckTask()">下一步</el-button>
            </span>
            <span v-else>
              <span v-if="active!==2">
                <el-button type="primary" style="margin-top: 12px;" @click="next">下一步</el-button>
              </span>
            </span>
            <span v-if="pojo.worktype !== 'nse'&&pojo.worktype !== 'selfd'">
              <span v-if="active!==0">
                <el-button style="margin-top: 12px;" @click="forward">上一步</el-button>
              </span>
            </span>
          </el-form-item>
        </el-form>
      </el-form>
    </el-dialog>

    <!-- 编辑框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="50%" center :before-close="cleanCache">
      <el-form label-width="110px">

        <!-- <el-form-item label="父任务"><el-input v-model="pojo.taskparentid" /></el-form-item> -->
        <!-- <el-form-item label="父任务">
          <el-select v-model="pojo.taskparentid" style="width:400px;" filterable clearable placeholder="请输入关键词搜索并手动选择">
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->

        <el-form-item prop="projectid" label="任务项目">
          <span>{{ projectName }}</span>
          <el-select v-model="pojo.projectid" style="width:400px;" filterable remote clearable placeholder="请输入关键词搜索并手动选择" :remote-method="getProjectnameList" :loading="searchLoading">
            <el-option v-for="item in projectnameList" :key="item.id" :label="item.name" :value="item.id" /></el-select>

        </el-form-item>

        <!-- <el-form-item label="项目"><el-input v-model="pojo.projectid" /></el-form-item> -->

        <el-form-item required label="名称"><el-input v-model="pojo.name" clearable /></el-form-item>

        <span v-if="pojo.id">
          <el-form-item label="时间">
            <el-date-picker v-model="pojo.starttime" placeholder="开始日期" type="datetime" />
            <el-date-picker v-model="pojo.endtime" placeholder="结束日期" type="datetime" />
          </el-form-item>
        </span>

        <el-form-item required label="类型">
          <span v-if="pojo.id !=null ">
            <span>{{ pojo.worktype }}</span>
          </span>
          <span v-else>
            <!-- <el-input v-model="pojo.worktype"  /> -->
            <el-radio-group v-model="pojo.worktype" size="mini">
              <el-radio-button label="nmap" />
              <el-radio-button label="mass" />
              <el-radio-button label="mass2Nmap" />
              <el-radio-button label="nse" />
              <el-radio-button label="selfd" />
              <el-radio-button label="httpp" />
            </el-radio-group>
          </span>
        </el-form-item>

        <span v-if="pojo.worktype == 'nmap'||pojo.worktype == 'mass2Nmap'||pojo.worktype == 'mass'||pojo.worktype == 'nse'">
          <el-form-item label="选项"><el-input v-model="pojo.additionoption" clearable placeholder="nmap/nse默认-Pn -sV --max-retries=1 --open，mass/mass2Nmap无默认" /></el-form-item>
        </span>

        <!-- <el-form-item> -->
        <span v-if="pojo.worktype && pojo.worktype == 'mass2Nmap'">
          <el-form inline>
            <el-form-item label="Nmap配置" size="mini" />
            <el-form-item label="选项" size="mini"><el-input v-model="nmapPojo.additionoption" placeholder="-Pn -sV --max-retries=1" /></el-form-item>
            <!-- <i>{{ getNmapConfigByTaskId(pojo.id) }}</i> -->
            <el-form-item label="线程" size="mini">
              <el-input-number v-model="nmapPojo.threadnumber" :min="1" placeholder="10" />
              <!-- <el-input v-model="nmapPojo.threadnumber" style="width:400px;" placeholder="默认10" /> -->
            </el-form-item>

            <el-form-item label="ip扫描次数" size="mini">
              <el-input-number v-model="nmapPojo.singleipscantime" :min="1" placeholder="1" />
              <!-- <el-input v-model="nmapPojo.singleipscantime" style="width:400px;" placeholder="默认1" /> -->

            </el-form-item>
          </el-form>
        </span>
        <!-- </el-form-item> -->

        <span v-if="!pojo.taskparentid&&(pojo.worktype == 'nmap'||pojo.worktype == 'mass2Nmap')&&(pojo.starttime!=null&&pojo.endtime!=null)&&pojo.additionoption !== '-sn'">
          <el-form-item label="检测" inline>
            <el-tooltip placement="top">
              <div slot="content">保存后再重新编辑, 才能配置插件</div>
              <el-checkbox-group v-model="checkedChecktypes" size="mini">
                <el-checkbox-button v-for="check in checks" :key="check" :label="check" />
              </el-checkbox-group>
            </el-tooltip>

          </el-form-item></span>

        <el-form-item label="数量" inline>
          <span v-if="pojo.worktype == 'nse'||pojo.worktype == 'selfd'||pojo.worktype == 'httpp'">
            <el-tooltip placement="top">
              <div slot="content">线程数量 : 默认4</div>
              <el-input-number v-model="pojo.threadnumber" :min="1" size="small" placeholder="线程" />
              <!-- <el-input v-model="pojo.threadnumber" style="width:110px;" clearable placeholder="线程" /> -->
            </el-tooltip>
          </span>
          <span v-else>
            <el-tooltip placement="top">
              <div slot="content">线程数量 : 默认4</div>
              <el-input-number v-model="pojo.threadnumber" :min="1" size="small" placeholder="线程" />
              <!-- <el-input v-model="pojo.threadnumber" style="width:110px;" clearable placeholder="线程" /> -->
            </el-tooltip>

            <el-tooltip placement="top">
              <div slot="content">单ip扫描次数 : 默认1</div>
              <el-input-number v-model="pojo.singleipscantime" :min="1" size="small" placeholder="单ip扫描次数" />
              <!-- <el-input v-model="pojo.singleipscantime" style="width:130px;" clearable placeholder="单ip扫描次数" /> -->
            </el-tooltip>

            <span v-if="pojo.worktype == 'mass2Nmap'||pojo.worktype == 'mass'">
              <el-tooltip placement="top">
                <div slot="content">mass扫描速率 : 默认1000</div>
                <el-input-number v-model="pojo.rate" :min="100" size="small" :step="1000" placeholder="mass速率" />
                <!-- <el-input v-model="pojo.rate" style="width:130px;" clearable placeholder="mass速率" /> -->
              </el-tooltip>
            </span>
            <span v-if="pojo.targetip !=='unknownPortSerVer'&&pojo.targetip !=='ipAllPort'&&pojo.additionoption !== '-sn'">
              <el-tooltip placement="top">
                <div slot="content">ip分组大小 : 默认255</div>
                <el-input-number v-model="pojo.ipslicesize" :min="1" size="small" placeholder="ip分组大小" />
                <!-- <el-input v-model="pojo.ipslicesize" style="width:120px;" clearable placeholder="ip分组大小" /> -->
              </el-tooltip>
            </span>

            <!-- 没有端口的ip全端口扫描 端口分组和附加选项-->
            <!-- ||pojo.worktype == 'ipNoPort'||pojo.worktype == 'unknownPortSerVer' -->
            <span v-if="pojo.worktype == 'nmap'&&(pojo.targetport == null||pojo.targetport == '')&&pojo.targetip !=='unknownPortSerVer'&&pojo.targetip !=='ipAllPort'">
              <span v-if="pojo.additionoption == '-sn'" />
              <span v-else>
                <el-tooltip placement="top">
                  <div slot="content">端口分组大小 : 默认1000<br>只对nmap全端口模式有效<br>范围：1000-10000<br></div>
                  <el-input-number v-model="pojo.portslicesize" :min="1000" :max="10000" :step="1000" size="small" placeholder="端口分大小" />
                <!-- <el-input v-model="pojo.portslicesize" style="width:140px;" clearable placeholder="端口分组大小" /> -->
                </el-tooltip>
              </span>

            </span>
          </span>
        </el-form-item>

        <span v-if="pojo.worktype == 'nse'||pojo.worktype == 'selfd'||pojo.worktype == 'httpp'">
          <span v-if="pojo.taskparentid">
            <el-form-item required label="目标">
              <span>{{ pojo.targetip }}</span>
            </el-form-item>
          </span>
          <span v-else>
            <el-form-item required label="目标">
              <el-radio-group v-model="pojo.targetip" size="mini">
                <el-radio-button label="assetip" />
              </el-radio-group>
            </el-form-item>
          </span>
        </span>
        <span v-else>
          <el-tooltip placement="top">
            <div slot="content">格式1: assetip或ipNoPort或unknownPortSerVer或ipAllPort或者域名<br>格式2:192.168.1.1,192.168.2.1-192.168.2.100,192.168.3.0/24<br>格式3:nmap.org
              <br>格式说明: assetip代表数据库中所有未下线的ip, 仅在nse/selfd/httpp模式下生效<br>如果是assetip或ipNoPort或unknownPortSerVer或ipAllPort, 则不能再配置具体ip
              <br>ipNoPort及unknownPortSerVer说明见下方
              <br>域名(仅nmap类型可用)和ip不能混在一起
            </div>
            <el-form-item required label="目标">
              <el-input v-model="pojo.targetip" clearable :autosize="{maxRows: 10}" type="textarea" placeholder="格式:assetip或单个ip,ip段,CIDR或域名, 举例: assetip或192.168.1.1,192.168.2.1-192.168.2.100,192.168.3.0/24,nmap.org" />
            </el-form-item>
          </el-tooltip>

          <span v-if="pojo.worktype == 'nmap'&&(pojo.targetip == null||pojo.targetip == '')&&pojo.additionoption!==''&&pojo.additionoption !== '-sn'">
            <el-form-item required label="目标">
              <el-radio-group v-model="pojo.targetip" size="mini">
                <el-tooltip placement="top">
                  <div slot="content">数据库中所有没有端口且未下线的ip</div>
                  <el-radio-button label="ipNoPort" />
                </el-tooltip>

                <el-tooltip placement="top">
                  <div slot="content">更新<br>端口service [为空, null, tcpwrapped, unknown, 包含?] 的ip<br>端口version [为空, null] 的ip<br>的service和version</div>
                  <el-radio-button label="unknownPortSerVer" />
                </el-tooltip>

                <el-tooltip placement="top">
                  <div slot="content">更新资产库所有ip的端口信息</div>
                  <el-radio-button label="ipAllPort" />
                </el-tooltip>
              </el-radio-group>

            </el-form-item>
          </span>
        </span>

        <span v-if="pojo.worktype == 'nmap'&&(pojo.portslicesize == null||pojo.portslicesize == '')&&pojo.targetip !=='unknownPortSerVer'&&pojo.targetip !=='ipAllPort'&&pojo.additionoption !== '-sn'">
          <el-tooltip placement="top">
            <div slot="content">格式1: <br>格式2:regular<br>格式3:80,443,1-1001<br>格式说明: 为空代表所有端口, regular为nmap默认端口</div>
            <el-form-item required label="端口"><el-input v-model="pojo.targetport" clearable :autosize="{maxRows: 10}" type="textarea" placeholder="格式: 留空或regular或80,443,1-1001" /></el-form-item>
          </el-tooltip>
        </span>
        <!-- <span v-if="pojo.worktype == 'nmap'&&pojo.id ">
          <el-tooltip placement="top">
            <div slot="content">格式1: <br>格式2:regular<br>格式3:80,443,1-1001<br>格式说明: 为空代表所有端口, regular为nmap默认端口</div>
            <el-form-item label="端口"><el-input v-model="pojo.targetport" clearable :autosize="{maxRows: 10}" type="textarea" placeholder="格式: 留空或regular或80,443,1-1001" /></el-form-item>
          </el-tooltip>
        </span> -->
        <span v-if="pojo.worktype == 'mass' || pojo.worktype == 'mass2Nmap'">
          <el-tooltip placement="top">
            <div slot="content">格式1: <br>格式2:regular<br>格式3:80,443,1-1001<br>格式说明: 为空代表所有端口, regular为nmap默认端口</div>
            <el-form-item required label="端口"><el-input v-model="pojo.targetport" clearable :autosize="{maxRows: 10}" type="textarea" placeholder="格式: 留空或regular或80,443,1-1001" /></el-form-item>
          </el-tooltip>
        </span>

        <span v-if="(pojo.worktype == 'nmap'||pojo.worktype == 'mass2Nmap'||pojo.worktype == 'mass')&&pojo.targetip !=='unknownPortSerVer'&&pojo.targetip !=='ipAllPort'&&pojo.additionoption !== '-sn'">
          <el-form-item label="排除ip"><el-input v-model="pojo.excludeip" clearable :autosize="{maxRows: 10}" type="textarea" placeholder="格式:单个ip,ip段,CIDR,举例: 192.168.1.1,192.168.2.1-192.168.2.100,192.168.3.0/24" /></el-form-item>
        </span>

        <el-form-item label="Boolean">
          <el-tooltip placement="top">
            <div slot="content">默认false<br>cron任务需要手动点开始</div>
            <el-switch v-model="pojo.crontask" active-text="cron任务" />
          </el-tooltip>

          <span v-if="(pojo.worktype == 'nmap'||pojo.worktype == 'mass2Nmap'||pojo.worktype == 'mass')&&pojo.targetip !=='unknownPortSerVer'&&pojo.targetip !=='ipAllPort'&&pojo.targetip !=='ipNoPort'&&pojo.additionoption !== '-sn'">
            <el-tooltip placement="top">
              <div slot="content">默认false</div>
              <el-switch v-model="pojo.dbipisexcludeip" active-text="排除db中ip" />
            </el-tooltip>
          </span>

          <el-tooltip placement="top">
            <div slot="content">默认true</div>
            <el-switch v-model="pojo.merge2asset" active-text="结果合并到资产" />
          </el-tooltip>
        </el-form-item>

        <span v-if="pojo.crontask===true">
          <!-- <el-form-item required="" label="cron表达式">
            <el-input v-model="pojo.cronexpression" clearable style="width:400px;" />
            <el-button type="info" @click="parseCron(pojo.cronexpression)">cron模拟解析</el-button>
            <br> -->
          <el-form ref="searchform" inline size="small" :model="searchMap">
            <el-form-item label="cron表达式">
              <cron-input v-model="cron" clearable style="width:400px;" @change="change" @reset="reset" />
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="parseCron('')">解析</el-button>
            </el-form-item>
            <br>
            <span v-if="parseList[0]">
              <el-alert :closable="false" center>
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
              </el-alert>
            </span>

          </el-form>
        </span>
        <el-form-item label="描述"><el-input v-model="pojo.description" autosize type="textarea" /></el-form-item>

        <span v-if="(pojo.worktype == 'nse'||pojo.worktype == 'selfd')||( pojo.worktype == 'nmap'||pojo.worktype == 'mass2Nmap'||pojo.worktype == 'mass')&&pojo.checktype&&pojo.checktype!='httpp'">
          <el-divider />
          <span v-if="pojo.id==null">
            <el-form-item label="插件">
              <b>保存任务后才能启用插件</b>
            </el-form-item>
          </span>

          <span v-if="pojo.id&&(!pojo.taskparentid||!pojo.checktype)">
            <el-form-item label="插件">
              <span v-if="taskPluginPojoList.length==0">
                <span v-if="pojo.checktype">
                  <span><b>当前未选择插件, 默认启用 {{ pojo.checktype.replace(',httpp','').replace('httpp,','') }} 类型的所有插件</b></span>
                </span>
                <span v-else>
                  <span><b>当前未选择插件, 默认启用 {{ pojo.worktype }} 类型的所有插件</b></span>
                </span>
              </span>

              <!-- <div> <pluginconfigsingleintask /> </div> -->
              <el-form ref="searchform2" inline size="mini" :model="searchMap">
                <!-- <el-form-item label="名称">
        <el-input v-model="searchMap.name" prop="name" clearable placeholder="名称" /></el-form-item> -->

                <el-form-item prop="name" label="名称">
                  <el-select v-model="searchMap.name" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" style="width:130px;" :remote-method="getNameList" :loading="searchLoading">
                    <el-option v-for="item in pluginnameList" :key="item.id" :label="item.name" :value="item.name" /></el-select>
                </el-form-item>

                <el-form-item prop="args" label="参数">
                  <el-select v-model="searchMap.args" filterable remote allow-create default-first-option clearable placeholder="请输入关键词搜索并手动选择" style="width:130px;" :remote-method="getArgsList" :loading="searchLoading">
                    <el-option v-for="item in argsList" :key="item.id" :label="item.args" :value="item.args" /></el-select>
                </el-form-item>

                <el-form-item label="风险">
                  <el-select v-model="searchMap.risk" placeholder="请选择" clearable style="width:90px;">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <span v-if="pojo.checktype">
                  <el-form-item label="类型">
                    <el-radio-group v-model="searchMap.type" size="mini">
                      <el-radio-button label="selfd" />
                      <el-radio-button label="nse" />
                    </el-radio-group>
                  </el-form-item>
                </span>
                <!-- <el-form-item label="超时">
        <el-input v-model="searchMap.timeout" prop="timeout" clearable placeholder="超时" /></el-form-item> -->

                <el-form-item>
                  <el-button type="primary" size="mini" @click="fetchPluginconfigData()">查询</el-button>
                  <el-button type="info" size="mini" @click="resetForm('searchform2')">重置</el-button>

                  <!-- 操作 -->
                  <el-button type="success" size="mini" @click="enablePlugin(pojo.id)">启用</el-button>
                  <el-tooltip placement="top">
                    <div slot="content">不选择插件, 则禁用所有已启用插件</div>
                    <el-button type="danger" size="mini" @click="disablePlugin(pojo.id)">禁用</el-button>
                  </el-tooltip>

                </el-form-item>
              </el-form>
              <!-- 表格数据 -->
              <el-table
                ref="multipleTable"
                :data="pluginconfigList"
                fit
                style="width: 100%;"
                size="medium"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" align="center" />
                <el-table-column label="序号" type="index" :index="1" align="center" width="50" />
                <!-- <el-table-column sortable prop="id" label="插件配置编号" /> -->
                <el-table-column sortable prop="name" label="名称" />
                <el-table-column sortable prop="args" label="参数" show-overflow-tooltip />
                <el-table-column sortable prop="risk" label="风险" />
                <el-table-column sortable prop="type" label="类型" />
                <!-- <el-table-column sortable prop="timeout" label="超时(毫秒)" /> -->

                <el-table-column
                  label="操作"
                  width="140"
                >
                  <template slot-scope="scope">
                    <span v-if="checkPlugin(scope.row.id)">
                      <el-button type="success" size="mini" @click="enablePluginById(pojo.id,scope.row.id)">启用</el-button>
                    </span>
                    <span v-else>
                      <el-button type="danger" size="mini" @click="handleDeleteTaskPluginById(pojo.id,scope.row.id)">禁用</el-button>
                    </span>

                  </template>
                </el-table-column>

              </el-table>

              <!-- 底部分页 -->
              <el-pagination
                :current-page.sync="pluginconfigcurrentPage"
                :page-sizes="[5,15,20,100,200]"
                :page-size="pluginconfigpageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pluginconfigtotal"
                @size-change="handlePluginconfigSizeChange"
                @current-change="fetchPluginconfigData"
              />

            </el-form-item>
          </span>
        </span>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="info" @click="handleSaveAndStart()">保存并开始</el-button> -->
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="closeDialogForm()">关闭</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
import taskApi from '@/api/task'
import projectApi from '@/api/project'
import nmapconfigApi from '@/api/nmapconfig'
// import pluginconfigsingleintask from '@/views/table/pluginconfigsingleintask'
import taskpluginconfigApi from '@/api/taskpluginconfig'
import pluginconfigApi from '@/api/pluginconfig'
import cronjobApi from '@/api/cronjob'
import CronInput from 'vue-cron-generator/src/components/cron-input'
import { DEFAULT_CRON_EXPRESSION } from 'vue-cron-generator/src/constant/filed'

import Vue from 'vue'

const dateformat = Vue.filter('dateformat')
const checkOptions = ['nse', 'selfd', 'httpp']

export default {
  components: {
    CronInput
  },
  filters: {
    showProgressColor(percentage) {
      if (percentage > 0 && percentage < 100) {
        return 'el-bg-inner-running'
      } else if (percentage === 100) {
        return 'el-bg-inner-done'
      } else {
        return 'el-bg-inner-error'
      }
    }
  },
  // components: {
  //   pluginconfigsingleintask
  // },

  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      searchMap: {}, // 查询条件
      dialogFormVisible: false, // 编辑窗口是否可见
      newTaskDialogFormVisible: false, // 编辑窗口是否可见
      taskTypeDialogFormVisible: false,
      pojo: {}, // 编辑表单绑定的实体对象
      id: '', // 当前用户修改的ID
      searchLoading: false,
      filename: '',
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      checkedChecktypes: [],
      checks: checkOptions,

      projectnameList: [],
      nameList: [],
      worktypeList: [],
      checktypeList: [],
      additionoptionList: [],
      targetipList: [],
      targetportList: [],
      excludeipList: [],
      nmapPojo: {}, // nmap配置

      taskPluginPojoList: [],
      pluginconfigList: [],
      pluginconfigtotal: 0, // 总记录数
      pluginconfigcurrentPage: 1, // 当前页
      pluginconfigpageSize: 5, // 每页大小
      taskPluginList: [],
      argsList: [],
      pluginnameList: [],
      temptaskid: '',

      activeNames: ['1'],
      activePluginNames: ['1'],

      drawer: false,
      childActiveNames: ['1'],
      childList: [],
      childListLoading: true,
      childCurrentPage: 1,
      childPageSize: 10,
      childTotal: 0,
      childMultipleSelection: [],
      childSearchMap: {}, // 查询条件

      percentage: '',
      showChildTask: false,
      childTaskids: [],
      timer: null,
      projectName: '',
      showparent: false,
      showcronexp: false,
      showcron: false,
      showcheck: false,
      showthreadn: false,
      showipn: false,
      showadditionoption: false,
      showrate: false,
      showexcludeip: false,
      showipslicesize: false,
      showportsize: false,
      showexcludedbip: false,
      showmerge2asset: false,
      showproject: false,

      parseList: [],
      cronMap: {},
      cron: '0 0 12 * * ?',

      options: [{
        value: '信息',
        label: '信息'
      }, {
        value: '低危',
        label: '低危'
      }, {
        value: '中危',
        label: '中危'
      }, {
        value: '高危',
        label: '高危'
      }, {
        value: '严重',
        label: '严重'
      }, {
        value: '致命',
        label: '致命'
      }],
      value: '',
      targetType: '',
      taskType: '',
      assetTargetOrInput: '',
      active: 0,
      checkTask: false,

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

  mounted() {
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      if (this.$route.path === '/project/task') {
        this.timer = setInterval(() => {
          this.fetchData()
          if (this.id) {
            this.childFetchData()
          }
        }, 30000)
      }
    }
    // window.addEventListener('focus', () => {
    //   if (this.timer) {
    //     clearInterval(this.timer)
    //   } else {
    //     if (this.$route.path === '/project/task') {
    //       this.timer = setInterval(() => {
    //         this.fetchData()
    //         if (this.id) {
    //           this.childFetchData()
    //         }
    //       }, 5000)
    //     }
    //   }
    // }, true)
    // window.addEventListener('blur', () => {
    //   clearInterval(this.timer)
    //   this.timer = null
    // }, true)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    enableTaskPluginById(taskId, pluginId) {
      const tempList = []
      tempList.push(taskId)
      tempList.push(pluginId)
      taskpluginconfigApi.addAllByIds(tempList).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) {
          this.taskPluginList = []
          this.handleEditCheckTask(taskId)
        }
      })
    },
    enableTaskPlugin(id) {
      if (this.multipleSelection && this.multipleSelection.length) {
        const tempList = []
        tempList.push(id)
        for (let i = 0; i < this.multipleSelection.length; i++) {
          tempList.push(this.multipleSelection[i].id)
        }
        taskpluginconfigApi.addAllByIds(tempList).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) {
            this.taskPluginList = []
            this.handleEditCheckTask(id)
          }
        })
        this.$refs.multipleTable.clearSelection()
      } else {
        this.$message({
          message: '^_^至少选择一条记录哦~',
          type: 'info'
        })
      }
    },
    handleEditCheckTask(id) {
      taskApi.findById(id).then(response => {
        if (response.flag) {
          this.pojo = response.data
          this.fetchPluginconfigData()
          // 获取插件id
          taskpluginconfigApi.findAllByTaskid(id).then(response => {
            if (response.flag) {
              this.taskPluginList = response.data
              this.taskPluginPojoList = response.data
            }
          })
          if (this.pojo.projectid) {
            projectApi.findById(this.pojo.projectid).then(response => {
              if (response.flag) {
                this.projectName = response.data.name
              }
            })
          }
        }
      })
    },
    handleSaveCheckTask() {
      if (this.pojo.crontask) {
        this.pojo.cronexpression = this.cron
      }
      // 新增插件
      this.pojo.targetip = 'assetip'
      taskApi.update(this.id, this.pojo).then(response => {
        if (this.pojo.worktype === 'selfd' || this.pojo.worktype === 'nse') {
          if (this.id === '') {
            taskApi.findById(response.data).then(response => {
              if (response.flag) {
                this.pojo = response.data
              }
            })
            this.handleEditCheckTask(response.data)
            this.checkTask = true
          }
        }
      })
      this.active++
    },
    closeNewTaskDialogForm() {
      this.newTaskDialogFormVisible = false
      this.active = 0
      this.taskType = ''
      this.targetType = ''
      this.assetTargetOrInput = ''
    },
    forward() {
      // this.active--
      if (this.active-- < 0) this.active = 2
    },
    next() {
      // this.active++
      if (this.active++ > 2) this.active = 0
    },
    handleSaveAndStart() {
      if (this.pojo.id) {
        if (this.pojo.worktype === 'nmap' || this.pojo.worktype === 'mass' || this.pojo.worktype === 'mass2Nmap') {
          this.executeTask(this.pojo.id)
        }
        if (this.pojo.checktype === 'nse' || this.pojo.checktype === 'selfd' || this.pojo.checktype === 'htpp') {
          this.executeCheck(this.pojo.id)
        }
      }
      this.closeDialogForm()
    },
    change(cron) {
      this.cron = cron
    },
    reset(cron) {
      this.cron = DEFAULT_CRON_EXPRESSION
    },
    parseCron(exp) {
      if (exp !== null && exp !== '') {
        this.cronMap = { 'cronExpression': exp }
      } else {
        this.cronMap = { 'cronExpression': this.cron }
      }

      cronjobApi.parse(this.cronMap).then(response => {
        this.parseList = response.data
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
      }).catch(() => {
        this.parseList = []
      })
    },
    showHide(para) {
      if (para === 'showproject') {
        this.showproject = !this.showproject
      }
      if (para === 'showparent') {
        this.showparent = !this.showparent
      }
      if (para === 'showcronexp') {
        this.showcronexp = !this.showcronexp
      }
      if (para === 'showcron') {
        this.showcron = !this.showcron
      }
      if (para === 'showcheck') {
        this.showcheck = !this.showcheck
      }
      if (para === 'showthreadn') {
        this.showthreadn = !this.showthreadn
      }
      if (para === 'showipn') {
        this.showipn = !this.showipn
      }
      if (para === 'showrate') {
        this.showrate = !this.showrate
      }
      if (para === 'showexcludeip') {
        this.showexcludeip = !this.showexcludeip
      }
      if (para === 'showipslicesize') {
        this.showipslicesize = !this.showipslicesize
      }
      if (para === 'showportsize') {
        this.showportsize = !this.showportsize
      }
      if (para === 'showexcludedbip') {
        this.showexcludedbip = !this.showexcludedbip
      }
      if (para === 'showmerge2asset') {
        this.showmerge2asset = !this.showmerge2asset
      }
    },
    getTaskStatusPercent(id) {
      taskApi.getTaskStatusPercent(id).then(response => {
        this.percentage = parseInt(response.data)
        this.$notify({
          message: response.data,
          type: (response.flag ? 'success' : 'error'),
          duration: 5000
        })
        if (response.flag) {
          this.fetchData()
        }
      })
    },
    getChildTaskStatusPercent(id) {
      taskApi.getTaskStatusPercent(id).then(response => {
        this.percentage = parseInt(response.data)
        this.$notify({
          message: response.data,
          type: (response.flag ? 'success' : 'error'),
          duration: 5000
        })
        if (response.flag) {
          this.childFetchData()
        }
      })
    },
    handleDrawerClose() {
      this.drawer = false
      this.childPageSize = 10
      this.childCurrentPage = 1
      this.childMultipleSelection = []
      this.childSearchMap = {}
      this.childList = []
    },
    handleDrawer(id) {
      this.id = id
      this.drawer = true
      this.childFetchData()
    },
    childFetchData() {
      this.childSearchMap.taskparentid = this.id
      taskApi.search(this.childCurrentPage, this.childPageSize, this.childSearchMap).then(response => {
        this.childList = response.data.rows
        this.childTotal = response.data.total
      })
      this.childListLoading = false
    },
    handleDeleteTaskPluginById(taskId, pluginId) {
      const tempList = []
      tempList.push(taskId)
      tempList.push(pluginId)
      taskpluginconfigApi.deleteAllIds(tempList).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) {
          this.taskPluginList = []
          this.handleEdit(this.id)
        }
      })
    },
    enablePluginById(taskId, pluginId) {
      const tempList = []
      tempList.push(taskId)
      tempList.push(pluginId)
      taskpluginconfigApi.addAllByIds(tempList).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) {
          this.taskPluginList = []
          this.handleEdit(this.id)
        }
      })
    },
    checkPlugin(id) {
      return this.taskPluginList.indexOf(id) === -1
    },
    fetchPluginconfigData() {
      if (!this.pojo.checktype) {
        this.searchMap.type = this.pojo.worktype
      }
      pluginconfigApi.search(this.pluginconfigcurrentPage, this.pluginconfigpageSize, this.searchMap).then(response => {
        this.pluginconfigList = response.data.rows
        this.pluginconfigtotal = response.data.total
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
            this.pluginnameList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.pluginnameList = []
      }
    },

    enablePlugin(id) {
      if (this.multipleSelection && this.multipleSelection.length) {
        const tempList = []
        tempList.push(id)
        for (let i = 0; i < this.multipleSelection.length; i++) {
          tempList.push(this.multipleSelection[i].id)
        }
        taskpluginconfigApi.addAllByIds(tempList).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) {
            this.taskPluginList = []
            this.handleEdit(this.id)
          }
        })
        this.$refs.multipleTable.clearSelection()
      } else {
        this.$message({
          message: '^_^至少选择一条记录哦~',
          type: 'info'
        })
      }
    },
    disablePlugin(id) {
      this.$confirm('此操作将禁用已选插件, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        if (this.multipleSelection && this.multipleSelection.length) {
          const tempList = []
          tempList.push(id)
          for (let i = 0; i < this.multipleSelection.length; i++) {
            tempList.push(this.multipleSelection[i].id)
          }
          taskpluginconfigApi.deleteAllIds(tempList).then(response => {
            this.$message({
              message: response.message,
              type: (response.flag ? 'success' : 'error')
            })
            if (response.flag) {
              this.taskPluginList = []
              this.handleEdit(this.id)
            }
          })
          this.$refs.multipleTable.clearSelection()
        } else {
        // 禁用所有插件
          taskpluginconfigApi.deleteAllByTaskId(id).then(response => {
            this.$message({
              message: response.message,
              type: (response.flag ? 'success' : 'error')
            })
            if (response.flag) {
              this.taskPluginList = []
              this.handleEdit(this.id)
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleDeleteTaskPlugin(id) {
      this.$confirm('此操作将禁用已选插件, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        taskpluginconfigApi.deleteById(id).then(response => {
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
    cleanCache() {
      this.closeDialogForm()
    },
    getNmapConfigByTaskId(id) {
      if (id !== '') { // 修改
        nmapconfigApi.findByTaskId(id).then(response => {
          if (response.flag) {
            this.nmapPojo = response.data
          }
        })
      } else {
        this.nmapPojo = {} // 清空数据
      }
    },
    executeTask(id) {
      taskApi.executeTask(id).then(response => {
        this.$notify({
          message: response.data,
          type: (response.flag ? 'success' : 'error'),
          duration: 5000
        })
        if (response.flag) {
          this.childFetchData()
          this.fetchData() // 刷新数据
        }
      })
    },
    executeCheck(id) {
      taskApi.executeCheck(id).then(response => {
        this.$notify({
          message: response.data,
          type: (response.flag ? 'success' : 'error'),
          duration: 5000
        })
        if (response.flag) {
          this.childFetchData()
          this.fetchData() // 刷新数据
        }
      })
    },
    stopTask(id) {
      this.$confirm('此操作将停止任务并删除cron任务(如果有子任务, 子任务也会被停止), 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        taskApi.stopTask(id).then(response => {
          this.$notify({
            message: response.data,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
          if (response.flag) {
            this.childFetchData()
            this.fetchData() // 刷新数据
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    repeatTask(id) {
      this.$confirm('此操作将开启一个子任务, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        taskApi.repeatTask(id).then(response => {
          this.$notify({
            message: response.data,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
          if (response.flag) {
            this.childFetchData()
            this.fetchData() // 刷新数据
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    stopScheduleTask(id) {
      this.$confirm('此操作仅删除计划任务, 但不会停止当前正在执行的任务, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        taskApi.stopScheduleTask(id).then(response => {
          this.$notify({
            message: response.data,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
          if (response.flag) {
            this.childFetchData()
            this.fetchData() // 刷新数据
          }
        })
      })
    },
    getTaskStatus(id) {
      taskApi.getTaskStatus(id).then(response => {
        this.$notify({
          message: response.data,
          type: (response.flag ? 'success' : 'error'),
          duration: 5000
        })
        if (response.flag) {
          this.childFetchData()
          this.fetchData() // 刷新数据
        }
      })
    },
    getTaskNameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          taskApi.search(1, 10, { 'name': query }).then(response => {
            this.nameList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.nameList = []
      }
    },
    getWorktypeList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          taskApi.search(1, 10, { 'worktype': query }).then(response => {
            this.worktypeList = response.data.rows.filter(item => {
              return item.worktype.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.worktypeList = []
      }
    },
    getChecktypeList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          taskApi.search(1, 10, { 'checktype': query }).then(response => {
            this.checktypeList = response.data.rows.filter(item => {
              return item.checktype.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.checktypeList = []
      }
    },
    getAdditionoptionList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          taskApi.search(1, 10, { 'additionoption': query }).then(response => {
            this.additionoptionList = response.data.rows.filter(item => {
              return item.additionoption.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.additionoptionList = []
      }
    },
    getTargetipList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          taskApi.search(1, 10, { 'targetip': query }).then(response => {
            this.targetipList = response.data.rows.filter(item => {
              return item.targetip.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.ipaddrtargetipListessv6List = []
      }
    },
    getTargetportList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          taskApi.search(1, 10, { 'targetport': query }).then(response => {
            this.targetportList = response.data.rows.filter(item => {
              return item.targetport.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.targetportList = []
      }
    },
    getExcludeipList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          taskApi.search(1, 10, { 'excludeip': query }).then(response => {
            this.excludeipList = response.data.rows.filter(item => {
              return item.excludeip.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.excludeipList = []
      }
    },
    getProjectnameList(query) {
      if (query !== '' && query) {
        this.searchLoading = true
        setTimeout(() => {
          this.searchLoading = false
          projectApi.search(1, 10, { 'name': query }).then(response => {
            this.projectnameList = response.data.rows.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.projectnameList = []
      }
    },

    handleCheckedChange(value) {
      return value
    },
    closeDialogForm() {
      this.dialogFormVisible = false
      this.searchMap = {}
      this.nameList = []
      this.worktypeList = []
      this.checktypeList = []
      this.additionoptionList = []
      this.targetipList = []
      this.targetportList = []
      this.excludeipList = []
      this.pluginnameList = []
      this.argsList = []
      this.pluginconfigpageSize = 5
      this.pluginconfigcurrentPage = 1
      this.checkedChecktypes = []
      this.taskPluginList = []
      this.projectnameList = []
      this.projectName = ''
      this.parseList = []
      this.taskPluginPojoList = []
      this.closeNewTaskDialogForm()
      this.cron = '0 0 12 * * ?'
    },
    childHandleDeleteAll() {
      if (this.childMultipleSelection && this.childMultipleSelection.length) {
        this.$confirm('此操作将永久删除已选记录, 包括任务插件配置, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const ids = []
          for (let i = 0; i < this.childMultipleSelection.length; i++) {
            ids.push(this.childMultipleSelection[i].id)
          }
          taskApi.deleteAllByIds(ids).then(response => {
            this.$message({
              message: response.message,
              type: (response.flag ? 'success' : 'error')
            })
            if (response.flag) {
              this.childFetchData() // 刷新数据
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
    handleDeleteAll() {
      if (this.multipleSelection && this.multipleSelection.length) {
        this.$confirm('此操作将永久删除已选记录, 包括 [任务插件配置,子任务] 是否继续? 注意: 删除任务并不会停止当前任务，请确保已停止当前任务', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const ids = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id)
          }
          taskApi.deleteAllByIds(ids).then(response => {
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
    childHandleSelectionChange(val) {
      this.childMultipleSelection = val
    },
    handleDownload() {
      if (this.multipleSelection && this.multipleSelection.length) {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '父任务',
            '任务项目',
            '名称',
            'cron表达式',
            'cron',
            '开始',
            '结束',
            '类型',
            '检测',
            '线程',
            'ip扫描次数',
            '选项',
            '速率',
            '目标',
            '端口',
            '排除ip',
            'ip分组',
            '端口分组',
            '排除db中ip',
            '结果合并到资产',
            '描述'

          ]
          const filterVal = [
            'taskparentid',
            'projectid',
            'name',
            'cronexpression',
            'crontask',
            'starttime',
            'endtime',
            'worktype',
            'checktype',
            'threadnumber',
            'singleipscantime',
            'additionoption',
            'rate',
            'targetip',
            'targetport',
            'excludeip',
            'ipslicesize',
            'portslicesize',
            'dbipisexcludeip',
            'merge2asset',
            'description'

          ]
          const list = this.multipleSelection

          for (let i = 0; i < list.length; i++) {
            list[i].crontask = list[i].crontask ? '是' : ''
            list[i].dbipisexcludeip = list[i].dbipisexcludeip ? '是' : ''
            list[i].merge2asset = list[i].merge2asset ? '是' : ''
            list[i].starttime = dateformat(list[i].starttime)
            list[i].endtime = dateformat(list[i].endtime)
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
      this.childSearchMap = {}
      this.nameList = []
      this.worktypeList = []
      this.checktypeList = []
      this.additionoptionList = []
      this.targetipList = []
      this.targetportList = []
      this.excludeipList = []
      this.pluginnameList = []
      this.argsList = []
      this.projectnameList = []
      this.showChildTask = false
      this.showparent = false
      this.showproject = false
      this.showcronexp = false
      this.showcron = false
      this.showcheck = false
      this.showthreadn = false
      this.showipn = false
      this.showrate = false
      this.showadditionoption = false
      this.showexcludeip = false
      this.showipslicesize = false
      this.showportsize = false
      this.showexcludedbip = false
      this.showmerge2asset = false
      this.$message({
        message: '已清空搜索条件',
        type: 'info'
      })
    },
    handlePluginconfigSizeChange(val) {
      this.pluginconfigpageSize = val
      this.fetchPluginconfigData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    childHandleSizeChange(val) {
      this.childPageSize = val
      this.childFetchData()
    },
    formatBoolean(cellValue) {
      return cellValue ? '是' : ''
    },
    fetchData() {
      this.listLoading = true
      if (!this.showChildTask) {
        this.searchMap.taskparentid = 'notall'
      } else {
        this.searchMap.taskparentid = this.searchMap.id
      }
      taskApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
      this.listLoading = false
    },
    handleSave() {
      if (this.pojo.crontask) {
        this.pojo.cronexpression = this.cron
      }

      if ((this.pojo.worktype === 'nmap' || this.pojo.worktype === 'mass2Nmap') && (this.pojo.starttime != null && this.pojo.endtime != null)) {
        if (this.checkedChecktypes && this.checkedChecktypes.length !== 0) {
          this.pojo.checktype = this.checkedChecktypes.join(',')
        } else {
          this.pojo.checktype = null
        }
      }
      taskApi.update(this.id, this.pojo).then(response => {
        if (this.pojo.worktype === 'mass2Nmap' || this.pojo.worktype === 'selfd' || this.pojo.worktype === 'nse') {
          if (this.id === '') {
            this.nmapPojo.taskid = response.data
            this.temptaskid = response.data
          } else {
            this.nmapPojo.taskid = this.id
            this.temptaskid = this.id
          }
          if (this.pojo.worktype === 'mass2Nmap') {
            nmapconfigApi.updateByTaskId('', this.nmapPojo)
            this.nmapPojo = {}
          }
        }
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) { // 如果成功
          this.fetchData() // 刷新列表
          this.closeDialogForm()
        }
      })
    },
    // 请选择目标类型
    newTask() {
      this.newTaskDialogFormVisible = true
    },
    handleEdit(id) {
    // 新建任务
      if (id === '') {
        this.pojo = {}
        this.newTask()
      }

      this.nmapPojo = {}
      this.parseList = []
      this.id = id

      if (id !== '') { // 修改
        this.dialogFormVisible = true // 打开窗口
        taskApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
            // 判断任务类型, 开始和结束时间
            this.cron = this.pojo.cronexpression

            if ((this.pojo.worktype === 'nmap' || this.pojo.worktype === 'mass2Nmap') && (this.pojo.starttime != null && this.pojo.endtime != null)) {
              if (this.pojo.checktype && this.pojo.checktype.length !== 0) {
                this.checkedChecktypes = this.pojo.checktype.split(',')
              }
            }
            this.fetchPluginconfigData()
            if (this.pojo.worktype === 'mass2Nmap') {
              this.getNmapConfigByTaskId(id)
            }
            // 获取插件id
            taskpluginconfigApi.findAllByTaskid(id).then(response => {
              if (response.flag) {
                this.taskPluginPojoList = response.data
                this.taskPluginList = response.data
              }
            })

            if (this.pojo.projectid) {
              projectApi.findById(this.pojo.projectid).then(response => {
                if (response.flag) {
                  this.projectName = response.data.name
                }
              })
            }
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除已选记录, 包括 [任务插件配置,子任务] 是否继续? 注意: 删除任务并不会停止当前任务，请确保已停止当前任务', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        taskApi.deleteById(id).then(response => {
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
.el-drawer__body {
   overflow: auto;
}
/* 渐变进度条 */
.el-bg-inner-running .el-progress-bar__inner{
  background-color: unset;
  background-image: linear-gradient(to right, #5991c9 , #6855ff);
}
.el-bg-inner-error .el-progress-bar__inner{
  background-image: linear-gradient(to right, #5991c9 , #fb3a7e);
}
.el-bg-inner-done .el-progress-bar__inner{
  background-image: linear-gradient(to right, #5991c9 , #41b341);
}

</style>
