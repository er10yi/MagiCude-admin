<template>
  <div style="height:340px;width:700px" />
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
      riskvulndata: [],
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
      charAPi.findRiskCount().then(response => {
        this.data = response.data
      }).then(() => {
        for (var i = 0; i < this.data.length; i++) {
          this.legendData.push(this.data[i].name)
          this.seriesData.push({
            name: this.data[i].name,
            value: this.data[i].value
          })
          this.selected[this.data[i].name] = i < 7
        }
      }).then(() => {
        charAPi.findRiskVulnCount().then(response => {
          this.riskvulndata = response.data
        }).then(() => {
          for (var i = 0; i < this.riskvulndata.length; i++) {
            this.legendData.push(this.riskvulndata[i].name)
            this.seriesData.push({
              name: this.riskvulndata[i].name,
              value: this.riskvulndata[i].value
            })
            this.selected[this.riskvulndata[i].name] = i < 100
          }
        }).then(() => {
          this.initChart()
        })
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '检测结果数',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 0,
          top: 20,
          bottom: 20,
          data: this.legendData
          // selected: this.selected
        },
        toolbox: {
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        series: [
          {
            name: '风险',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
              position: 'inner'
            },
            labelLine: {
              show: false
            },
            data: this.data
          },
          {
            name: '漏洞',
            type: 'pie',
            radius: ['40%', '55%'],
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            },
            data: this.riskvulndata
          }
        ]
      })
    }
  }
}
</script>
