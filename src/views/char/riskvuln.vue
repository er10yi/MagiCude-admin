<template>
  <div style="height:100%;width:100%;background:#fff">

    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div><checkresult-vuln-pie-nest-chart /></div>
      </el-col>
      <el-col :span="24">
        <div><checkresult-vuln-online-pie-nest-chart /></div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import CheckresultVulnPieNestChart from '@/views/char/components/CheckresultVulnPieNestChart'
import CheckresultVulnOnlinePieNestChart from '@/views/char/components/CheckresultVulnOnlinePieNestChart'

export default {
  components: {
    CheckresultVulnPieNestChart,
    CheckresultVulnOnlinePieNestChart

  }
}
</script>
