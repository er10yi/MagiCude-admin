<template>
  <div style="height:100%;width:100%;background:#fff">
    <br>
    <el-row type="flex" class="row-bg el-row-two" justify="space-between">
      <el-col :xs="6" :sm="12" :lg="24">
        <v-chart :options="polar" autoresize><div ref="ipDiv" style="height:300px" /></v-chart>
      </el-col>
      <el-col :xs="6" :sm="12" :lg="24">
        <v-chart :options="polar" autoresize><div ref="portDiv" style="height:300px" /></v-chart>
      </el-col>
    </el-row>
    <br>
    <el-row type="flex" class="row-bg el-row-two" justify="space-between">
      <el-col :xs="6" :sm="12" :lg="24">
        <v-chart :options="polar" autoresize><div ref="checkresultDiv" style="height:300px" /></v-chart>
      </el-col>
      <el-col :xs="6" :sm="12" :lg="24">
        <v-chart :options="polar" autoresize><div ref="riskDiv" style="height:300px" /></v-chart>
      </el-col>
    </el-row>
    <br><br>
    <el-row type="flex" class="row-bg el-row-two" justify="space-between">
      <el-col :xs="6" :sm="12" :lg="24">
        <v-chart :options="polar" autoresize> <div style="height:300px"><checkresult-vuln-pie-nest-chart /></div></v-chart>
      </el-col>
      <el-col :xs="6" :sm="12" :lg="24">
        <v-chart :options="polar" autoresize> <div style="height:300px"><checkresult-vuln-online-pie-nest-chart /></div></v-chart>
      </el-col>
    </el-row>

  </div>

</template>

<script>
import echarts from 'echarts'
import charAPi from '@/api/char'
import CheckresultVulnPieNestChart from '@/views/char/CheckresultVulnPieNestChart'
import CheckresultVulnOnlinePieNestChart from '@/views/char/CheckresultVulnOnlinePieNestChart'

require('echarts/theme/macarons') // echarts theme

