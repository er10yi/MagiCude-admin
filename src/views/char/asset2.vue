<template>
  <div style="height:100%;width:100%;background:#fff">
    <br>
    <el-row type="flex" justify="start">
      <el-col :span="24">
        <div> <version-count-pie-chart /> </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start">
      <el-col :span="24">
        <div>  <version-count-online-pie-chart /></div>
      </el-col>
    </el-row>
    <br>
    <el-row type="flex" justify="start">
      <el-col :span="24">
        <div>  <webinfo-count-pie-chart /></div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import VersionCountPieChart from '@/views/char/components/VersionCountPieChart'
import VersionCountOnlinePieChart from '@/views/char/components/VersionCountOnlinePieChart'
import WebinfoCountPieChart from '@/views/char/components/WebinfoCountPieChart'
export default {
  components: {
    VersionCountPieChart,
    VersionCountOnlinePieChart,
    WebinfoCountPieChart

  }
}
</script>
