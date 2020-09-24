<template>
  <div style="height:340px;width:740px" />
</template>

<script>
import echarts from 'echarts'
import charAPi from '@/api/char'

require('echarts/theme/macarons') // echarts theme

export default {
  data() {
    return {
      selected: {},
      seriesData: [],
      legendData: [],
      data: [],
      chart: null
    }
  },
  created() {
    this.getIpPortCount()
  },

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getIpPortCount() {
      charAPi.findServiceCount().then(response => {
        this.data = response.data
      }).then(() => {
        for (var i = 0; i < this.data.length; i++) {
          this.legendData.push(this.data[i].name)
          this.seriesData.push({
            name: this.data[i].name,
            value: this.data[i].value
          })
          this.selected[this.data[i].name] = i < 10
        }
      }).then(() => {
        this.initChart()
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '服务数',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: this.legendData,
          selected: this.selected
        },
        toolbox: {
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        series: [
          {
            name: '服务数',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: this.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }
}
</script>
