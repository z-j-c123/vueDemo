<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="10">
        <span class="longin_span">欢迎登录</span>
      </el-col>
      <el-col :span="6" :offset="6"></el-col>
    </el-row>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="工号:">
        <el-input
          v-model="form.job_num"
          placeholder="请输入一下工号吧"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码:">
        <el-input
          v-model="form.pwd"
          show-password
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="8">
            <router-link :to="'Register'">来注册一个账号吧</router-link>
          </el-col>
          <el-col :span="6" :offset="8">
            <router-link :to="'Register'">哇哦忘记密码</router-link>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" plain>登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        job_num: null,
        pwd: "",
      },
    };
  },
  methods: {
    onSubmit() {
      this.$axios
        .post("/login", {
          jobnum: this.form.job_num,
          pwd: this.form.pwd,
        })
        .then((result) => {
          // 成功
          if (result.data.pwd === this.form.pwd) {
            sessionStorage.setItem("user_info", JSON.stringify(result.data));
            this.$router.replace({ name: "Main" });
          } else {
            this.$message.error(result.data);
          }
        });
    },
  },
};
</script>
<style>
</style>