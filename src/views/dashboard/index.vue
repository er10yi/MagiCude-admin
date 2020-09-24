<template>
  <div class="dashboard-container" style="background:#fff;padding:0 80px 0">

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <statistics-line-chart />
        </div>
      </el-col>
    </el-row> -->
    <el-row type="flex" justify="start">
      <el-col :span="24">
        <div> <statistics-line-chart /></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import StatisticsLineChart from '@/views/char/components/StatisticsLineChart'

export default {
  components: {
    StatisticsLineChart
  }
}
</script>