export default {
  components: {

    CheckresultVulnPieNestChart,
    CheckresultVulnOnlinePieNestChart
  },

  data() {
    return {
      ipCountData: [],
      ipCountOnlineData: [],
      portCountData: [],
      portCountOnlineData: [],
      checkresultCountData: [],
      checkresultCountOnlineData: [],
      infoCountData: [],
      lowCountData: [],
      mediumCountData: [],
      highCountData: [],
      criticalCountData: [],
      fatalCountData: [],
      infoCountOnlineData: [],
      lowCountOnlineData: [],
      mediumCountOnlineData: [],
      highCountOnlineData: [],
      criticalCountOnlineData: [],
      fatalCountOnlineData: [],
      riskportCountData: [],
      riskportCountOnlineData: [],
      riskserviceCountData: [],
      riskserviceCountOnlineData: [],
      riskversionCountData: [],
      riskversionCountOnlineData: [],
      ipChart: null,
      portChart: null,
      checkresultChart: null,
      riskChart: null,
      date: []
    }
  },
  created() {
    this.getAllStatistics()
  },
  beforeDestroy() {
    if (!this.ipChart || !this.portChart || !this.checkresultChart || !this.riskChart) {
      return
    }
    this.ipChart.dispose()
    this.ipChart = null
    this.portChart.dispose()
    this.portChart = null
    this.checkresultChart.dispose()
    this.checkresultChart = null
    this.riskChart.dispose()
    this.riskChart = null
  },
  methods: {
    getAllStatistics() {
      charAPi.findAllStatistics().then(response => {
        this.data = response.data
        for (let i = 0; i < this.data.length; i++) {
          const baseDate = new Date(this.data[i].updatetime)
          this.date.push([baseDate.getFullYear(), baseDate.getMonth() + 1, baseDate.getDate()].join('/'))
          this.ipCountData.push(this.data[i].ipcount)
          this.ipCountOnlineData.push(this.data[i].ipcountonline)

          this.portCountData.push(this.data[i].portcount)
          this.portCountOnlineData.push(this.data[i].portcountonline)

          this.checkresultCountData.push(this.data[i].checkresultcount)
          this.checkresultCountOnlineData.push(this.data[i].checkresultcountonline)
          this.infoCountData.push(this.data[i].infocount)
          this.lowCountData.push(this.data[i].lowcount)
          this.mediumCountData.push(this.data[i].mediumcount)
          this.highCountData.push(this.data[i].highcount)
          this.criticalCountData.push(this.data[i].criticalcount)
          this.fatalCountData.push(this.data[i].fatalcount)
          this.infoCountOnlineData.push(this.data[i].infocountonline)
          this.lowCountOnlineData.push(this.data[i].lowcountonline)
          this.mediumCountOnlineData.push(this.data[i].mediumcountonline)
          this.highCountOnlineData.push(this.data[i].highcountonline)
          this.criticalCountOnlineData.push(this.data[i].criticalcountonline)
          this.fatalCountOnlineData.push(this.data[i].fatalcountonline)

          this.riskportCountData.push(this.data[i].riskportcount)
          this.riskportCountOnlineData.push(this.data[i].riskportcountonline)
          this.riskserviceCountData.push(this.data[i].riskservicecount)
          this.riskserviceCountOnlineData.push(this.data[i].riskservicecountonline)
          this.riskversionCountData.push(this.data[i].riskversioncount)
          this.riskversionCountOnlineData.push(this.data[i].riskversioncountonline)
        }
      }).then(() => {
        this.initIpChart()
        this.initPortChart()
        this.initCheckresultChart()
        this.initRiskChart()
      })
    },
    initIpChart() {
      this.ipChart = echarts.init(this.$refs.ipDiv, 'macarons')
      this.ipChart.setOption({
        title: {
          text: '资产ip',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '10%']
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.date
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [{
          type: 'inside',
          start: 70, // 数据窗口范围的起始百分比,表示30%
          end: 100 // 数据窗口范围的结束百分比,表示70%
        }, {
          start: 0,
          end: 10,
          handleSize: '80%'

        }],
        series: [
          {
            name: 'ip总数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.ipCountData
          },
          {
            name: '未下线ip数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.ipCountOnlineData
          }
        ]
      })
    },
    initPortChart() {
      this.portChart = echarts.init(this.$refs.portDiv, 'macarons')

      this.portChart.setOption({
        title: {
          text: '资产端口',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '10%']
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.date
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [{
          type: 'inside',
          start: 70, // 数据窗口范围的起始百分比,表示30%
          end: 100 // 数据窗口范围的结束百分比,表示70%
        }, {
          start: 0,
          end: 10,
          handleSize: '80%'

        }],
        series: [
          {
            name: '端口总数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.portCountData
          },
          {
            name: '未下线端口数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.portCountOnlineData
          }
        ]
      })
    },
    initCheckresultChart() {
      this.checkresultChart = echarts.init(this.$refs.checkresultDiv, 'macarons')

      this.checkresultChart.setOption({
        title: {
          text: '检测结果',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '10%']
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.date
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [{
          type: 'inside',
          start: 70, // 数据窗口范围的起始百分比,表示30%
          end: 100 // 数据窗口范围的结束百分比,表示70%
        }, {
          start: 0,
          end: 10,
          handleSize: '80%'

        }],
        series: [
          {
            name: '检测结果总数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.checkresultCountData
          },
          {
            name: '未修复',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.checkresultCountOnlineData
          },
          {
            name: '信息',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.infoCountData
          },
          {
            name: '未修复信息',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.infoCountOnlineData
          },
          {
            name: '低危',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.lowCountData
          },
          {
            name: '未修复低危',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.lowCountOnlineData
          },
          {
            name: '中危',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.mediumCountData
          },
          {
            name: '未修复中危',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.mediumCountOnlineData
          },
          {
            name: '高危',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.highCountData
          },
          {
            name: '未修复高危',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.highCountOnlineData
          },
          {
            name: '严重',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.criticalCountData
          },
          {
            name: '未修复严重',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.criticalCountOnlineData
          },
          {
            name: '致命',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.fatalCountData
          },
          {
            name: '未修复致命',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.fatalCountOnlineData
          }
        ]
      })
    },
    initRiskChart() {
      this.riskChart = echarts.init(this.$refs.riskDiv, 'macarons')

      this.riskChart.setOption({
        title: {
          text: '高危资产',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '10%']
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.date
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [{
          type: 'inside',
          start: 70, // 数据窗口范围的起始百分比,表示30%
          end: 100 // 数据窗口范围的结束百分比,表示70%
        }, {
          start: 0,
          end: 10,
          handleSize: '80%'

        }],
        series: [
          {
            name: '端口数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.riskportCountData
          },
          {
            name: '未下线端口数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.riskportCountOnlineData
          },
          {
            name: '服务数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.riskserviceCountData
          },
          {
            name: '未下线服务数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.riskserviceCountOnlineData
          },
          {
            name: '版本数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.riskversionCountData
          },
          {
            name: '未下线版本数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            data: this.riskversionCountOnlineData
          }
        ]
      })
    }
  }
}
</script>

