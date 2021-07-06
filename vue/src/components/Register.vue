<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="10">
        <span class="longin_span">欢迎注册</span>
      </el-col>
      <el-col :span="6" :offset="6"></el-col>
    </el-row>
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      status-icon
      :rules="rules"
    >
      <el-form-item label="工号:" prop="job_num">
        <el-input v-model="form.job_num" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="名称:" prop="name">
        <el-input v-model="form.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="pwd">
        <el-input
          type="password"
          v-model="form.pwd"
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码:" prop="checkPass">
        <el-input
          type="password"
          v-model="form.checkPass"
          autocomplete="off"
          placeholder="再次输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别:" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio label="小哥哥"></el-radio>
          <el-radio label="小姐姐"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="破壳日:" prop="birthday">
        <el-date-picker
          type="date"
          placeholder="小可爱出生了"
          v-model="form.birthday"
          style="width: 100%; margin-left: 10px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="email" label="邮箱:">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="手机号:">
        <el-input v-model="form.phone" placeholder="call me"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')" plain
          >注册</el-button
        >
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "Register",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        job_num: null,
        name: "",
        pwd: "",
        sex: "",
        checkPass: "",
        birthday: "",
        email: "",
        phone: "",
      },
      rules: {
        pwd: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            min: 11,
            max: 11,
            message: "你是不是不想我有故事呀",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.$axios.get("/usercount").then((result) => {
      this.form.job_num = result.data;
    });
  },
  methods: {
    onSubmit() {
      let data = {
        jobnum: this.form.job_num,
        username: this.form.name,
        pwd: this.form.pwd,
        sex: this.form.sex,
        tel: this.form.phone,
        email: this.form.email,
        birthday: this.form.birthday,
        job_time: this.$moment().format("YYYY-MM-DD"),
        job_type: 0,
        leave_type: [
          { type: 1, leave_name: "事假", sur_vac: 0 },
          { type: 2, leave_name: "病假", sur_vac: 24 },
          { type: 3, leave_name: "婚假", sur_vac: 8 },
          { type: 4, leave_name: "丧假", sur_vac: 12 },
          { type: 5, leave_name: "产假", sur_vac: 120 },
          { type: 6, leave_name: "年假", sur_vac: 5 },
        ],
        wages: 0,
        power: 0,
        leave: [],
        sgin: [],
      };
      this.$axios.post("/register", data).then((result) => {
        // 成功
        this.$router.replace("/Login");
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style>
.el-radio {
  margin-right: 200px;
  font-size: 14px;
}
.el-radio__label {
  font-size: 16px;
}
</style>