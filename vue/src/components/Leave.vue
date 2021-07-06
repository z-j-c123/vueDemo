<template>
  <el-container style="background-color: white">
    <el-main>
      <el-row class="el_row_style">
        <el-col :span="24">
          <span class="mian_span">请假单</span>
        </el-col>
      </el-row>
      <el-row class="el_row_style">
        <el-col :span="24">
          <p style="text-align: left">
            1.请假务必提前申请；<br />
            2.请假时间按24小时制标准填写（正确示范：9:00-18:00或13：00-23:00等，错误示范：0:00-0:00）；<br />
            3.请假流程以考勤制度为准，个人账户不可为他人填写请假单；<br />
            4.白班请假不足5个小时的按5小时计算，晚班请假不足5.5小时按5.5小时计算，超过则按一天计算；<br />
            5.请婚假、产假、陪产假等特殊假期，需先联系人事沙梨提供相关资料；<br />
            6.病假、婚假、产假必须需在附件处提供相应证明（如正规医院病历证明），不能提供证明一律不予批准。（注：病假当月累计不得超过3天，全年累计不得超过12天）；<br />
          </p>
        </el-col>
      </el-row>
      <el-row class="el_row_style">
        <el-col :span="24"></el-col>
      </el-row>
      <el-main>
        <router-view :isfooter="isfooter" :form="form"></router-view>
      </el-main>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "Leave",
  data() {
    return {
      isfooter: true,
      form: {
        username: JSON.parse(sessionStorage.getItem("user_info")).username,
        job_num: JSON.parse(sessionStorage.getItem("user_info")).jobnum,
        nowDate: this.$moment().format("YYYY-MM-DD"),
        job_time: JSON.parse(sessionStorage.getItem("user_info")).job_time,
        job_type:
          JSON.parse(sessionStorage.getItem("user_info")).job_type == 0
            ? "试用期"
            : "正式工",
        radio: "",
        radio_name: "",
        sur_vac: 0,
        textarea: "",
        phone: JSON.parse(sessionStorage.getItem("user_info")).tel,
      },
    };
  },
};
</script>
<style>
.mian_span {
  font-size: 40px;
  text-align: center;
}
.el-radio {
  margin-right: 10px;
  font-size: 14px;
}
</style>