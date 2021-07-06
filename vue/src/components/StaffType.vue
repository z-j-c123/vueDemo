<template >
  <el-container style="background-color: white">
    <el-main>
      <el-row class="el_row_style">
        <el-col :span="24">
          <span class="mian_span">劳务申请</span>
        </el-col>
      </el-row>

      <el-row class="el_row_style">
        <el-col :span="24"></el-col>
      </el-row>
      <el-main>
        <el-form ref="form" :model="form">
          <el-main>
            <el-row>
              <el-col :span="6" class="el_row_style">
                <span>工号</span>
              </el-col>
              <el-col :span="6" style="height: 50px">
                <el-form-item class="el_row_style">
                  <span>{{ form.jobnum }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" class="el_row_style">
                <span>姓名</span>
              </el-col>
              <el-col :span="6" class="el_row_style">
                <span>{{ form.username }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="el_row_style">
                <span>填表日期</span>
              </el-col>
              <el-col :span="4" style="height: 50px">
                <el-form-item class="el_row_style">
                  <span>{{ form.nowDate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="el_row_style">
                <span>入职时间</span>
              </el-col>
              <el-col :span="4" style="height: 50px">
                <el-form-item class="el_row_style">
                  <span>{{ form.job_time }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="el_row_style">
                <span>劳务关系</span>
              </el-col>
              <el-col :span="4" style="height: 50px">
                <el-form-item class="el_row_style">
                  <span>{{ form.job_type }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="el_row_style">
                <span>申请类型</span>
              </el-col>
              <el-col :span="10" style="height: 50px">
                <el-form-item class="el_row_style">
                  <el-radio-group v-model="form.radio">
                    <el-radio :label="1">转正</el-radio>
                    <el-radio :label="-1">离职</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="el_row_style">
                <span>联系方式</span>
              </el-col>
              <el-col :span="6" style="height: 50px">
                <el-form-item class="el_row_style">
                  <span>{{ form.phone }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="el_row_style">
                <span>申请原因</span>
              </el-col>
              <el-col :span="20" style="height: 50px">
                <el-form-item class="el_row_style">
                  <el-input
                    resize="none"
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="form.textarea"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-main>
          <el-footer style="margin-top: 50px">
            <el-row>
              <el-col :span="12">
                <el-form-item>
                  <el-button type="primary" plain @click="resetForm('form')"
                    >重置</el-button
                  >
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <el-button type="success" plain @click="submitForm('form')"
                    >提交</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-footer>
        </el-form>
      </el-main>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "StaffType",
  data() {
    return {
      sonFrom: {},
      form: {
        username: JSON.parse(sessionStorage.getItem("user_info")).username,
        jobnum: JSON.parse(sessionStorage.getItem("user_info")).jobnum,
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
  created() {
     
  },
  watch: {
    form: {
      deep: true, // 深度监听
      handler(newVal) {
        let job_t = JSON.parse(sessionStorage.getItem("user_info")).job_type;
        if (job_t === newVal.radio) {
          this.$message.error("你已经转正了");
          this.form.radio = "";
        }
      },
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            jobnum: this.form.jobnum,
            labor_relations: [
              {
                labor_nowdate: this.form.nowDate,
                labor_reason: this.form.textarea,
                type_radio: this.form.radio,
                labor_state:0
              },
            ],
          };
          this.$axios.post("/labor_relations", data).then((result) => {
            if (this.form.radio === 1) {
              this.$message({
                message: "提交了转正的申请",
                type: "success",
              });
            } else {
              this.$message("提交了离职申请");
            }
            this.resetForm()
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.form.leave_time = [];
      this.form.radio = "";
      this.form.textarea = "";
      this.form.sur_vac = 0;
    },
  },
};
</script>
<style >
.el_row_style {
  min-height: 50px;
  text-align: center;
  border: 1px solid gray;
  line-height: 50px;
}
.el-form-item {
  margin-bottom: 0px;
}
.el-form-item__content {
  line-height: 50px;
  position: relative;
  font-size: 14px;
  min-height: 50px;
}
textarea {
  height: 50px;
  font-size: 20px;
}
.el-textarea__inner {
  font-size: 16px;
}
.mian_span {
  font-size: 40px;
  text-align: center;
}
</style>