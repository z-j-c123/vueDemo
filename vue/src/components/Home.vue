<template >
  <el-container class="background">
    <el-main class="home_main">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="8"><div class="log_span">员工内部OA系统</div></el-col>
        <el-col :span="7">
          <el-card class="box-card">
            <router-view></router-view>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
};
</script>

<style >
@import "../assets/style/font.less";
.background {
  width: 100%;
  height: 100%;
  /* 此图来自百度注册 */
  background: url("../assets/img/login-backgroud-img.jpg") no-repeat center /
    cover;
}
a {
  text-decoration: none;
  font-size: 16px;
  color: gray;
}
.el-input__inner {
  width: 95%;
}
.el-form-item__label {
  font-size: 16px;
}
.log_span {
  letter-spacing: 0.1em;
  margin-top: 150px;
  font-family: "syst";
  font-size: 70px;
  color: aliceblue;
}
.box-card {
  opacity: 0.9;
}

.el-form-item {
  margin-bottom: 32px;
}
.longin_span {
  font-size: 30px;
}
.home_main {
  color: #333;
  text-align: center;
  line-height: 160px;
  margin: auto;
}
.el-button {
  width: 100px;
}
</style>
