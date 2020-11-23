<template>
  <div class="dashboard-container" style="background:#fff">
    <el-tabs v-model="active" type="border-card" @tab-click="handleClick">
      <!-- <el-tab-pane label="dashboard" name="zero" lazy>
        <span>searh for all</span><br>
        <span>任务状态，新发现资产，漏洞，主机，问题点</span>
        <div />
      </el-tab-pane> -->

      <el-tab-pane label="趋势及漏洞" name="first" lazy>
        <v-chart :options="polar" autoresize>   <div> <statistics-chart /></div></v-chart>
      </el-tab-pane>

      <el-tab-pane label="top ip及服务版本" name="second" lazy>
        <el-row type="flex" class="row-bg el-row-two" justify="space-between">
          <el-col :xs="6" :sm="12" :lg="24">
            <v-chart :options="polar" autoresize><div style="height:300px;minWidth:600px"><ip-port-pie-chart /></div></v-chart>
          </el-col>
          <el-col :xs="6" :sm="12" :lg="24">
            <v-chart :options="polar" autoresize><div style="height:300px;minWidth:600px"><ip-port-online-pie-chart /></div></v-chart>
          </el-col>
        </el-row>

        <el-row type="flex" class="row-bg el-row-two" justify="space-between">
          <el-col :xs="6" :sm="12" :lg="24">
            <v-chart :options="polar" autoresize><div style="height:300px;minWidth:600px"><service-count-pie-chart /> </div></v-chart>
          </el-col>
          <el-col :xs="6" :sm="12" :lg="24">
            <v-chart :options="polar" autoresize><div style="height:300px;minWidth:600px"><service-count-online-pie-chart /> </div></v-chart>
          </el-col>
        </el-row>

        <el-row type="flex" class="row-bg el-row-two" justify="space-between">
          <el-col :xs="6" :sm="12" :lg="24">
            <v-chart :options="polar" autoresize>  <div style="height:300px;minWidth:1000px"> <version-count-pie-chart /> </div></v-chart>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg el-row-two" justify="space-between">
          <el-col :xs="6" :sm="12" :lg="24">
            <v-chart :options="polar" autoresize> <div style="height:300px;minWidth:1000px">  <version-count-online-pie-chart /></div></v-chart>
          </el-col>
        </el-row>

        <el-row type="flex" class="row-bg el-row-two" justify="space-between">
          <el-col :xs="6" :sm="12" :lg="24">
            <v-chart :options="polar" autoresize>   <div style="height:300px;minWidth:1000px"> <webinfo-count-pie-chart /></div></v-chart>
          </el-col>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="高危统计" name="third" lazy>
        <el-row type="flex" class="row-bg el-row-two" justify="space-between">
          <el-col :xs="6" :sm="12" :lg="24">
            <v-chart :options="polar" autoresize><div style="height:300px;minWidth:500px"> <risk-port-count-pie-chart /> </div></v-chart>
          </el-col>
          <el-col :xs="6" :sm="12" :lg="24">
            <v-chart :options="polar" autoresize><div style="height:300px;minWidth:500px"> <risk-port-count-online-pie-chart /> </div></v-chart>
          </el-col>
        </el-row>

        <el-row type="flex" class="row-bg el-row-two" justify="space-between">
          <el-col :xs="6" :sm="12" :lg="24">
            <v-chart :options="polar" autoresize><div style="height:300px;minWidth:600px"> <risk-service-count-pie-chart /> </div></v-chart>
          </el-col>
          <el-col :xs="6" :sm="12" :lg="24">
            <v-chart :options="polar" autoresize><div style="height:300px;minWidth:600px"> <risk-service-count-online-pie-chart /> </div></v-chart>
          </el-col>
        </el-row>

        <el-row type="flex" class="row-bg el-row-two" justify="space-between">
          <el-col :xs="6" :sm="12" :lg="24">
            <v-chart :options="polar" autoresize><div style="height:300px;minWidth:600px"> <risk-version-count-pie-chart /> </div></v-chart>
          </el-col>
          <el-col :xs="6" :sm="12" :lg="24">
            <v-chart :options="polar" autoresize><div style="height:300px;minWidth:600px"> <risk-version-count-online-pie-chart /> </div></v-chart>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- <el-tab-pane label="ip标签" name="fourth" lazy />
      <el-tab-pane label="端口标签" name="fifth" lazy /> -->

    </el-tabs>

  </div>

</template>

<script>
import statisticsChart from '@/views/char/StatisticsChart'

import IpPortPieChart from '@/views/char/IpPortPieChart'
import IpPortOnlinePieChart from '@/views/char/IpPortOnlinePieChart'

import ServiceCountPieChart from '@/views/char/ServiceCountPieChart'
import ServiceCountOnlinePieChart from '@/views/char/ServiceCountOnlinePieChart'
import VersionCountPieChart from '@/views/char/VersionCountPieChart'
import VersionCountOnlinePieChart from '@/views/char/VersionCountOnlinePieChart'
import WebinfoCountPieChart from '@/views/char/WebinfoCountPieChart'

import RiskPortCountPieChart from '@/views/char/RiskPortCountPieChart'
import RiskPortCountOnlinePieChart from '@/views/char/RiskPortCountOnlinePieChart'
import RiskServiceCountPieChart from '@/views/char/RiskServiceCountPieChart'
import RiskServiceCountOnlinePieChart from '@/views/char/RiskServiceCountOnlinePieChart'
import RiskVersionCountPieChart from '@/views/char/RiskVersionCountPieChart'
import RiskVersionCountOnlinePieChart from '@/views/char/RiskVersionCountOnlinePieChart'

export default {
  components: {
    statisticsChart,

    // CheckresultVulnPieNestChart,
    // CheckresultVulnOnlinePieNestChart,

    IpPortPieChart,
    IpPortOnlinePieChart,

    ServiceCountPieChart,
    ServiceCountOnlinePieChart,
    VersionCountPieChart,
    VersionCountOnlinePieChart,
    WebinfoCountPieChart,

    RiskPortCountPieChart,
    RiskPortCountOnlinePieChart,
    RiskServiceCountPieChart,
    RiskServiceCountOnlinePieChart,
    RiskVersionCountPieChart,
    RiskVersionCountOnlinePieChart

  },
  data() {
    return {
      // active: 'zero'
      active: 'first'
    }
  },
  watch: {
    active(val) {
      this.active = val
      // console.log(this.$refs)
      // this.$nextTick(() => {
      //   this.$refs.resize()
      // })
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>
