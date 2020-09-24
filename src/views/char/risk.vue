<template>
  <div style="height:100%;width:100%;background:#fff">
    <br>
    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div><risk-port-count-pie-chart /></div>
      </el-col>
      <el-col :span="24">
        <div><risk-port-count-online-pie-chart /></div>
      </el-col>
    </el-row>
    <br>
    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div><risk-service-count-pie-chart /></div>
      </el-col>
      <el-col :span="24">
        <div><risk-service-count-online-pie-chart /></div>
      </el-col>
    </el-row>
    <br>
    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div> <risk-version-count-pie-chart /></div>
      </el-col>
      <el-col :span="24">
        <div><risk-version-count-online-pie-chart /></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import RiskPortCountPieChart from '@/views/char/components/RiskPortCountPieChart'
import RiskPortCountOnlinePieChart from '@/views/char/components/RiskPortCountOnlinePieChart'
import RiskServiceCountPieChart from '@/views/char/components/RiskServiceCountPieChart'
import RiskServiceCountOnlinePieChart from '@/views/char/components/RiskServiceCountOnlinePieChart'
import RiskVersionCountPieChart from '@/views/char/components/RiskVersionCountPieChart'
import RiskVersionCountOnlinePieChart from '@/views/char/components/RiskVersionCountOnlinePieChart'

export default {
  components: {
    RiskPortCountPieChart,
    RiskPortCountOnlinePieChart,
    RiskServiceCountPieChart,
    RiskServiceCountOnlinePieChart,
    RiskVersionCountPieChart,
    RiskVersionCountOnlinePieChart

  }
}
</script>
