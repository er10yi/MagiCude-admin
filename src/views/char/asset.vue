<template>
  <div style="height:100%;width:100%;background:#fff">
    <br>
    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div><ip-port-pie-chart /></div>
      </el-col>
      <el-col :span="24">
        <div><ip-port-online-pie-chart /></div>
      </el-col>
    </el-row>
    <br>
    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div><service-count-pie-chart /> </div>
      </el-col>
      <el-col :span="24">
        <div><service-count-online-pie-chart /> </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import IpPortPieChart from '@/views/char/components/IpPortPieChart'
import IpPortOnlinePieChart from '@/views/char/components/IpPortOnlinePieChart'
import ServiceCountPieChart from '@/views/char/components/ServiceCountPieChart'
import ServiceCountOnlinePieChart from '@/views/char/components/ServiceCountOnlinePieChart'

export default {
  components: {
    IpPortPieChart,
    IpPortOnlinePieChart,
    ServiceCountPieChart,
    ServiceCountOnlinePieChart
  }
}
</script>
